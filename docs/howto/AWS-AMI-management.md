---
id: AWS-AMI-management
title: AWS AMI management
sidebar_label: AWS AMI management
slug: /AWS AMI management
---
## AWS AMI management and customization

> Author: PravinKumar S

> Last Reviewed Date: 09/10/2021

## Contents

- [Overview](#overview)
- [Hardened base image from EC2 Imagebuiler](#hardened-base-image-from-ec2-imagebuilder)
- [Customizing the base image by AWS Goldpipeline](#customizing-the-base-image-by-aws-goldpipeline)
- [Customize your own source AMI](#customize-your-own-source-ami)
- [Steps to handle the encrypted AMI's by cross accounts](#steps-to-handle-the-encrypted-ami's-by-cross-accounts)
- [Conclusion](#conclusion)


### Overview
The purpose of this documentation is to make understand how the updated EC2 Imagebuilder module and AWS Goldpipeline module help in creating customized images. The process of creating images is decoupled in such a way that, hardened base image which includes the windows update, security patches and few other basic software like python, AWS CLI will be available in the base image created by EC2 Imagebuilder module. Further customization of this base hardened image will be taken care by Goldpipeline module with the help of packers.

### Hardened base image from EC2 Imagebuilder
EC2 Imagebuilder module builds the hardened base image from the Amazon AMI. This final image can be directly used by different accounts in case if there is no specific customizations like installing software is required. Imagebuilder images will be shared to different teams from COE sandbox account based on the request or Imagebuilder pipeline can be setup locally within the individual accounts. 

EC2 Imagebuilder pipeline has recipe created such that Amazon native components like AWSCLI, Python, Security patches/updates will be installed when the EC2 instance is spin up and image of that instance will be built as a final output. Distribution settings within the Imagebuilder pipeline helps in sharing this AMI with other accounts and how to share the encrypted AMI across accounts will be detailed later in this documentation. 

Module reference: https://github.optum.com/oaccoe/aws_imagebuilder

![](https://github.optum.com/raw/oaccoe/CCOE-Site/master/static/img/imagebuilder.png)

### Customizing the base image by AWS Goldpipeline
Goldpipeline module has examples for windows/linux image customization. Module is customized in such way that lambda function code can identify the latest Windows / Linux image built by EC2 Imagebuilder and uses it for further customization.  

Goldpipeline module builds Lambda function, Code build, S3 bucket in which packers will be uploaded and other required IAM roles. Lambda function will be triggered automatically such that environment variables will be passed, to Codebuild service to spin up the EC2 instances (linux/windows) and install software with the help of packers. 

Inside the Goldpipeline module, powershell or ansible scripts within the packer can be customized to have additional softwares installed. Entries need to be updated within (harden-windows.json/harden-linux.json) files when additional software are included.

### Customize your own source AMI

Goldpipeline module has custom-ami example which helps end users to specify their own base image which can be customized further with required software. All the services specified above will be created in this example too however, lambda function will be triggered manually here specifying the custom source ami in the environment variables and also specifying the os type argument (windows/linux) within terraform module.

### Steps to handle the encrypted AMI's by cross accounts

Step by step instructions to access the AMI from cross account, 

"Account A" - primary account where image is built and shared.
"Account B" - secondary account which uses the image.

#### Account A:

1.	Customer KMS key is created and assigned within the Imagebuilder pipeline to encrypt the AMI volumes.
2.  In the KMS policy include the target account role (example role name - aws_ec2_imagebuilder_test) to grant required permission,

``` 
{
    "Version": "2012-10-17",
    "Id": "key-default-1",
    "Statement": [
        {
            "Sid": "Enable IAM User Permissions",
            "Effect": "Allow",
            "Principal": {
                "AWS": "arn:aws:iam::AccountA:root"
            },
            "Action": "kms:*",
            "Resource": "*"
        },
        {
            "Sid": "Allow access for Key Administrators",
            "Effect": "Allow",
            "Principal": {
                "AWS": "arn:aws:iam::AccountA:role/AWS_AccountA_Contributor"
            },
            "Action": [
                "kms:Create*",
                "kms:Describe*",
                "kms:Enable*",
                "kms:List*",
                "kms:Put*",
                "kms:Update*",
                "kms:Revoke*",
                "kms:Disable*",
                "kms:Get*",
                "kms:Delete*",
                "kms:TagResource",
                "kms:UntagResource",
                "kms:ScheduleKeyDeletion",
                "kms:CancelKeyDeletion"
            ],
            "Resource": "*"
        },
        {
            "Sid": "Allow use of the key",
            "Effect": "Allow",
            "Principal": {
                "AWS": [
                    "arn:aws:iam::AccountB:role/aws_ec2_imagebuilder_test",
                    "arn:aws:iam::AccountA:role/AWS_AccountA_Contributor"
                ]
            },
            "Action": [
                "kms:Encrypt",
                "kms:Decrypt",
                "kms:ReEncrypt*",
                "kms:GenerateDataKey*",
                "kms:DescribeKey"
            ],
            "Resource": "*"
        },
        {
            "Sid": "Allow attachment of persistent resources",
            "Effect": "Allow",
            "Principal": {
                "AWS": [
                    "arn:aws:iam::AccountB:role/aws_ec2_imagebuilder_test",
                    "arn:aws:iam::AccountA:role/AWS_AccountA_Contributor"
                ]
            },
            "Action": [
                "kms:CreateGrant",
                "kms:ListGrants",
                "kms:RevokeGrant"
            ],
            "Resource": "*",
            "Condition": {
                "Bool": {
                    "kms:GrantIsForAWSResource": "true"
                }
            }
        }
    ]
}

```
#### Account B

1. Role (example role name - "aws_ec2_imagebuilder_test") which will be accessing the AMI need to be created with inline policy so that it has access to the CROSS ACCOUNT KMS key access,

```
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "kms:CreateGrant",
                "kms:Decrypt",
                "kms:DescribeKey",
                "kms:Encrypt",
                "kms:GenerateData*",
                "kms:ReEncrypt*"
            ],
            "Resource": "arn:aws:kms:us-east-1:AccountA:key/30b86c0c-7262-446c-a532-eee30c15ee15"
        }
    ]
}

```
Above the ARN is the one used inside the Imagebuilder pipeline to encrypt images.

2. Role created above need to be assumed by the user or resource which will be launching the AMI shared from the primary account.

Note: This was tested by assuming this role to EC2 instance, which launched another EC2 instance from the shared AMI through AWSCLI.

### Conclusion
Generic hardening and product-specific customization is handled by single module now. To make the process simple and to decouple the generic hardening the product-specific customizations this approach is been identified. This can be further expanded to architectures where immutable infrastructure is planned.