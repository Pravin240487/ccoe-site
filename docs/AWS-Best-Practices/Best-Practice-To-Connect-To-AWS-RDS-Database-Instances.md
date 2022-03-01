---
id: Best-Practice-To-Connect-To-AWS-RDS-Database-Instances
title: Connecting to AWS RDS Database Instances
sidebar_label: Connecting to AWS RDS Database Instances
---
This guide is about connecting to AWS RDS Database instances which are running in the private subnets. It is always very essential to run create an RDS instances in the private subnet so that it is highly secured and also to make sure that public option is set to false for the RDS instances.


## Connect from Datacentre or laptop through SSH Tunneling using AWS Session Manager.

![Connecting to RDS via Sessions Manager](https://github.optum.com/raw/oaccoe/CCOE-Site/master/static/img/RDS-Sessionsmanager.png)


AWS recommended session manager to connect to our RDS instance. Bellow is an example I tried by creating a tunnel between my on-prem(laptop) and RDS with the EC2 instance (Session Manager) as the middle man. The below article explains the step's in more detail: https://aws.amazon.com/premiumsupport/knowledge-center/systems-manager-ssh-vpc-resources/'

**Benefits of this Approach:**

* Not required to whitelist any port or IP Addresses in the Security group.
* Ability to access the RDS Instance running in the private subnet from the Laptop or On-prem Servers.


Please find the steps  as shown below:

1.  To use an EC2 instance preferably AMAZON linux AMI 2 which has (SSM Agent) installed already or other EC2 instance where SSM Agent is installed.

2.  Install Session Manager Plugin v1.1.23 and AWS CLI v1.16.12 on the local machine or On-prem server.  
* [Install the Session Manager plugin for the AWS CLI](https://docs.aws.amazon.com/systems-manager/latest/userguide/session-manager-working-with-install-plugin.html)
* Make sure AWS CLI version 1.16.12 or later is installed on your local machine in order to use the Session Manager plugin.

3. The AWS CLI should be configured with an IAM profile that has permissions to use SSM Session Manager.
[Verify or create an IAM instance profile with Session Manager permissions](https://docs.aws.amazon.com/systems-manager/latest/userguide/session-manager-getting-started-instance-profile.html)
 
4.  To Enable SSH connections through Session Manager. Create a config file for SSH on the local machine. Update the SSH configuration file to enable running a proxy command that starts a Session Manager session and transfer all data through the connection.
[Enable SSH connections through Session Manager](https://docs.aws.amazon.com/systems-manager/latest/userguide/session-manager-getting-started-enable-ssh-connections.html)

**Linux and macOS**

The SSH configuration file is typically located at ~/.ssh/config
```
# SSH over Session Manager
host i-* mi-*
    ProxyCommand sh -c "aws ssm start-session --target %h --document-name AWS-StartSSHSession --parameters 'portNumber=%p'"

```
**Windows**

The SSH configuration file is typically located at C:\Users\username\.ssh\config.
```
# SSH over Session Manager
host i-* mi-*
    ProxyCommand C:\Windows\System32\WindowsPowerShell\v1.0\powershell.exe "aws ssm start-session --target %h --document-name AWS-StartSSHSession --parameters portNumber=%p"

```
5. Create SSH tunneling using the command below 

```
ssh -i cloudops.pem ec2-user@i-094d662ff6d4abeb7 -L 1433:cloudopsserver.xxxxxxxxxxx.rds.amazonaws.com:1433
```
This command configured the port forward through the SSH tunnel, which will be running inside Session Manager

6.  Now, we can connect to the MSSQL database using SSMS with the host name as “127.0.0.1” and port 1433

Please note that the links provided have detailed breakdown of the steps.

Also ensure that you have completed the prerequisites in the article(https://aws.amazon.com/premiumsupport/knowledge-center/systems-manager-ssh-vpc-resources/).

The above process is applicable for other databases such as Oracle, Mysql, Postgres, etc.,

The below list of documents will also be applicable for the above approach. Tools will need to be installed in the laptop/On-prem Server for this approach.

* [Connecting to a DB instance running the MariaDB database engine](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/USER_ConnectToMariaDBInstance.html)

* [Connecting to a DB instance running the Microsoft SQL Server database engine](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/USER_ConnectToMicrosoftSQLServerInstance.html)

* [Connecting to a DB instance running the MySQL database engine](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/USER_ConnectToInstance.html)

* [Connecting to an Oracle DB instance](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/USER_ConnectToOracleInstance.html)

* [Connecting to a DB instance running the PostgreSQL database engine](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/USER_ConnectToPostgreSQLInstance.html)

References:

[1] https://docs.aws.amazon.com/systems-manager/latest/userguide/session-manager-working-with-install-plugin.html

[2] https://docs.aws.amazon.com/systems-manager/latest/userguide/session-manager-getting-started-instance-profile.html

[3] https://docs.aws.amazon.com/systems-manager/latest/userguide/session-manager-getting-started-enable-ssh-connections.html

[4] https://aws.amazon.com/premiumsupport/knowledge-center/systems-manager-ssh-vpc-resources/


