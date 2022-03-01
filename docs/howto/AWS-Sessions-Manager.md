---
id: AWS-Sessions-Manager
title: AWS Sessions Manager
sidebar_label: AWS Sessions Manager
---
### AWS Sessions Manager

> Point of Contact: Arunkumar R

> Last Reviewed Date: 11/02/2021
 
### 1. Overview
#### 1.1. Purpose 

   AWS Session Manager is a fully managed AWS Systems Manager capability that lets you manage your Amazon EC2 instances through an interactive one-click browser-based shell or through the AWS CLI. Session Manager provides secure and auditable instance management without the need to open inbound ports, maintain bastion hosts, or manage SSH keys. Session Manager also makes it easy to comply with corporate policies that require controlled access to instances, strict security practices, and fully auditable logs with instance access details, while still providing end users with simple one-click cross-platform access to your Amazon EC2 instances. 

* Approved alternative to SSH 

   AWS Systems Manager – Session Manger

   HCC Doc - https://cloud.optum.com/docs/technical-guides/ssm-session-manager

   Docs - https://docs.aws.amazon.com/systems-manager/latest/userguide/session-manager.html 

* EC2 Sessions Manager to Connect to Windows EC2 Instance

   Wiki - https://github.optum.com/oaccoe/wiki/wiki/EC2-Sessions-Manager-to-Connect-to-Windows-EC2-Instance

##### Why use Session Manager?

   It is well known that we can not directly connect to a private EC2 instance unless there is VPN Connectivity or Direct Connect or other network connectivity source with the VPC. A common approach to connect to an EC2 instance on a private subnet of your VPC is to use a Bastion Host.

   A Bastion Host is a server whose purpose is to provide access to a private network from an external network (such as the Internet). Because of its exposure to potential attacks, a bastion host must minimize the chances of penetrations. When using a bastion host, you log into the bastion host first, and then into your target private instance. With this approach, only the bastion host will have an external IP address.
  
However, there are some drawbacks:

    You will need to allow SSH inbound rule at your bastion
    You need to open ports on your private EC2 instance in order to connect it to your bastion
    You will need to manage the SSH key credentials of your users: You will need to generate an ssh key pair for each user or get a copy of the same SSH key for your users
    Cost: The bastion host also has a cost associated with it as it is a running EC2 instance. Even a t2.micro costs about $10/month.
    
   Session Manager can be used to access instances within private subnets that allow no ingress from the internet. AWS SSM provides the ability to establish a shell on your systems through its native service, or by using it as a tunnel for other protocols, such as Secure Shell (SSH). Advantages:

    It will log the commands issued during the session, as well as the results. You can save the logs in s3 if you wish.
    Shell access is completely contained within Identity and Access Management (IAM) policies, you won’t need to manage SSH keys
    The user does not need to use a bastion host and Public IPs.
    No need to open the ports in the security groups

#### 1.2. Scope

   The scope of this documentation is that the Session Manager can be used to access instances within private subnets without an ingress from the internet. AWS SSM provides the ability to establish a shell on your systems through its native service, or by using it as a tunnel for other protocols, such as Secure Shell (SSH)
 
### 2. Prerequisites
#### Session Manager Plugin

   You will need to Install the Session Manager plugin for the AWS CLI in order to use the CLI to start and end sessions that connect you to your managed instances.

   You can check on how to install the plugin for different OS here(https://docs.aws.amazon.com/systems-manager/latest/userguide/session-manager-working-with-install-plugin.html).


### 3. Diagram

   The following image shows the actual configuration that we are using:

![](https://github.optum.com/oaccoe/CCOE-Site/raw/master/static/img/session-manager-config-architecture.png)

### 4. Configuration steps

#### Accessing Private EC2 instance with Session Manager

   We will set up a private EC2 instance (in a private subnet), and use SSM session manager to access the instance that hosts a Jupyter Notebook server. We will then use PostForwarding with AWS Session Manager to access our server from our local machine.

   We'll set up this infrastructure without opening inbound ports or setting up bastion hosts or managing SSH keys!.
      
#### 4.1. Network Configuration

   Before creating the EC2 instance, you will need a VPC with a Public and Private Subnets. Since will be hosting a Jupyter Notebook on our instance located on the Private Subnet, it will need internet access (so that we can install and update Python packages).

   In order to give access to the internet to our private subnet we will be using a NAT Gateway. In addition, to enable internet connectivity, this gateway make sure that the internet doesn’t initiate a connection with the instance.

   The network configuration that will be used is represented below:
![](https://github.optum.com/oaccoe/CCOE-Site/raw/master/static/img/ec2-system-manager-architecture.png)

#### 4.2. Configuring your EC2 instance

   Our instance will be deployed on the Private Subnet without a Public IP address configuration since we won't need it.

   In order to allow Session Manager access to our instance will need to attach the following IAM role: AmazonSSMManagedInstanceCore. This policy grant instances the permissions needed for core Systems Manager functionality.

   For the VPC security group, we won't need to include any inbound rules, allowing only outbound traffic.

VPC security group
```
resource "aws_security_group" "private_sg" {
  name        = "${var.name}-private-sg"
  description = "Security Group for Private EC2 instance"
  vpc_id      = data.aws_vpc.selected.id

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "${var.name}-private-sg"
    Product = var.name
  }
}
```
EC2 instance
```
resource "aws_instance" "private_server" {
  ami                         = var.image_ami
  associate_public_ip_address = false
  disable_api_termination     = true
  instance_type               = var.instance_type
  key_name                    = var.key_name
  vpc_security_group_ids      = [aws_security_group.private_sg.id]
  subnet_id                   = element(tolist(data.aws_subnet_ids.private.ids), 0)
  iam_instance_profile        = aws_iam_instance_profile.ec2_instance_profile.name

  tags = {
    Name    = "${var.name}-private-server"
    Product = var.name
  }

  volume_tags = {
    Name    = "${var.name}-private-server-volume"
    Product = var.name
  }
}
```

#### 4.3. Session Manager — Start a session

   With everything set up you can access your instance from the command line:

`$ aws ssm start-session --target {YOUR_TARGET_INSTANCE_ID}`

   It's important to notice that the connection was successfully made without opening any port at the EC2 Security Group and without a Bastion Host!

   Session Manager has an in-built audit log: AWS Session Manager provides audit logs by default; so each command is logged and stored in CloudWatch Logs or an S3 bucket as per necessary security and compliance regulations.

#### 4.4. Session Manager — Port Forwarding

   Many teams use SSH Tunnel to remotely access services not exposed to the public internet. We can use SSH tunneling to connect to RDS, Redshift and other servies which are hosted in the private subnets. Basically, the SSH client listens for connections on a configured port, and when it receives a connection, it tunnels the connection to an SSH server. The server connects to a configurated destination port, possibly on a different machine than the SSH server.

   In OpenSSH, local port forwarding is configured using the -L option:

`ssh -L 9999:localhost:8888 ec2-user@instanceid`

   This example opens a connection to the instance as ec2-user, open port 9999 on the local computer, a forward everything from there to localhost:8888.

   Port Forwarding for AWS System Manager Session Manager allows you to securely create tunnels between your instances deployed in private subnets, without the need to start the SSH service on the server, to open the SSH port in the security group, or the need to use a bastion host.

#### 4.5. Port Forwarding to access Jupyter Notebook server running on a private instance

   We won’t go through on how to set up a Jupyter Notebook Server on an EC2 instance, but you can find all the information need to do so on this link. This can be done similarly for other RDS, Redshift, etc...

   Once the prerequisites are met, you use the AWS CLI to create the tunnel:

`$ aws ssm start-session --target {YOUR_TARGET_INSTANCE_ID} --document-name AWS-StartPortForwardingSession --parameters "portNumber"=["8888"],"localPortNumber"=["8888"]`
  
  Reference: https://towardsdatascience.com/going-bastion-less-accessing-private-ec2-instance-with-session-manager-c958cbf8489f

### 5. Benefits ###

- Centralized access control to instances using IAM policies
- No open inbound ports and no need to manage bastion hosts or SSH keys
- One-click access to instances from the console and CLI
- Port forwarding
- Cross-platform support for Windows, Linux, and macOS
- Logging and auditing session activity

