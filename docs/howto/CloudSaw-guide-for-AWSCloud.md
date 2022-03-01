---
id: cloudsaw-guide-for-AWSCloud
title: CloudSaw Guide to access AWS Instances
sidebar_label: CloudSaw Guide to access AWS Instances
slug: /cloud-saw-guide-aws-cloud
---
## Cloud Saw guide for AWS Cloud

> Author: ArunKumar R

> Last Reviewed Date: 07/15/2021

## Contents

- [Overview](#overview)
- [Purpose](#purpose)
- [Prerequisites](#prerequisites)
- [Architecture Diagram](#architecture-diagram)
- [Step by Step instructions with screenshots](#step-by-step-instructions-with-screenshots)
- [Conclusion](#conclusion)

## Overview

Secure Administrative Workbench (SAW) profiles enable information technology team members to engage in production activities using a highly secure and individualized virtual desktop. Each profile is customized to meet the requirements of the work the administrator will ​be completing.  Profiles are also configured with security settings, multi-factor authentication and restrictions on administrator permissions.

## Purpose

The [Cloud SAW machine](https://vanguard.optum.com/docs/patterns/operations/cloud-saw/), as opposed to the standard SAW machine, is able to initial connections with the public cloud servers over a variety of ports and protocols.

This guide gives info about connecting to AWS Cloud Instances using Cloud Saw.

[Cloud SAW Reference](https://helpdesk.uhg.com/At_Your_Service/SW/Pages/Secure-Administrative-Workbench-(SAW).aspx)

## Prerequisites

### Cloud SAW Access & Provisioning
**REQUIRED ROLES**
  - While following instructions on Page 4 of the document, be sure to select **BOTH** Roles 
    - **Cloud Saw Role** 
    - **SAW Standard Platform**
  - We should also require "VMware Horizon View Client" in our laptop to access the Cloud Saw Windows Machine. This can be requested through https://optum.service-now.com/euts_intake?id=appstore_home.
Follow this onboarding guide for [Requesting Secure Administrative Workbench](https://helpdesk.uhg.com/At_Your_Service/SW/Documents/SAW/Requesting%20Secure%20Administrative%20Workbench.pdf)

## Architecture Diagram

![](https://github.optum.com/raw/oaccoe/CCOE-Site/master/static/img/CloudSaw_architecture.png)

## Step by Step instructions with screenshots
### Installing applications on your Cloud SAW Machine

Applications are installed through the [UHG Appstore](https://optum.service-now.com/euts_intake?id=appstore). Be sure to enabled the "SAW" filter while searching for compatible technology!
:::info
All applications installed using the "SAW" option will also be installed to your Cloud Saw Machine.
:::
 ![SAW Appstore Filter](https://github.optum.com/raw/oaccoe/CCOE-Site/master/static/img/saw-app-filter.png)  ![SAW Install Filter](https://github.optum.com/raw/oaccoe/CCOE-Site/master/static/img/saw-app-install-filter.png)

Once you find the application you would like installed click “Select Devices” and select “SAW” (make sure nothing else is selected).

#### Common Cloud SAW Compatible Applications 

| SAW Compatible App | Usage | 
| ---- | ---- |
|[Putty](https://optum.service-now.com/euts_intake?id=euts_appstore_app_details&appKeyId=22198)| SSH to AWS EC2 Linux Instances|
| Remote Desktop Connection| RDP to AWS EC2 Windows Instances|
| [Microsoft Data Studio](https://optum.service-now.com/euts_intake?id=appstore&q=Microsoft%20Azure%20Data%20Studio) | Connect to MicrosoftSQL Database |
| [MySQL Workbench](https://optum.service-now.com/euts_intake?id=appstore&q=MySQL%20Workbench) | Connect to MySQL Database | 
| [pgAdmin](https://optum.service-now.com/euts_intake?id=appstore&q=pgAdmin) | Connect to PostgreSQL Database |

### Configuring AWS Security groups for allowing CloudSaw Machine to access the Instances

For the CloudSaw machine to access the AWS Instances(EC2 or RDS), the instance should be running in the public subnet and the security group attached to the resources should able to allow the CloudSaw Public IPs.

Make sure to only open it to the Optum Cloud SAW IPs and not to the Internet

The list of Cloudsaw public Ips which should be white-listed are "198.203.175.183/32", "198.203.177.183/32", "198.203.181.183/32" and it should be proveded with the necessary ports such as 22, 3389, 3306, etc.,

The below repo will have the updated CloudSaw Ips and this can also be integrated with our terraform script to fetch the CloudSaw IPs.
https://github.optum.com/Dojo360/optum-ips#optum-ips

### Accessing CloudSaw Machine
To ensure Cloud resources are accessed securely, all users who need to perform infrastructure work in the Cloud must utilize the Cloud SAW Profile. Users with the ability to administer, provision, or manage Cloud resources must perform this privileged work through SAW. Users will access SAW with their primary ID, and connect to their resources in the Cloud. 

The guide to Access Secure Administrative Workbench has all the necessary step available.

https://helpdesk.uhg.com/At_Your_Service/SW/Documents/SAW/Accessing%20Secure%20Administrative%20Workbench.pdf

The only extra step that we need to do is choosing Cloud profile as shown below.

![](https://github.optum.com/raw/oaccoe/CCOE-Site/master/static/img/CloudSaw_Profile.png)


### Price of Cloud SAW

The cost of the Cloud Secure Administrative Workbench is $0.017 per Compute Unit

The breakdown of the Compute Unit Cost:

![Compute Unit Cost](https://github.optum.com/raw/oaccoe/CCOE-Site/master/static/img/cloudsaw_compute_unit_cost.png)


### Conclusion
Cloud Saw is a Vanguard/EIS recommended approach of connecting to the AWS EC2 or RDS Instances. But, there is a limitation that it can be connected only to the Public Instances(Instances running in the public subnet). In an ideal scenario, the database instances will be running in the private subnets. So, we may need to have another jumpbox running in the public subnet of AWS to connect to the RDS Databases Instances.

The other alternative approaches are as below:

[AWS EC2 Shell Access with AWS Systems Manager(SSM) Session Manager](https://cloud.optum.com/docs/technical-guides/ssm-session-manager/)

[EC2 Sessions Manager to Connect to Windows EC2 Instance](https://arena.optum.com/docs/howto/AWS-Sessions-Manager-Windows-EC2-Instance)

[Connecting to AWS RDS Database Instances](https://arena.optum.com/docs/AWS-Best-Practices/Best-Practice-To-Connect-To-AWS-RDS-Database-Instances)
