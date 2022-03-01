---
id: Restrict-S3-bucket-access-to-IAM-Roles-with-tags
title: Restrict specific S3 bucket access to IAM Roles with tags
idebar_label: Restrict specific S3 bucket access to IAM Roles with tags
---
## Restrict specific S3 bucket access to IAM Roles with tags

> Point of Contact: Navaneethan G

> Last Reviewed Date: 07/01/2021

### Overview

This guide is to restrict specific S3 bucket access to IAM Roles which has certain tags.
If you apply a bucket policy at the bucket level, you can define who can access (Principal element), which objects they can access (Resource element), and how they can access (Action element) and when they can access (Condition element). Applying a bucket policy at the bucket level allows you to define granular access to different objects inside the bucket. You can also review the bucket policy to see who can access objects in an S3 bucket. To use bucket policies to manage S3 bucket access for IAM roles with specific tags, follow these steps:

###	Step by Step instructions

#### Condition-based bucket policies

**Step1:** Create an IAM role with specific tags.

**Step2:**

Configure the bucket policy for the buckets for which acccess has to be restricted to the IAM role based on the IAM role tags. 
```
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "DenyAccess",
            "Effect": "Deny",
            "Principal": "*",
            "Action": "s3:*",
            "Resource": [
                "arn:aws:s3:::BucketName",
                "arn:aws:s3:::BucketName/*"
            ],
            "Condition": {
                "StringEquals": {
                    "aws:PrincipalTag/IAMRoleTagName": "IAMRoleTagValue"
                }
            }
        }
    ]
}
```

Note: You can define a specific S3 bucket folder in the resource element to provide granular access for more limited access, such as "Resource": "arn:aws:s3:::BucketName/FolderName/*". 

#### Use-case

An IAM Role like NonUS_Role in the account for which access needs to be denied for certain S3 buckets which has PHI data. 

**Step1:** Create NonUS_Role in the account with tag like phi:"true"

**Step2:** Add the below Bucket policy in the buckets that have PHI data and for which the access has to be restricted for the NonUS_Role.

```
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "DenyAccess",
            "Effect": "Deny",
            "Principal": "*",
            "Action": "s3:*",
            "Resource": [
                "arn:aws:s3:::BucketName",
                "arn:aws:s3:::BucketName/*"
            ],
            "Condition": {
                "StringEquals": {
                    "aws:PrincipalTag/phi": "true"
                }
            }
        }
    ]
}
```
