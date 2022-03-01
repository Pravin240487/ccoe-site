---
id: EC2-Deployment-Approaches
title: EC2 Deployment Approaches
sidebar_label: EC2 Deployment Approaches
slug: /ec2-deployment-approaches
---
> Author: ArunKumar R

> Last Reviewed Date: 12/23/2021

### AWS EC2 Deployment Approaches

### 1. Overview

#### 1.1. Purpose

AWS EC2 deployment approach is for setting the EC2 instances and managing the packages required for the server. 

#### 1.2. Scope

In this document, we will discuss about different approaches that can be used to build/patch EC2 instances.

1. Install all the packages and bundle it as a Golden AMI
2. Install the necessary packages using User data properties in the EC2 instance
3. Install the necessary packages using CI/CD Jenkins pipeline after the provisioning the EC2 instance through terraform.
4. Using AWS Systems Manager to install and apply packages

It is important to note that all of these are great approaches that fit for your needs. It really comes down to preference of methods, the level of management desired, and use case.

### 2. Configuration steps

#### 2.1. Install all the packages and bundle it as a Golden AMI
Golden AMIs are a great way to package everything up into an image and easily launch an EC2 instance with all 
required configurations and packages. The image is stored in a known location on AWS, so we have nothing to manage other than the image itself. 
* If we plan to launch a lot of EC2 instances that require the same packages, than this would be an ideal approach.
* Also, this approach will help us to reduce the time to install the necessary packages as it will already available in the bundled AMI.
There is a terraform module in the OACCOE github project.

**aws_goldpipeline** - https://github.optum.com/oaccoe/aws_goldpipeline

The purpose of the gold pipeline module is to create hardened AMI's to use to build EC2 instances.

This module supports immutable infrastructure by building fresh AMIs with software and images installed, rather than patching persistent instances. Currently, this module has an Ansible playbook which installs some required security patches, cloudwatch agents, etc., but this can be forked and extended so that additional packages can be installed with the help of Ansible playbook.

Our team is also working on EC2 Image builder https://aws.amazon.com/image-builder/. This can be a very good alternative to aws_goldpipeline and also, it supports most of the required components and security patches. 

**Automate OS Image Build Pipelines with EC2 Image Builder:** https://github.optum.com/oaccoe/aws_imagebuilder

Refer: [AWS AMI management](https://arena.optum.com/docs/AWS%20AMI%20management)


#### 2.2. Install the necessary packages using User data properties in the EC2 instance 

Using the bootstrapping with user data approach is more of a manual process, but will give you more granular control over the instance that is being launched. If a package is not needed on a particular instance, we can simply remove it from the user data during launch, whereas you would need to manually remove the package from the instance after launching from an AMI.  

With user data, we would want to store the user data scripts in a safe location so they can be retrieved and entered quickly during the launch process, which requires a bit more management on our end. This is a great, granular approach to launching your instances with desired configurations if we are not going to be launching a large amount of EC2 instances. 

**When working with instance user data, keep the following in mind:**

* User data must be base64-encoded. The Amazon EC2 console can perform the base64-encoding for you or accept base64-encoded input.

* User data is limited to 16 KB, in raw form, before it is base64-encoded. The size of a string of length n after base64-encoding is ceil(n/3)*4.

* User data must be base64-decoded when you retrieve it. If you retrieve the data using instance metadata or the console, it's decoded for you automatically.

* User data is treated as opaque data: what you give is what you get back. It is up to the instance to be able to interpret it.

* If you stop an instance, modify its user data, and start the instance, the updated user data is not run when you start the instance.

Below is an example of how the userdata shell script will look like.

```
[ec2-user ~]$ curl http://169.254.169.254/latest/user-data
#!/bin/bash
yum update -y
service httpd start
chkconfig httpd on
```
**Work with instance user data:** https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/instancedata-add-user-data.html

#### 2.3. Install the necessary packages using CI/CD Jenkins pipeline after the provisioning the EC2 instance through terraform

The last approach of using CI/CD Jenkins pipelines would take some configuration to achieve as well. We would need to make sure each instance has Jenkins installed, required firewall and we would need to configure them accordingly. The effort for this approach may be high.

**Setting up a CI/CD pipeline by integrating Jenkins with AWS CodeBuild and AWS CodeDeploy:**
https://aws.amazon.com/blogs/devops/setting-up-a-ci-cd-pipeline-by-integrating-jenkins-with-aws-codebuild-and-aws-codedeploy/

**CI/CD Pipeline with Jenkins on AWS:** https://medium.com/faun/ci-cd-pipeline-with-jenkins-and-aws-s3-c08a3656d381

#### 2.4. Using AWS Systems Manager to install and apply packages

We can also use AWS Systems Manager to install and update packages and patches on instances. Systems Manager works very well with Ansible to manage EC2 instances. 

Imagine we have a fleet of Apache/Nginx web servers that must be configured to serve the same web content. They all have a resource tag with a key called “role” and value of “webserver” to identify them. If our goal is to set up a process that verifies if these instances are configured properly all the time and this can be done by running an Ansible SSM document through AWS Systems Manager.

**Install or update packages:** https://docs.aws.amazon.com/systems-manager/latest/userguide/distributor-working-with-packages-deploy.html

**Keeping Ansible effortless with AWS Systems Manager:** https://aws.amazon.com/blogs/mt/keeping-ansible-effortless-with-aws-systems-manager/

### 3. Conclusion

As discussed, this really comes down to use case, business requirements and preference of the product. With that said, it looks like deploying a golden image AMI pipeline with [aws_goldpipeline](https://github.optum.com/oaccoe/aws_goldpipeline) or EC2 Image Builder would be a great overall choice for many use cases. 

[Gold pipeline terraform module](https://github.optum.com/oaccoe/aws_goldpipeline) would be very good and can be extended for supporting more packages that can be installed using Ansible playbooks. Image Builder is what AWS recommended to manage golden images. With both these approaches, the ability to automatically provision images as new software updates and patches become available is included, so the image would always be up to date when used to launch a new instance. 

Another benefit to this is that Image Builder is provided no additional cost, so we are only charged for the underlying AWS resources that are used to create, store, and share the images. 

In an ideal scenario, combining the approaches 1 and 2 would be very good. We can bundle a Golden AMI using [aws_goldpipeline](https://github.optum.com/oaccoe/aws_goldpipeline) terraform module or AWS EC2 Imagebuilder and use EC2 Userdata to configure any changes while the instance is being provisioned. 

Also, I would like to add that we can also use AWS Systems Manager to install and update packages and patches on instances. AWS Systems Manager works very well with Ansible to manage EC2 instances. 


