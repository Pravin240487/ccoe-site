---
id: sftp 
title: AWS SFTP Support Process 
sidebar_label: AWS SFTP Support Process 
---

**Dev SFTP Sitename:** vaultdev.optum.com

**Prod SFTP Details:**

SFTP with Public endpoint : oavault.optum.com

SFTP with VPC endpoint : oavault2.optum.com

VPC Endpoint IP addresses : 44.196.96.20, 44.193.216.210 and 52.204.105.134



### The process to Onboard Product into SFTP:

1. Create a ServiceNow ticket in OA – CloudOps group requesting to add the product into SFTP.
2. Add following details in ServiceNow Ticket
- Product Name
- AWS account where it hosted
- S3 bucket location where we need to copy files to.
3. Once the product is added into SFTP setup we will request product teams to provide write access to SFTP accounts Canonical ID on the s3 bucket.

### The process to create an SFTP account:

1. If it is for a new product make sure we followed the Product onboarding process.
2. Create a ServiceNow ticket in OA – CloudOps group requesting to create an SFTP account
3. Add following details in ServiceNow Ticket
- SFTP username if there is any preference on it else we will create SFTP account using our naming standard
- Name of the product where the file needs to be copied
4. Once The SFTP account is created we will share the credentials in a secured process.


### Access for Support person :

1. Get Read or Contributor access to SFTP AWS accounts AWS_234112151200 - Dev and AWS_609892343811 - Prod
2. Get Access to Datahub Core Jenkins
