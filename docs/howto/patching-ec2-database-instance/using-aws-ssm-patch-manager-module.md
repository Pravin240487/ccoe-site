---
id: using-aws-ssm-patch-manager-module
title: Using AWS SSM Patch Manager module
sidebar_label: Using AWS SSM Patch Manager module
---
1. Non production scan
   
> You can target instances using either Instance IDs or Tag

          setting = {
            "tag_key" = "Name"
            "tag_value" = "Test-non-production" 
            "operation" = "Scan" 
            "timeout-seconds" = "600"
            "sleep-seconds"   = "61"
            "Reboot_Option" = "RebootIfNeeded" // RebootIfNeeded or NoReboot
        }

2. Non production install

    scan and install the missing updates on the "Name : Test-non-production" tagged instances

          setting = {
            "tag_key" = "Name"
            "tag_value" = "Test-non-production" 
            "operation" = "Install" 
            "timeout-seconds" = "600"
            "sleep-seconds"   = "61"
            "Reboot_Option" = "RebootIfNeeded" // RebootIfNeeded or NoReboot
        }
3. Production scan

    scanning the missing updates on the "Name : Test-production" tagged instances

          setting = {
            "tag_key" = "Name"
            "tag_value" = "Test-production" 
            "operation" = "Scan" 
            "timeout-seconds" = "600"
            "sleep-seconds"   = "61"
            "Reboot_Option" = "RebootIfNeeded" // RebootIfNeeded or NoReboot
        }
4. Production install

    scan and install the missing updates on the "Name : Test-production" tagged instances

          setting = {
            "tag_key" = "Name"
            "tag_value" = "Test-production" 
            "operation" = "Install" 
            "timeout-seconds" = "600"
            "sleep-seconds"   = "61"
            "Reboot_Option" = "RebootIfNeeded" // RebootIfNeeded or NoReboot
        }


for more information refer the Terraform module usage

## Terraform Module Usage

There are two methods for patching the instances
-   Install patches on specific instances or group instances using InstanceIDs
-   Install patches on group of instances Using Tag 

## To install patches on specific instances

``` go
module "ssm_patch_manager" {
  #source = "../../profiles/aws_ssm_patchmanager/"
  source = "git::https://github.optum.com/oaccoe/aws_patchmanger.git//profiles/aws_ssm_patchmanager"
  region                        = "us-east-1"
  namespace                     = var.namespace
  operating_system              = var.operating_system
  patch_baseline_approval_rules = var.patch_baseline_approval_rules
  output_bucket = module.output_bucket.id
  // output_bucket = "165387667510-glue-test-arun"
  #approved_patches = ["KB5007206"]
  #rejected_patches = ["KB5007298", "KB5007206"]
  notification_events = ["Success","Failed"]
  service_role_arn = module.patchmanager_servicerole.arn
  topic_arn = module.patchmanager_topic.sns_topic_arn
  notification_type = "Invocation" // Invocation or Command
  setting = {
    operation = "Scan"
    sleep-seconds   = "60"
    Reboot_Option = "RebootIfNeeded" // RebootIfNeeded or NoReboot
    target_key = "InstanceIds"
    target_value = ["i-004fed72054804c23","i-0a242c3678d99fb65"]
 }
  depends_on = [module.output_bucket,module.patchmanager_servicerole,module.patchmanager_topic]
}
```

:::note
- Patch results are stored in S3 buckets with the name of the command ID
- Patch Notification will send 
:::

## To install patches on instances using Tag

```Step.1``` Tag the instances.

```Step.2``` provide the "tag_key" = "" & "tag_value" = "" in terraform configuration file and run the terraform module.

``` go
module "ssm_patch_manager" {
  #source = "../../profiles/aws_ssm_patchmanager/"
  source = "git::https://github.optum.com/oaccoe/aws_patchmanger.git//profiles/aws_ssm_patchmanager"
  region                        = "us-east-1"
  namespace                     = var.namespace
  operating_system              = var.operating_system
  patch_baseline_approval_rules = var.patch_baseline_approval_rules
  output_bucket = module.output_bucket.id
  // output_bucket = "165387667510-glue-test-arun"
  #approved_patches = ["KB5007206"]
  #rejected_patches = ["KB5007298", "KB5007206"]
  notification_events = ["Success","Failed"]
  service_role_arn = module.patchmanager_servicerole.arn
  topic_arn = module.patchmanager_topic.sns_topic_arn
  notification_type = "Invocation" // Invocation or Command
  setting = {
    tag_key = "Name"
    tag_value = "Build instance for ImageRecipelinuxMSTR"
    operation = "Scan"
    sleep-seconds   = "60"
    Reboot_Option = "RebootIfNeeded" // RebootIfNeeded or NoReboot
 }
  depends_on = [module.output_bucket,module.patchmanager_servicerole,module.patchmanager_topic]
}
```

:::note
- The scan operation won't take much time, so reducing sleep-seconds will have no impact on the results
- This module will take a snapshot of the root disk of the target instance when installing patches
:::





