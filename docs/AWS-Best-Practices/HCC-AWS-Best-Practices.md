---
id: HCC-AWS-Best-Practices
title: HCC AWS Best Practices
sidebar_label: HCC AWS Best Practices
---
# Guidance on HCC AWS Best Practices

**AWS Launchpad Policies**: https://cloud.optum.com/docs/launchpad/aws-policies/

**Terraform Compliance Linter**: Identify non-compliant or non-secure infrastructure written in Terraform v12.x before it gets deployed to AWS. Access the repo at https://github.optum.com/oaccoe/terraform-compliance-linter

**Cloudcustodian**: Cloudcustodian Policies for Cost Optimization, Security Compliance and Garbage Cleanup. Access the repo at https://github.optum.com/oaccoe/cloudcustodian  

## AWS S3 Storage

The following are the list of Launchpad policies related to AWS S3 bucket.

1. AWS S3 Bucket has Global Permissions enabled via bucket policy
2. AWS S3 bucket has global view ACL permissions enabled
3. AWS S3 bucket not configured with secure data transport policy UHG
4. AWS S3 buckets are accessible to public
5. AWS S3 buckets do not have server side encryption - UHG
6. UHG AWS S3 Bucket has Global PUT Permissions enabled via bucket policy

**Causes**: Whenever an S3 bucket is launched through AWS console, some of the above violations will occur as we cannot update the s3 bucket policies while creating the S3 bucket. So, we will be getting the launchpad violations.

**Solution/Best Practices**: As per HCC Optum standards, Terraform should be used to provision the AWS resources. CloudOps team has built aws_s3 terraform module(forked from CommercialCloud-EAC) which complies with the HCC Launchpad policies. We are frequently updating this module to make sure it is compliant. The following is the repo which has different use-cases/examples to create S3 buckets. There is also an option to create issues or to contribute to this module by creating a Pull Requests.

We have also created an example terraform module to setup TFState Backend.

We can also use Terraform Compliance Linter for identifying the violations before it is launched in the Jenkins pipeline.

**Repo URL**: 
1. AWS S3 Terraform module: https://github.optum.com/oaccoe/aws_s3 
2. Terraform AWS TFState Backend: https://github.optum.com/oaccoe/terraform-aws-tfstate-backend


## AWS RDS

The following are the list of Launchpad policies related to AWS RDS.

1. AWS RDS DB cluster encryption is disabled-UHG

**Causes**: Whenever an RDS Instance is created without enabling the storageEncrypted option. 

**Solution/Best Practices**: CloudOps team has created an example for different database types by sourcing the Hashicorp's Terraform community modules. The example would be useful to identify how to create an RDS Instance and to enable storage encryption.

**Repo URL**: https://github.optum.com/oaccoe/aws_rds_example

## AWS EC2/EBS

The following are the list of Launchpad policies related to AWS EC2 or EBS Volume.

1. AWS EBS volumes are not encrypted
2. EC2 Instances with unencrypted EBS Volume

**Causes**: Whenever an EBS Volume is created without encryption enabled, it will be considered as the Launchpad Violation. Also, when an EC2 instance is having EBS volumes which are not encrypted, it will be considered as a Launchpad violations.

**Solution/Best Practices**: CloudOps team has created an example for creating an EC2 Instance by sourcing the Hashicorp's Terraform community modules. The example would be useful to identify how to create an EC2 Instance with an encrypted EBS Volume. Also, we have tool called "aws_goldpipeline" to create encrypted AMIs.

**Repo URL**: 
1. AWS EC2 Example: https://github.optum.com/oaccoe/aws_ec2_example
2. AWS “gold pipeline” for creating compliant AMIs: https://github.optum.com/oaccoe/aws_goldpipeline – Cloud Ops tool

## AWS Security Group
The following are the list of Launchpad policies related to AWS Security group
1. AWS Security Groups allow internet traffic to SSH port (22)
2. and Other Network related launchpad policies https://cloud.optum.com/docs/launchpad/aws-policies/

**Causes**: Whenever an Security group is created with a rule which is globally opened(0.0.0.0/0), it will be considered as the Launchpad Violation.

**Solution/Best Practices**:

1. **Approved alternative to SSH**

   AWS Systems Manager – Session Manger

   HCC Doc - https://cloud.optum.com/docs/technical-guides/ssm-session-manager

   Docs - https://docs.aws.amazon.com/systems-manager/latest/userguide/session-manager.html 
 
2. **EC2 Sessions Manager to Connect to Windows EC2 Instance**
https://arena.optum.com/docs/howto/AWS-Sessions-Manager-Windows-EC2-Instance

## Terraform Module Releases:
   It is always required to use specific release of any terraform modules rather than using master branch. This       will make sure that new changes to the repository does not break your deployment.
   For example: git::https://github.optum.com/oaccoe/cloudcustodian.git?ref=v2.3.2


