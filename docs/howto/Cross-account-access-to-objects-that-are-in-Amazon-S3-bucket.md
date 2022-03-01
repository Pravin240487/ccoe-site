---
id: Cross-account-access-to-objects-that-are-in-Amazon-S3-bucket
title: Cross Account Access to Objects that are in Amazon S3 bucket
idebar_label: Cross Account Access to Objects that are in Amazon S3 bucket
---
## Cross Account Access to Objects that are in Amazon S3 bucket

> Point of Contact: Arunkumar R

> Last Reviewed Date: 11/02/2021

### Overview

This guide is to grant another AWS account access to an object or objects that are stored in an Amazon Simple Storage Service (Amazon S3) bucket.
Using Resource-based policies and IAM policies to manage cross-account control and audit the S3 object's permissions. If you apply a bucket policy at the bucket level, you can define who can access (Principal element), which objects they can access (Resource element), and how they can access (Action element). Applying a bucket policy at the bucket level allows you to define granular access to different objects inside the bucket. You can also review the bucket policy to see who can access objects in an S3 bucket. To use bucket policies to manage S3 bucket access, follow these steps:

###	Step by Step instructions

#### Option1: Resource-based policies and IAM policies

**Step1:**  Create an S3 bucket in Account A(Skip, if you already have one). 

**Step2:** Create an IAM role or user in Account B.

**Step3:** Give the IAM role or user in Account B permission to download (GET Object) and upload (PUT Object) objects to and from a specific S3 bucket with this IAM policy. This policy also gives the IAM role or user in Account B permissions to call PUT Object acl to grant object permissions to the bucket owner:
```
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "s3:GetObject",
                "s3:GetObjectVersion",
                "s3:PutObject",
                "s3:PutObjectAcl"
            ],
            "Resource": [
                "arn:aws:s3:::AccountABucketName/*",
                "arn:aws:s3:::AccountABucketName
            ]


}
    ]
}
```
**Note:** You can limit access to a specific bucket folder in Account A by defining the folder name in the resource element, such as "arn:aws:s3:::AccountABucketName/FolderName/*". For more information, see How can I use IAM policies to grant user-specific access to specific folders?

**Step4:**

Configure the bucket policy for Account A to grant permissions to the IAM role or user that you created in Account B. Use this bucket policy to grant a user the permissions to GetObject and PutObject for objects in a bucket owned by Account A:
```
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Principal": {
                "AWS": "arn:aws:iam::AccountB:user/AccountBUserName"
            },
            "Action": [
                "s3:GetObject",
                "s3:GetObjectVersion",
                "s3:PutObject",
                "s3:PutObjectAcl"
            ],
            "Resource": [
                "arn:aws:s3:::AccountABucketName/*"
            ]
        }
    ]
}
```
 

Note: You can define a specific S3 bucket folder in the resource element to provide granular access for more limited access, such as "Resource": "arn:aws:s3:::AccountABucketName/FolderName/*". By using the s3:PutObject permission with a condition, the bucket owner gets full control over the objects uploaded by other accounts. Enforcing the ACL with specific headers are then passed in the PutObject API call. For more information, see Granting s3:PutObject permission with a condition requiring the bucket owner to get full control.

#### Option2: Cross-account IAM roles

Not all AWS services support resource-based policies. This means that you can use cross-account IAM roles to centralize permission management when providing cross-account access to multiple services. Using cross-account IAM roles simplifies provisioning cross-account access to S3 objects that are stored in multiple S3 buckets, removing the need to manage multiple policies for S3 buckets. This method allows cross-account access to objects owned or uploaded by another AWS account or AWS services. If you don't use cross-account IAM roles, the object ACL must be modified. For more information, see How Amazon S3 authorizes a request for an object operation.

To use cross-account IAM roles to manage S3 bucket access, follow these steps:

**Step1:**  Create an IAM role in Account A. Then, grant the role permissions to perform required S3 operations. In the role's trust policy, grant a role or user from Account B permissions to assume the role in Account A:
````
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "AWS": "arn:aws:iam::AccountB:user/AccountBUserName"
      },
      "Action": "sts:AssumeRole"
    }
  ]
}
````
You can also create a role with the trust policy using the AWS CLI command example create-role.

The following access policy allows a user who has assumed this role to download and upload objects programmatically and using the Amazon S3 console. For more information, see How can I use IAM policies to grant user-specific access to specific folders?

Note: If only programmatic access is required, the first two statements in the following policy can be removed:
````
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Action": [
                "s3:ListAllMyBuckets"
            ],
            "Effect": "Allow",
            "Resource": [
                "arn:aws:s3:::*"
            ]
        },
        {
            "Action": [
                "s3:ListBucket",
                "s3:GetBucketLocation"
            ],
            "Effect": "Allow",
            "Resource": [
                "arn:aws:s3:::AccountABucketName/*",
                "arn:aws:s3:::AccountABucketName
            ]
        },
        {
            "Effect": "Allow",
            "Action": [
                "s3:GetObject",
                "s3:PutObject"
            ],
            "Resource": [
                "arn:aws:s3:::AccountABucketName/*",
                "arn:aws:s3:::AccountABucketName
            ]
        }
    ]
}
````
You can also create an IAM identity-based policy using the AWS CLI command example create-policy.

**Step2:**    Grant an IAM role or user in Account B permissions to assume the IAM role that you created in Account A.

````
{
  "Version": "2012-10-17",
  "Statement": {
    "Effect": "Allow",
    "Action": "sts:AssumeRole",
    "Resource": "arn:aws:iam::AccountA:role/AccountARole"
  }
}
````
You can also create an IAM identity-based policy using the AWS CLI command example create-policy.

**Step3:**     From a role or user in Account B, assume the role in Account A so that IAM entities in Account B can perform the required S3 operations. For more information, see Switching to a role (Console).


**Reference:** https://aws.amazon.com/premiumsupport/knowledge-center/cross-account-access-s3/
