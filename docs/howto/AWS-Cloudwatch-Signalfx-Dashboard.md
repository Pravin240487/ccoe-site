---
id: AWS-Cloudwatch-Signalfx-Dashboard-Guide
title: AWS Cloudwatch Signalfx Dashboard Guide
sidebar_label: AWS Cloudwatch Signalfx Dashboard Guide
slug: /aws-cloudwatch-signalfx-dashboard-guide
---

### AWS Cloudwatch Signalfx Dashboard Guide

> Point of Contact: ArunKumar R

> Last Reviewed Date: 11/26/2021

## Contents

- [Overview](#overview)
- [Purpose](#purpose)
- [Prerequisites](#prerequisites)
- [Step by Step instructions with screenshots](#step-by-step-instructions-with-screenshots)
- [Conclusion](#conclusion)


## Overview

Use Splunk Observability Cloud(Signalfx) to monitor critical information about your applications, infrastructure, and cloud services.

Observability Cloud provides a unified experience for collecting and monitoring metrics. Data collection and monitoring in one place enables full-stack, end-to-end observability of your entire infrastructure. This can also help us setting up Detector to get Custom Alerts in the Email.

Signalfx Dashboards are groupings of charts and visualizations of metrics. Well-designed dashboards can provide useful and actionable insight into your system at a glance. Dashboards can be complex or contain just a few charts that drill down only into the data you want to see.

## Purpose

This guide will help us to setup Signalfx Dashboard for the teams who are using AWS Cloud. The below steps will help in enabling Signalfx dashboard. 

## Prerequisites
* Login to the Signalfx Dashboard with the msid credentials. 
   Login URL: https://optum-provider.signalfx.com
   
   By default, most of the folks may have access to the above url to access the dashboard. 

   If it doesn't, please try getting access through secure portal for the secure group "optum_provider_signalfx"

* The Dashboard will look as follows.
![Signalfx Dashboard](https://github.optum.com/raw/oaccoe/CCOE-Site/master/static/img/Signalfx-dashboard.png)


## Step by Step instructions to Enable Signalfx Dashboard for a Team:

**Step 1:** To Enable Signalfx, we may need to request for an External id, User Token and to create a new team in Signalfx dashboard. This will be done by the **Provider DevOps Enablement**. Service Now request should be created with the team. Please find below service now ticket for the reference.

[RITM1851786](https://optum.service-now.com/sc_req_item.do?sys_id=908866641bfff0d4a9f0c8415b4bcbbe&sysparm_record_target=sc_req_item&sysparm_record_row=3&sysparm_record_rows=118&sysparm_record_list=opened_by%3Da3774702dba37b4034d392c5d4961933%5EORDERBYDESCopened_at)

![Service Now Ticket for Signalfx](https://github.optum.com/raw/oaccoe/CCOE-Site/master/static/img/Signalfx_Servicenow_ticket.png)


**Step 2:** Signafx will Assume an IAM Role in the AWS Account. Use Terraform module for creating an IAM Role in the AWS Account where the Signalfx needs to be enabled. Variable external_id  should be replaced with the one provided by the Provider DevOps Enablement team.

https://github.optum.com/oaccoe/aws_iam/tree/master/examples/signalfx_iam_role

**Step 3:** By default, the Signalfx application will import all available data for every CloudWatch-enabled region in our Amazon Web Services account. 

Go to https://optum-provider.signalfx.com and Choose "Dashboards"

![Dashboard of Signalfx](https://github.optum.com/raw/oaccoe/CCOE-Site/master/static/img/Signalfx_dashboard1.png)

**Step 4:** For Setting up the dashboard for the Specific team, the following terraform module can be used. The module requires us to pass the external id token as a variable. It has different AWS Services and dashboard for the required services can be deployed. This can by done the Cloud Operations team.

https://github.optum.com/Dojo360/signalfx-dashboards

**Step 5:** Once the dashboard setup is complete, the dashboard for the particula team can be accessed by Choosing the specific team under "All Teams" dropdown menu.

![Team Dashboard of Signalfx](https://github.optum.com/raw/oaccoe/CCOE-Site/master/static/img/Signalfx_dashboard5.png)

**Step 6:** Then, the specific service in the team can be choosen to see the metrics and the dashboard of the particular services. We can also use specific filters such as Instance_id to look for the specific resources.

![Team Dashboard of Specific Service](https://github.optum.com/raw/oaccoe/CCOE-Site/master/static/img/Signalfx_dashboard4.png)

**Step 7(Optional)**: Set Up Detectors to Trigger Alerts. https://docs.signalfx.com/en/latest/detect-alert/set-up-detectors.html

![Signalfx Detector for Alerting](https://github.optum.com/raw/oaccoe/CCOE-Site/master/static/img/Signalfx_dashboard6.png)


## Conclusion: 

This guide will help us to setup Signalfx dashboard for any product team who are onboarding their products into AWS Cloud Environment. Enabling Signalfx is one of the items when moving into Production environment.
