---
id: Manage-cross-account-KMS-encrypted-s3-buckets
title: Manage cross account KMS encrypted s3 buckets
sidebar_label: Manage cross account KMS encrypted s3 buckets
slug: /Manage-cross-account-KMS-encrypted-s3-buckets
---
## Best practice to manage KMS encrypted S3 BUCKET across multiple accounts

> Author: PravinKumar S

> Last Reviewed Date: 07/13/2021

## Contents

- [Overview](#overview)
- [What is Data Encryption](#what-is-data-encryption)
- [Key Management Services](#key-management-services)
- [Configuration to access cross account KMS encrypted S3 bucket objects](#configuration-to-access-cross-account-kms-encrypted-s3-bucket-objects)
- [KMS conceptual facts](#kms-conceptual-facts)
- [Conclusion](#conclusion)


### Overview

AWS Key Management Service (KMS) makes it easy for you to create and manage cryptographic keys and control their use across a wide range of AWS services and applications. KMS combines secure, highly available hardware and software to provide a key management system scaled for the cloud. Amazon S3 uses AWS KMS customer master keys (CMKs) to encrypt your Amazon S3 objects. In this documentation we will discuss in detail about handling cross account encrypted S3 bucket.

### What is Data Encryption
Data encryption is the mechanism in which information is altered, rendering the plain text data unreadable through the use of mathematical algorithms and encryption keys. Encryption involving keys can be either,

- [Symmetric cryptography](#Symmetric-cryptography)
- [Asymmetric cryptography](#Asymmetric-cryptography)

### Symmetric cryptography
Symmetric cryptography method uses a single key to both encrypt and decrypt the data. It uses a secret key that can either be a number, a word or a string of random letters. Examples of symmetric alogorithms - AES-128, AES-192, and AES-256. The sender and the recipient should know the common secret key in order to encrypt and decrypt the data. Symmetric cryptography is faster compared to Asymmetric cryptography because only single key is used here.

![](https://github.optum.com/raw/oaccoe/CCOE-Site/master/static/img/key.png)

### Asymmetric cryptography
Asymmetric cryptography method uses two keys (public and private keys) where the public key is used for encryption and the private key is used for decryption. Public key of the receiver which is shared publicly is used by the sender to encrypt the data, and this encrypted data can only be decrypted by the intended receiver using his private key.

![](https://github.optum.com/raw/oaccoe/CCOE-Site/master/static/img/key1.png)

Symmetric key cryptography is used primarily in all our accounts, hence Asymmetric cryptography encryption is not discussed in detail in this documentation. 

### Key Management Services

The Key Management Service is a managed service used to store and generate encryption keys that can be used by other AWS services and applications to encrypt data. For example, S3 use the KMS to enable encryption to perform server-side encryption using KMS generated keys known as SSE-KMS. AWS KMS is not a multi-region service, keys generated are only stored and used in the region in which it is created. Therefore, if you are working in a multi-region system with multi-region failover, you need to establish a Key Management Service in each region that you want to encrypt data. 

#### Encryption:
![](https://github.optum.com/raw/oaccoe/CCOE-Site/master/static/img/encrypt.png)

#### Decryption:
![](https://github.optum.com/raw/oaccoe/CCOE-Site/master/static/img/decrypt.png)

### Configuration to access cross account KMS encrypted S3 bucket objects

Step by step instructions to setup cross account access,

Step 1: Create an S3 bucket in Account A with the "Default Encryption" and encryption type as "AWS Key Management Service key (SSE-KMS)". Choose the AWS KMS Keys if created already or create the AWS KMS key and use it for S3 bucket encryption

Step 2: Create an IAM role or user in Account B

Step 3: Provide the IAM role or user in Account B permission to download and upload objects from the S3 bucket in account A with this IAM policy.

``` json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "s3:GetObject",
                "s3:PutObject"
                "s3:ListBucket"
            ],
            "Resource": [
                "arn:aws:s3:::crossaccount-A-bucket-name/*",
                "arn:aws:s3:::crossacct-A-bucket-name"
            ]
        },
        {
            "Sid": "AllowUseOfCMKInAccount",
            "Effect": "Allow",
            "Action": [
                "kms:Encrypt",
                "kms:Decrypt",
                "kms:ReEncrypt*",
                "kms:GenerateDataKey*",
                "kms:DescribeKey"
            ],
            "Resource": "arn-of-the-KMS-key"
        }
    ]
}
```
Step 4: S3 bucket is encrypted with KMS, additional permissions need to be added to allow encryption and decryption of the KMS key.

Step 5: Configure the bucket policy in Account A to grant permissions to the IAM role or user created in Account B. Use this bucket policy to grant a user the permissions to GetObject and PutObject for objects in a bucket owned by Account A.

``` json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "crossAccountAccess",
            "Effect": "Allow",
            "Principal": {
                "AWS": [
                    "arn-of-the-cross-account-IAM-ROLE",
                    "arn-of-the-existing-account-role"
                ]
            },
            "Action": "s3:*",
            "Resource": [
                "arn:aws:s3:::crossacct-bucketname",
                "arn:aws:s3:::crossacct-bucketname/*"
            ]
        }
    ]
}
```

Step 6: Configure the KMS policy in the account A to allow the account B's IAM role to handle the key.

``` json

{
    "Version": "2012-10-17",
    "Id": "key-consolepolicy-3",
    "Statement": [
            {
            "Sid": "Allow use of the key",
            "Effect": "Allow",
            "Principal": {
                "AWS": [
                    "arn-of-the-exisiting-acct-role",
                    "arn-of-the-role-from-where-bucket-is-accesses"
                ]
            },
            "Action": "kms:*",
            "Resource": "*"
        }
    ]
}

```


### KMS conceptual facts

1. KMS encryption will not be applied on the objects uploaded prior to enabling the KMS encryption. 
2. In case of objects which are uploaded before enabling encryption, KMS encryption can be performed manually. (https://aws.amazon.com/blogs/storage/encrypting-existing-amazon-s3-objects-with-the-aws-cli/) 
3. Encryption happens on the data inside the objects and hence listing of the objects is possible even if the S3 BUCKET is encrypted.

### Conclusion:

S3 buckets and other services currently use the Amazon S3 Key default encryption, however when AWS-KMS encryption is used apart from resource, encryption key maintenance also need to taken care. Permissions to the respective IAM roles and users need to be handled for accessing the resources.