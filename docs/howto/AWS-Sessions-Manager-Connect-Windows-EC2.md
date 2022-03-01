---
id: AWS-Sessions-Manager-Windows-EC2-Instance
title: AWS Sessions Manager to Connect to Windows EC2 Instance
sidebar_label: AWS Sessions Manager Connecting to Windows EC2 Instance
---
## AWS Sessions Manager to Connect to Windows EC2 Instance

> Point of Contact: Arunkumar R

> Last Reviewed Date: 07/15/2021

## Contents

- [Overview](#overview)
- [Purpose](#purpose)
- [Step by Step instructions with screenshots](#step-by-step-instructions-with-screenshots)
- [Conclusion](#conclusion)

## Overview

This guide will help us to connect to the AWS EC2 Windows instance via RDP port using AWS Session Manager from our Laptop. 

## Purpose

To connect to AWS EC2 windows instance from Optum network without opening 3389 port in AWS Security group you need AWS SSM-tools at your system.

## Step by Step instructions with screenshots
* Step 1: Before this the instance should have SSM-agent installed check this link for this:
 
https://docs.aws.amazon.com/systems-manager/latest/userguide/session-manager-prerequisites.html
 
* Step 2: Once the above step is completed you have to enable RDP through session manager, Pl. this the below link:
 
https://reinvent2019.aws-management.tools/mgt406/en/optional/step7.html
 
* Step 3: Session manager plugin can be installed from below URL for windows:
https://s3.amazonaws.com/session-manager-downloads/plugin/latest/windows/SessionManagerPluginSetup.exe
 
Please note that OPTUM policies deny installing this pluging on our Laptops ( you need to check the same on your laptops), so we may need to require admin access to our laptop to install AWS Session manager plugin.
 
* Step 4: Once all the above are installed:
 
Now to connect to RDP of any windows EC2 instance in AWS you need to follow following simple steps:

1. Authenticate in the MSDomain machine using your MSID and password with the python authentication scripts.

2. Run following command in CMD prompt :

* `aws ssm start-session --target <EC2 instance id > --document-name AWS-StartPortForwardingSession --parameters "localPortNumber=55678,portNumber=3389" --profile=saml`

e.g. to connect to a windows EC2 instance having instance id i-0b9c03bb322a21b1   run the following command

* `aws ssm start-session --target i-0b9c03bb322a21b1 --document-name AWS-StartPortForwardingSession --parameters "localPortNumber=55678,portNumber=3389" --profile=saml`

you will get following messages:
> Starting session with SessionId: <your Optum email id –XXXXXX>
> Port 55678 opened for sessionId <your Optum email id –XXXXXX>

 
Once you saw the first message then connect to RDP on localhost:55678 port

## Conclusion

This approach help us to RDP to the EC2 Windows instances from our local laptop. As of now, AWS Session manager tool is not available in the Appstore and so, it requires admin access to install it in the laptop. 