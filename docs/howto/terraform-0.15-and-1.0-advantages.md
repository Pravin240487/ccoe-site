---
id: Advantages of Terraform 0.15 and 1.0 versions
title: Advantages of Terraform 0.15 and 1.0 versions
sidebar_label: Advantages of Terraform 0.15 and 1.0 versions
---

### Advantages of Terraform 0.15 and 1.0 versions

> Point of Contact: Atchaya Saminathan

> Last Reviewed Date: 07/15/2021

### 1. Overview
#### 1.1. Purpose 

   The terraform is an open-source infrastructure as code software tool that enables you to safely and predictably create, change, and improve infrastructure.
   
#### 1.2 Scope
   
   The scope of this document is to provide the advantages of terraform versions 0.15 and 1.0. Through upgrading the terraform versions, we can avail the imporved performance and new features of terraform.
   
### 2. Pre-requisites

- AWS account authorization to test the upgraded version of terraform code
- IAM role with enough permission to test the upgraded version of terraform code

### 3. Advantages of terraform versions

#### 3.1. Advantages of terraform 0.15 version

- **Remote State Data Source Compatibility** - Terraform has relaxed the remote state data source parser requirements. This helps us to adopt new versions of Terraform into the workflows without having to immediately upgrade existing Terraform codebases. The versions 0.12.30, 0.13.6, 0.14.0, 0.15.0, and 1.0.x will be able to access remote state data sources in versions of Terraform up to 1.0.x.

- **State File Format Stability** - Terraform state is cross-compatible between versions 0.14.x, 0.15.x, and 1.0.x. This flexibility will let us more easily move between versions of Terraform.

- **Unified Console Support** - Terraform 0.15 makes a significant foundational improvement by unifying the console experience across all supported platforms, bringing with it consistent UTF-8 support and a move to virtual terminal sequences on Microsoft Windows.

- **Provider-Based Sensitivity and Sensitive Functions** - This protects sensitive values from being printed to the console while doing terraform plan. Also introduced the 'nonsensitive' field to hint Terraform that the result is not sensitive.

- **Structured Logging Levels** - Terraform 0.15 ships with improved logging behavior. The latest SDK (v.2.4+) can now reliably target messages to specific log levels. Additionally, Terraform CLI and provider logging levels can both be controlled independently using `TF_LOG_CORE=level` and `TF_LOG_PROVIDER=level`.

#### 3.2. Advantages of terraform 1.0 version

The intention of the Terraform 1.0 release is that terraform modules written for Terraform v1.0 will continue to plan and apply successfully, without required changes, throughout the v1.x releases.

In short, terraform aim to upgrades between v1.x releases straightforward, requiring no changes to our configuration, no extra commands to run upgrade steps, and no changes to any automation we've set up around Terraform. (The primary focus for 1.0 was stability. Really Terraform 0.15 was 1.0 beta).

- **Greater Terraform State Interoperability** - Terraform has made tremendous strides around interoperability. Terraform state is now cross-compatible between versions 0.14.x, 0.15.x, and 1.0.x. Remote state data source compatibility is now backported to support versions 0.12.30, 0.13.6, 0.14.0, 0.15.0, and 1.0.x. These improvements add flexibility to workflows.

- **Improved Upgrade Experience** - Starting with Terraform 0.15 and continuing through the lifecycle of 1.x, we can now upgrade to a new Terraform version and our workflows will continue to be operational, just as in prior versions. There is no requirement for upgrade tools, refactoring, or other changes in order to use Terraform 1.x.

