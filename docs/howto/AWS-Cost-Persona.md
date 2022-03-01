---
id: AWS-Cost-Personas
title: AWS Cost Personas
sidebar_label: AWS Cost Personas
slug: /aws-cost-personas
---
> Author: ArunKumar R

> Last Reviewed Date: 01/24/2021

### AWS Cost Persona

## Contents

- [Overview](#overview)
- [Purpose](#purpose)
- [Considerations / Assumptions](#considerationsassumptions)
- [Different Cost Personas](#different-cost-personas)
- [Conclusion](#conclusion)

## Overview

### Purpose

AWS Cost persona for the new teams who will be onboarding to AWS to understand the general pricing or budget for the existing Optum products who already has some footprint in the AWS Cloud. 

### Considerations/Assumptions:
**1. AWS Compute Savings Plan:** HCC uses Compute Savings Plan at the org level and so by default all the AWS accounts will be having these discounts. Compute Savings Plans provide the most flexibility and help to reduce your costs by up to 66%. These plans automatically apply to EC2 instance usage regardless of instance family, size, AZ, Region, OS or tenancy, and also apply to Fargate or Lambda usage. For example, with Compute Savings Plans, you can change from C4 to M5 instances, shift a workload from EU (Ireland) to EU (London), or move a workload from EC2 to Fargate or Lambda at any time and automatically continue to pay the Savings Plans price.

Refer for more details: https://aws.amazon.com/savingsplans/compute-pricing/

**2. Pricing may vary for different workloads:** The person that will be shown in this guide may not be suitable or will be same for the other team.  It really depends on the type of Instances used(memory or processor), how much the data is stored/processed and the data transfer cost. All the cost mentioned here the average monthly cost by considering the last 3 months usage.

**3. HCC Chargeback Pricing:**

As all the AWS accounts will be managed by the HCC team, the billing amount shown in the AWS Billing Console will be multiplied by chargeback modifier. So, this will be the final amount that any product team will be spending for hosting their product in the AWS Platform.   

**Simplified Public Cloud Chargeback Estimate**

Complexities between cloud vendors, cloud capabilities, and the rate card process make estimating Public Cloud chargebacks convoluted.  The simple two steps below combine our discounts, efficiencies, and rate card for estimating most Public Cloud workloads.

1. Use the Public Cloud vendor  cost estimation tool ([AWS Billing Calculator](https://calculator.aws/#/)) assuming on demand costs for all services and excluding discounts, reserved instances, reservations, or any other "special savings".
2. Multiply this estimate by the effective chargeback modifier below.  These rates are determined by combining the Optum Tech rate card with the different discounts and incentives Optum Tech is able to secure within each cloud service provider.

Note: Check the HCC official site for updated chargeback price for AWS.  https://cloud.optum.com/docs/operational-guides/chargeback/

## Different Cost Personas

#### 1. DVP - Spark - EMR Workloads on EC2 Instances
Build a scalable framework to validate all stages of the pipeline for all products that is technology agnostic. Promote efficiency by executing validations as early (far left) as possible and provide actionable insights for end-users.

This Solution mainly uses Transient or On-demand EMR Cluster to process different workloads using Apache Spark. In addition to that, they use some RDS Database and Lambda functions for the workflow.

| Resource | Cost(USD$) |
| --- | --- |
|EC2 Instances|$11,300((Compute Savings Discount Not Included))|
|EMR|$2500|
|EC2-Other|$600|
|S3|$500|
|RDS|$100|
|Other|$500|
|**Total(Per month)** | $15,500|



#### 2. Rclone/azcopy Solution - AWS to Azure or Azure to AWS

This Solution builds a setup to transfer the data between AWS and Azure.

Assumption: 30TB/Month(1TB/Day and 1 GB per file)
| Resource Name | Pricing Details | Cost(USD$) | 
| ------------ | --------------- | -------------- 
| AWS Nat Gateway Cost | 1000GB x $0.045 x 30 days | $1350 | 
| AWS Data Transfer Cost | $0 (1TB) + $810 (1-10 TB) + $1700 (10-30 TB) | $2510 | 
| AWS S3 Standard Cost | 30 TB * $0.023 per GB | $690 | 
| AWS Fargate Cost | CPU $203 + Memory $90 + Compute $291 | $584 | 
| AWS Step Functions Cost | 1,00,000 state transitions per month: 1,00,000 * $0.000025 | $2.4 | 
| Azure Transfer Cost | $0 (0-5 GB) + $875 (5 GB - 10 TB) + 1660 (10 TB - 30 TB)  | $2535 | 
|**Total(Per month)**||$7700|
** Cost is only for outpound Data Transfer.
** Lambda and SNS will be covered under free tier cost. (1 million requests per month each)

#### 3. OPA - Redshift Data Warehouse
OPA (Optum Performance Analytics) is a reporting application that provides insights into claims and clinical data from provider and payer clients. 

Some of the components are,
* MicroStrategy (MSTR) Web for end user access to reporting
* MSTR Intelligence Server (I-Server), backend for report execution
* Redshift for data warehouse
* Custom plugins for MSTR web to support Optum branding, integration with Okta, and patient registries
* Custom Spring Boot application to support the patient registries capability

For more details, Wiki: https://confluence.optum.com/display/OPAENG/OPA+architecture+on+AWS

| Resource | Cost(USD$) |
| --- | :---: |
| Redshift | $18,000|
|EC2 Instances|$0( Compute Savings Discount - $22,000)|
|RDS|$5000|
|S3|$3500|
|Cloudwatch|$2000|
|EC2-Other|$1600|
|EFS|$700|
|Appstream|$350|
|Other Services|$500|
|**Total(Per month)** | $31,000|


#### 4. OADW - Spark - EMR Workloads on EC2 Instances

OADW is the data warehouse underneath all next generation OA product offerings: Optum Performance Analytics, OCCP, OPADM, and beyond. It incorporates the base / detail layer normalization of the stage data along with various analytic layers, including data from II and IPro, SRE, and EBM, to create a platform-like data store.

| Resource | Cost(USD$) |
| :---: | :---: |
|EC2 Instances|$20,000(Compute Savings Discount Not Included)|
|EMR|$4500|
|EC2-Other|$800|
|Glue|$350|
|Other Services|$100|
|**Total(Per month)** | $26,000|


#### 5. DH.Datalake - Mainly datalake

This is more of a datalake where the storage is in Amazon S3 buckets.

| Resource | Cost(USD$) |
| :---: | :---: |
|S3|$15000|
|**Total(Per month)** | $15,000|


#### 6. eCDR - EMR Workloads on EC2 Instances
In this solution, mostly the works loads are based on EMR Clusters.

| Resource | Cost(USD$) |
| :---: | :---: |
|EC2 Instances|$25,000(Compute Savings Discount Not Included)|
|EMR|$5000|
|EC2-Other|$1000|
|**Total(Per month)** | $31,000|


#### 7. CCC - Mostly EC2 on MSTR and RDS
Crimson Continuum of Care Engineering - The workloads are mostly in the AWS RDS and EC2.

| Resource | Cost(USD$) |
| :---: | :---: |
|RDS Instances |$70000|
|EC2 Instances|$48,000(Compute Savings Discount Included)|
|EC2-Other|$7000|
|S3|$4000|
|Other Services|$1000|
|**Total(Per month)** | $1,30,000|

#### 8. Onelogin - Web application with EC2 and RDS

The charter for OneLogin is to provide a single Authentication service for advisory products combined with basic user management, maintenance and basic authorization.  The intent is to support the unification of user accounts across products implementing SIAM authentication as well as those Advisory.com and Salesoforce.com for authentication services.  OneLogin will provide a single platform and user experience for authentication across the membership while providing both Single Sign-on (SSO) and Federated Single Sign-On (FSSO) for our products.

| Resource | Cost(USD$) |
| :---: | :---: |
|RDS Instances |$800|
|EC2 Instances|$)(Compute Savings Discount Included)|
|Redshift|$400|
|Other Services|$700|
|**Total(Per month)** | $1900|

#### 9. SPC - Web Applications running on EC2 and ECS Fargate

Surgical Profitability Compass (SPC) is a set of solution provided for surgical department to Control rising costs, Improving surgical brand, Optimizing capacity, Access and fighting erosion of reimbursements

| Resource | Cost(USD$) |
| :---: | :---: |
|RDS Instances |$6500|
|EC2 Instances|$1300(Compute Savings Discount Included)|
|EC2-Other|$5500|
|ECS Fargate|$700|
|Other Services|$1000|
|**Total(Per month)** | $15,000|

#### 10. OPADM -  EMR Workloads on EC2 Instances

OPADM is for big-data extraction and perform other operation such as row count validation, ddl generation and etc. 

| Resource | Cost(USD$) |
| :---: | :---: |
|EC2 Instances|$0(Compute Savings Discount Included)|
|S3|$1300|
|EMR|$100|
|Other Services|$300|
|**Total(Per month)** | $1700|


#### 11. Datahub

| Resource | Cost(USD$) |
| :---: | :---: |
|RDS Instances |$24000|
|EC2 Instances|$200(Compute Savings Discount Included)|
|Glue|$1300|
|Other Services|$1000|
|**Total(Per month)** | $34,000|

### Conclusion

The above set of cost personas may give an rough idea of how the pricing will be running specific set of Workloads but it may differ based on the factors such as memory, cpu, storage and data tranfer cost. 

 


