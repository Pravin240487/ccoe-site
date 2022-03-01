---
id: AWS-Egress-Proxy
title: AWS Egress Proxy
sidebar_label: AWS Egress Proxy
---
## AWS Egress Proxy With ECS Squid Proxy Farm

> Point of Contact: -, Surendar

> Last Reviewed Date: 11/02/2021

### Overview

Controlling outbound communication from your Amazon Virtual Private Cloud (Amazon VPC) to the internet is an important part of Network security. By limiting outbound traffic to certain trusted domains (called “whitelisting”, by default all the URLS are blocked) you help prevent instances from downloading malware, communicating with bot networks, or attacking internet hosts.

The objective of this module is to control the outbound internet access and logging it.
Since squid is open source software, can be installed in Amazon linux instancee and stored the containerized image in AWS ECR.

This module benefits us 
1. We are using Amazon Linux  OS for proxy servers in ECS so No servers to Maintain/Update/Upgrade
2. Provides a secure internet connection with masking of source IP
3. Internet access using a proxy with a controlled whitelist/blacklist
4. Using autoscaling, highly available and scale in and out as per CPU or Memory metrics

### Comparison between NAT Gateway & Proxy servers

| NAT gateway | Proxy |
|----------------|---------------|
|NAT works at the network layer|Proxy at the application layer|
|NAT is transparent to various applications|Proxy must resort to the IP address of the proxy server specified in application programs|
|NAT is not targeted at applications|Proxy supports only HTTP, only web servers can be accessed through the proxy, but not FTP. In terms of Internet access|
|NAT is less resource intensive and simpler to configure than Proxy servers|Proxy servers are generally more powerful and flexible|
|NAT requires no configuration on the clients beyond setting the appropriate gateway in the routing table|A proxy server generally requires the client to be configured to use the proxy|

### Architecture Diagram
![](https://github.optum.com/raw/oaccoe/CCOE-Site/master/static/img/AWS_Egress_Proxy_Architecture.PNG)

### Traffic Flow
![](https://github.optum.com/raw/oaccoe/CCOE-Site/master/static/img/aws_egress_proxy_network_flow.PNG)

### Module Operation
Using the below example module, anyone can create squid proxy farm.

[AWS egress proxy example module](https://github.optum.com/oaccoe/aws_egress_proxy).

### This module will create below services
#### 1.  VPC with internet gateway
we are creating the VPC with Public and private subnets. Public subnets are associated with Internet gateway. Public subnets & private subnets are placed in all avaialablity zones. Private subnets are associated with the VPC endpoints.

#### 2.  EC2 - private test instance
Private EC2 test instance created with amazon linux 2 ami and placed in private internet access with out NAT gateway, so there is no internet connection (either inbound or outboud).

#### 3.  ECS and associated components
ECS cluster created in fargate mode with autoscaling. All performance telemetry data sending to cloudwatch log group. We can define how many tasks should be provisioned at the time of provisioning. Tasks will spread accross different avaialblity zones (Ex: if you create 4 tasks, they will be in 4 different AZs).

#### 4.  NLB with target group
Network load balancer created and placed in public subnets with custom port httpd listener 3128 (Squid proxy port - 3128).

#### 5.  Lambda
we are usign lambda to build or rebuild the docker tasks with update whitelisted URLs. Whenever we are adding the Whitelisting URL in aws secret manager lambda will initiate and restart the tasks. This build artifacts are stored in S3.

#### 6.  S3
we are using S3 bucket for storing the lambda build artifact.

#### 7.  VPC endpoints for Session manager
To access the Private instance through system manager Run command or session manager, private instance should have outbound internet access, but in our case we are restricting the outbound internet access, so we have created the VPC endpoint to enable communication from private EC2 test instance to system manger.

#### 8.  AWS Secret manager
AWS secret manager keep track of whitelist URLs. If there is any update on the secret manager, api call will initiate the lambda to restart the tasks with the updated list.

#### 9.  Cloudwatch log group 
Cloudwatch log group for Secret manager update, task telemetry & squid access logs. 

Since we have created the Private EC2 instance with out keypair, password authentication and key based authentication will not work, so login into the Private EC2 instance using session manager. Set the http_proxy and https_proxy in server inorder to route all http and https traffic to use the proxy URL to connect the destination URL (example: google.com)

#### Notes:
* This solution does not serve applications that aren’t proxy capable. Deep packet inspection is also out of scope.
* Autocaling is not supported on Network receive and send metrics.
* Editing the squid.conf file manually is not possible.
* we cannot re use the same AWS secret manager's secret name with in 7 days until it deletes with out recovery option. To reuse the same secret manger secret name again, delete the secret with no recover option.
