---
id: Terraform migration from 0.12 to 0.14 version
title: Terraform migration from 0.12 to 0.14 version
sidebar_label: Terraform migration from 0.12 to 0.14 version
---

### Terraform migration from 0.12 to 0.14 version

> Point of Contact: Atchaya Saminathan

> Last Reviewed Date: 07/09/2021

### 1. Overview
#### 1.1. Purpose 

   The terraform is an open-source infrastructure as code software tool that enables you to safely and predictably create, change, and improve infrastructure.
   
#### 1.2 Scope
   
   The scope of this document is to provide the steps to migrate the terraform from 0.12 version to 0.14 version. Through updating, we can avail the imporved performance and new features of terraform.
   
### 2. Pre-requisites

- AWS account authorization to test the upgraded version of terraform code
- IAM role with enough permission to test the upgraded version of terraform code
   
### 3. Configuration steps

Please find below the steps to migrate Terraform from 0.12 version to 0.14 version,

**3.1** Ensure that the existing terraform code (0.12 version) is up-to-date.

**3.2** Run `terraform plan` and see no proposed changes on the existing version first, because otherwise pending changes can add additional unknowns into the upgrade process.

**3.3** Terraform v0.14 does not support legacy Terraform state snapshot formats from prior to Terraform v0.13, **so before upgrading to Terraform v0.14 you must have successfully run `terraform apply` at least once with Terraform v0.13** so that it can complete its state format upgrades.

**3.4** Rename the existing version of terraform binary file in the /usr/local/bin/ location 

**3.5** Upgrade terraform to the version 0.13 by downloading the zip file and extracting it as follows,
- wget https://releases.hashicorp.com/terraform/0.13.7/terraform_0.13.7_linux_amd64.zip
- sudo unzip terraform_0.13.7_linux_amd64.zip -d /usr/local/bin/

**3.6** Run `terraform init`, `terraform plan` and `terraform apply` to get update the state format.

**3.7** After the successful completion of terraform apply on 0.13 version, upgrade it to version 0.14 as follows,
- wget https://releases.hashicorp.com/terraform/0.14.10/terraform_0.14.10_linux_amd64.zip
- sudo unzip terraform_0.14.10_linux_amd64.zip -d /usr/local/bin/

**3.8** Update the terraform source code with regards to 0.14 version. 

**3.9** Run `terraform init`, `terraform plan` and `terraform apply` with the updated version and source code. `terraform init` will now generate a lock file in the configuration directory so that Terraform can make the same version selections in future. If you wish to retain the previous behavior of always taking the newest version allowed by the version constraints on each install, you can run `terraform init -upgrade` to see that behavior.

**3.10** You can see the features of terraform 0.14 like concised outcome from terraform plan/apply and .terraform.lock.hcl file with the provider version in the root module directory.

### 4. Benefits

- **Provider Dependency Lockfile** - This file is generated automatically after running the Terraform init to help ensure that the provider packages we depend on are not changed in-place upstream, whether accidentally or maliciously.
- **Concise Diff** - This new behavior is designed to help us quickly understand what changes Terraform is about to make to existing infrastructure. The terraform plan, apply and show have been updated to hide unchanged and irrelevant fields from outcome.
- **Sesitive value in Plan Output** - The expression whose result is derived from a sensitive input variable or sensitive output value also be obscured in the Terraform plan output. 
