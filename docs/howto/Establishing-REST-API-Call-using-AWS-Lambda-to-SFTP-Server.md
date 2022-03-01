---
id: Establishing-REST-API-Call-using-AWS-Lambda-to-SFTP-Server
title: Establishing REST API Call using AWS Lambda to SFTP Server
sidebar_label: Establishing REST API Call using AWS Lambda to SFTP Server
---
## Establishing REST API Call using AWS Lambda to SFTP Server

> Point of Contact: Arunkumar R

> Last Reviewed Date: 11/02/2021

### 1. Overview

This wiki is about a requirement for communicating with SFTP server through an HTTP connection via a REST API Call. It is viable in an API Gateway+Lambda integration, where API Gateway delegates the HTTP request and send to Lambda, and Lambda will be the one actually connecting to an SFTP server to carry out file retrieving work. We may need to place our Lambda function in a VPC if the SFTP server is in the VPC.

One thing to notice is that Lambda has a payload limit of 6MB so the file can't be larger than that. If the file will be larger than that, we need to find other workaround such as uploading the file to S3 and return a presigned S3 URL. 

In Python, we can use [Paramiko](http://docs.paramiko.org/en/stable/index.html) as the SSH/SFTP client. We may also find similar libraries in other programming languages. In order to add Paramiko to your Lambda function, there are many ways, such as integrating directly to your [Lambda function as a deployment package](https://docs.aws.amazon.com/lambda/latest/dg/python-package.html), or a Lambda layer. The latter option allows us to share the common libraries (such as Paramiko) among many Lambda functions, if we need to do so. The concept is pretty similar among those two, but the path of the layer is slightly different(https://docs.aws.amazon.com/lambda/latest/dg/configuration-layers.html#configuration-layers-path).

When creating a Lambda layer for Python, we need to create a ZIP file. Inside the said ZIP file, there will be a folder called “python”. Then, in that folder, we will need to put all python libraries required there. We will need to do this in an EC2 instance based on Amazon Linux 2, with the desired Lambda version installed (such as Python 3.8).

### 2. Configuration steps

* First, we create a folder called “paramiko” and enter it, create another folder called “python”:
```
    $ mkdir paramiko
    $ cd paramiko
    $ mkdir python
```

* Then, we enter the “python” folder, install Paramiko here:
```
    $ cd python
    $ pip3 install -t ./ paramiko
```

* Then, you should be able to see a number of files and folders are created. Those are related to the Paramiko library and its dependencies. Next, we return back to the previous “paramiko” folder, and zip the entire folder:
```
    $ cd ..
    $ zip -r9 paramiko.zip ./
```

* Then, we can upload this ZIP file to Lambda layer, then include it in your Lambda function. You should have a file structure in this ZIP file similar to this:
```
    ./
    ./python
    ./python/__pycache__
    ./python/paramiko
    ./python/...
```

We can test this around first, then use the deployment tool of our choice (such as Terraform) for deployment in the production environment. Alternatively, we can develop this in SAM by following this article(https://aws.amazon.com/blogs/compute/working-with-aws-lambda-and-lambda-layers-in-aws-sam/).

We may also make use of CodeBuild/Jenkins to automate the process of creating a Lambda layer and integrate it in our deployment process.

**Reference Links:**
* http://docs.paramiko.org/en/stable/index.html
* https://docs.aws.amazon.com/lambda/latest/dg/python-package.html
* https://docs.aws.amazon.com/lambda/latest/dg/configuration-layers.html#configuration-layers-path
* https://aws.amazon.com/blogs/compute/working-with-aws-lambda-and-lambda-layers-in-aws-sam/
