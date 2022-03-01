---
id: aws 
title: AWS 101
sidebar_label: AWS 101
---

# AWS 101

AWS is a **massive** topic. This document will make no effort to cover all of it, or even most of it. Instead we'll focus on the absolute basics and how to work with AWS _at Optum_. 

## Provisioning an AWS account

See [Provisioning a new AWS account](https://github.optum.com/pages/oaccoe/CCOE-Site/docs/howto/provisioning-a-new-aws-account).

It's recommended that you start with a [Disposable Cloud Environment (DCE) account](https://cloud.optum.com/docs/dce/overview) those are relatively low cost, low risk, and can be provisioned quickly. 

## Accessing AWS at Optum

### Disposable Cloud Environments (DCE)

For DCE accounts, you'll access them through the [Health Care Cloud website](https://cloud.optum.com/). 

### Non Prod and Prod

For "real" accounts (non prod and prod) you'll access them through Secure. When an account is initially created HCC will provide you with some starting Secure groups (AWS_1234556789_Owner, AWS_1234556789_Contributor, AWS_1234556789_Read). You can find their details [here](https://github.optum.com/CommercialCloud-Team/launchpad_aws/tree/master/stages/customer/tracks/iamsso/step1_aws). 

In general: 

* _Owner should be used by your CI/CD pipelines. It can be used by humans for non prod environments, but should not be used by humans in prod outside of "break the glass" scenarios. _Owner represents the maximum permissions HCC allows.
* _Contributor should be used by people doing work in your account. It has write access to most things, except IAM. It can be used by humans for non prod environments, but should not be used by humans in prod outside of "break the glass" scenarios.
* _Read is the safest and most preferrable access for humans in prod and non prod.

Once you've established the "personas" that need access to your account you should create "least priviledge" IAM Roles/Polices and use these instead of the more permissive HCC defaults. See [Creating Secure Groups](https://github.optum.com/pages/oaccoe/CCOE-Site/instructions/secure-group-creation/).

### Single Sign On (SSO)

For console access you'll need to use the following link to access your HCC AWS account: [AWS SSO Link](https://authgateway1.entiam.uhg.com/idp/startSSO.ping?PartnerSpId=https%3A%2F%2Fsignin.aws.amazon.com%2Fsaml).

### Programatic Access

For progamatic access you'll want to use the [aws_cli_saml_ping_v2](https://github.optum.com/CommercialCloud-EAC/python-scripts/tree/master/aws_cli_saml_ping_v2) script. 

## AWS Concepts

### Native vs. Not

AWS has many "native" tools like S3, Glue, Athena, etc. **It is preferable to use native/managed tools** when possible for three reasons:

* AWS constantly improves these tools, if you adopt them you will get those benefits "for free."
* Native services are managed, as such it costs less to maintain them 
* Native services have are secured by the cloud provider in addition to your team

The main drawback however these tools are not "cloud agnostic" (quite the opposite!)

### Networking 101

Please refer to [AWS Networking for Developers](https://aws.amazon.com/blogs/apn/aws-networking-for-developers/) and [VPC How It Works](https://docs.aws.amazon.com/vpc/latest/userguide/how-it-works.html) to understand networking in AWS.

Keep in mind that while many AWS resources run "in" a VPC/Subnet you control, or can be configured to do so, some don't (like AWS IAM).

### Costs

[AWS Cost Explorer](https://aws.amazon.com/aws-cost-management/aws-cost-explorer/) is AWS's native tool for monitoring your spend. You can use it to drill down to specific resources, time ranges, and event Tags. However, it does not factor in [Health Care Cloud's chargeback](https://cloud.optum.com/docs/operational-guides/chargeback) or [discounts](https://cloud.optum.com/docs/operational-guides/reserved-instances/). 

You can better understand those by using the [Public CLoud Cost dashboard on ITFM](https://itfm.optum.com/analytics/PublicCloudCost).

### Security 

All AWS accounts at Optum are required to go through an [EIS review](https://github.optum.com/pages/oaccoe/CCOE-Site/instructions/navigating-an-eis-review/) and to be compliant with all [AWS LaunchPad policies](https://cloud.optum.com/docs/launchpad/aws-policies). 

The best tool for monitoring compliance is [Health Care Cloud (HCC)'s Cloud Board](https://cloud.optum.com/cloudboard). You can learn more about it [here](https://github.optum.com/pages/oaccoe/CCOE-Site/instructions/working-with-cloud-board/). 

Any policies that your project cannot be compliant with must be covered by an [eGRC Risk Record](https://github.optum.com/pages/oaccoe/CCOE-Site/instructions/egrc-risk-records/) which acts as an extention to the period of time you have to fix a security violation. 

In addtion to Cloud Board you should also keep an eye on [AWS Trusted Advisor](https://aws.amazon.com/premiumsupport/technology/trusted-advisor/). This is AWS's native tool for monitoring best practices. 

Finally, you should consider adopting [Cloud Custodian](https://github.optum.com/oaccoe/cloudcustodian) to create your own alerting and remediation systems.

### Tagging

Almost all AWS resources accept a "[Tag](https://docs.aws.amazon.com/general/latest/gr/aws_tagging.html)" parameter that allows for documenting individual resources. 










