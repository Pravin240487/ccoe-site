---
id: terraform-module-usage
title: Terraform Module Usage
sidebar_label: terraform-module-usage
---

Integrating the servicenow and cloudwatch can be done by using our [Module](https://github.optum.com/oaccoe/aws_monitoring)

``` hcl
locals {
  ec2_filters = {
    "optum:environment" = "dev"
    "optum:application" = "dts"
  }
  rds_filters = {
    "optum:environment" = "dev"
    "optum:application" = "dts"
  }
   ecs_filters = {
    "optum:environment" = "dev"
    "optum:application" = "dts"
  }
   redshift_filters = {
    "optum:environment" = "dev"
    "optum:application" = "dts"
  }
   lambda_filters = {
    "optum:environment" = "dev"
    "optum:application" = "dts"
  }
  alb_filters = {
    "optum:environment" = "dev"
    "optum:application" = "dts"
  }
  sqs_filters = {
    "optum:environment" = "dev"
    "optum:application" = "dts"
  }
  sns_filters = {
    "optum:environment" = "dev"
    "optum:application" = "dts"
  }
  mq_filters = {
    "optum:environment" = "dev"
    "optum:application" = "dts"
  }
}

module "cloudwatch-alerts" {
  source = "git::https://github.optum.com/oaccoe/aws_monitoring.git//modules/cloudwatch-alerts?ref=v2.4.0"
  #source                  = "../modules/cloudwatch-alerts/" ## If you want to use local copy enable this 
  env_prefix              = "dev"
  servicenow_group        = "OA-Product"
  alarms_email            = ["user@optum.com"]
  servicenow_ticket       = "true" 
  servicenow_url          = "https://optumstage.service-now.com/api/now/import/u_incident" ## This is stage servicenow url when you implement for production please update production servicenow url "https://optumworker.service-now.com/api/now/import/u_incident"
  ec2_tag_filter          = local.ec2_filters
  rds_tag_filter          = local.rds_filters
  redshift_tag_filter     = local.redshift_filters
  ecs_tag_filter          = local.ecs_filters
  lambda_tag_filter       = local.lambda_filters
  alb_tag_filter          = local.alb_filters
  sqs_tag_filter          = local.sqs_filters
  sns_tag_filter          = local.sns_filters
  mq_tag_filter           = local.mq_filters
  python_version          = "python3.7"
  ssm_servicenow_account  = "servicenow_account"
  #victorops_routing_key = "OI_AWSCloudOps_Prod" ##Uncomment this to enable VictorOps notification and add your VictorOps on-call routing key
}
```

:::note
If servicenow_ticket set to ***true*** a lambda function will be triggered to create servicenow incident ticket based on cloudwatch configuration.
:::