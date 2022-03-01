---
id: provisioning-a-new-aws-account
title: Provisioning a new AWS account
sidebar_label: Provisioning a new AWS account
---
### Provisioning a New Cloud Account

> Point of Contact: Wyatt Andersen

> Last Reviewed Date: 7/1/2021

### 1. Overview

If you do not have a plan for what your cloud architecture will look like, or if you just want to experiment with AWS, you can always provision a "[Disposable Cloud Environment (DCE)](https://cloud.optum.com/docs/dce/overview)" without going through an extensive process or involving EIS. The provisioning process for a DCE account is [here](https://cloud.optum.com/docs/dce/request).

**Notes:** 

* DCE accounts are not identical to "real" AWS accounts. Some services aren't available and some integrations work differently. These work best for individual testing. 
* DCE accounts are not intended or approved for real data or production work loads. 

### 2. Pre-requisites

- Request MSID access to global groups in Secure
   AzureAccess
   github_users
- Login to github.optum.com at least once, to complete your GitHub user profile.
- Request New Native Cloud ID following these instructions
- Install Microsoft Authenticator on your phone following these instructions

### 3. Configuration steps 

#### 3.1. Non Prod
##### Process

**3.1.1.** Review the information from the Health Care Cloud team [here](https://commercialcloud.optum.com/docs/intake/intake-overview.html). That team owns all Optum AWS and Azure accounts and Optum's engagement with Amazon and Microsoft.

**3.1.2.** Make sure your project has an ASK ID linked to a GL Code.

**3.1.3.** Make sure your "Business Segment Chief Architect" has approved your placement in AWS or Azure. (You'll want an email from them saying so for the "Business Segment Chief Architect Awareness" section of the intake doc.)

**3.1.4.** Identify if you are subject to any additional regulations besides HIPAA (ex: HITRUST, NIST, GDPR, SOC2, etc.).

**3.1.5.** Document your project and architecture in an "intake.md" document according to [this template]
(https://cloud.optum.com/assets/intake/intake.txt). Examples: [intake.md](https://github.optum.com/oaccoe/wiki/wiki/Intake.md-Examples).

**3.1.6.** Open a [Service Now](https://optum.service-now.com/itss2/
) ticket: "Request Something" > "Cloud Services" > "Create New Public Cloud Account." Allow at least 3 days for your account to be provisioned. 

#### 3.2. Non Prod Security Endorsement

##### Pre-requisites 

* Updated intake.md documentation see: [Navigating an EIS Review](https://github.optum.com/oaccoe/wiki/wiki/EIS-Review)
* "Live" version of your infra in non-prod ready for EIS review

##### Process

- Open a [Service Now](https://optum.service-now.com/itss2/) ticket: "Request Something" > "Cloud Services" > "Security Cloud Endorsement" 
- Complete the review (allow significant time for this, 2 weeks to 2 months)

(See also [Navigating an EIS Review](https://github.optum.com/oaccoe/wiki/wiki/EIS-Review).)

#### 3.3. Prod

##### Pre-requisites

* Non Prod account built out with the infrastructure you want to deploy to prod (with IaC and CI/CD).
* Non Prod Security Endorsement (closed "Security Cloud Endorsement" ticket in Service Now).

##### Process

- Open a [Service Now](https://optum.service-now.com/itss2/) ticket: "Request Something" > "Cloud Services" > "Create New Public Cloud Account." Allow at least 3 days for your account to be provisioned.

#### 3.4. Prod Endorsement

- Open a [Service Now](https://optum.service-now.com/itss2/) ticket: "Request Something" > "Cloud Services" > "Security Cloud Endorsement" 
- Assuming no major changes between non-prod and prod this process should be quick (2-3 weeks). 

