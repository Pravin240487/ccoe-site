---
id: AWS-Cost-Anomaly-Detection-Guide
title: AWS Cost Anomaly Detection Guide
sidebar_label: AWS Cost Anomaly Detection Guide
slug: /aws-cost-anomaly-detection-guide
---
## AWS Cost Anomaly Detection Guide

> Author: ArunKumar R

> Last Reviewed Date: 08/26/2021

## Contents

- [Overview](#overview)
- [Purpose](#purpose)
- [Prerequisites](#prerequisites)
- [Architecture Diagram](#architecture-diagram)
- [Step by Step instructions with screenshots](#step-by-step-instructions-with-screenshots)
- [Conclusion](#conclusion)


## Overview

Amazon Web Service’s Cost Anomaly Detection is a complimentary service that screens our spending trends to identify anomalous spending and provide in-depth cause analysis. Cost Anomaly detection helps to reduce unexpected cost surprises for customers.

## Purpose

AWS Cost Anomaly Detection is backed by sophisticated AI and machine learning algorithms and can recognize and distinguish between gradual increases in cloud costs and one-off expense spikes. You can create your cost anomaly detection parameters and cost anomaly alerts in simple steps. You can make different subscription alerts for a similar cost monitor or various cost monitors for one subscription alert based on your business needs.

With every anomaly discovery, this free service gives a deep dive analysis so users can rapidly identify and address the cost drivers. Users can also provide input by submitting reviews to improve the precision of future anomaly identification. 

As a component of AWS’s Cost Management solution offering, Cost Anomaly Detection is incorporated into Amazon Web Service Cost Explorer so users can scan and identify their expenses and utilization on a case-by-case basis.

## Prerequisites
* By default Cost Explorer service will be available in all the HCC AWS Accounts.
* The Person who wants to enable Cost Anomaly Detection should have access to AWS Cost Explorer Service(_Owner or _Contributor role has access to it by default)

## Architecture Diagram
![AWS Cost Anomaly Workflow](https://github.optum.com/raw/oaccoe/CCOE-Site/master/static/img/AWS_CostAnomaly_Detection_Arch.png)

## Step by Step instructions with screenshots

**Step 1:** Login to the AWS Console and Navigate to AWS Cost Explorer Service.

![Navigating to the AWS Cost Explorer](https://github.optum.com/raw/oaccoe/CCOE-Site/master/static/img/CostAnomaly_Step1.png)

**Step 2:** Creating a cost monitor

The cost monitor creation process allows you to create spend segments and evaluate spend anomalies in a preferred granular level. For example: an individual Linked Account, an individual Cost Category value, or an individual Cost Allocation tag.

![Creating a Cost Monitor](https://github.optum.com/raw/oaccoe/CCOE-Site/master/static/img/CostAnomaly_Step2.png)

As HCC accounts are member accounts, we can only create an AWS services monitor. Custom monitoring (linked account, cost category, cost allocation tag) are not available as options.

This monitor is recommendable for users who don't want to segment AWS costs through internal usage and environment. The AWS service monitor individually assesses AWS services for oddities. As we use new AWS services, this monitor will automatically begin to assess that service for cost inconsistencies without any configuration obligations from you.

![Choosing AWS Services Monitor ](https://github.optum.com/raw/oaccoe/CCOE-Site/master/static/img/CostAnomaly_Step3.png)

**Step 3:** Set alert subscription

Once we have created our cost monitor, we can choose our alerting preference by setting up a dollar threshold (e.g. only alert on anomalies with impact greater than $1,000) . We don’t need to define an anomaly (e.g. percent or dollar increase) as Anomaly Detection does this automatically for us and adjusts over time.). It will take around 24 hours for the anamolies to be start detecting in our account.
![Creating a New Subscription](https://github.optum.com/raw/oaccoe/CCOE-Site/master/static/img/CostAnomaly_Step4.png)

![Subcription Successful](https://github.optum.com/raw/oaccoe/CCOE-Site/master/static/img/CostAnomaly_Step5.png)

**Step 4:** Detection history 

How was this identified?
AWS Cost Anomaly Detection estimates cost impact of the anomaly each day by using your historical spend data. Adding the cost impact (deviation of the anomaly from the normal spend level) on a daily level results in the sum of the total cost impact over the anomaly period.

![Navigating to the Detection History](https://github.optum.com/raw/oaccoe/CCOE-Site/master/static/img/CostAnomaly_Step6.png)

![Exploring Anomaly Details](https://github.optum.com/raw/oaccoe/CCOE-Site/master/static/img/CostAnomaly_Step7.png)

**Step 5:** Submitting Assessment 

We have the option to submit the assessment of each anamolies. If we think that Anomaly is false positive or accurate, we can submit it so that we will get more accurate anamolies in future.

![Submitting Assessments](https://github.optum.com/raw/oaccoe/CCOE-Site/master/static/img/CostAnomaly_Step8.png)

## Conclusion:
Cost Anomaly Detection by AWS provides a practical way to track and reduce costs in the cloud environment. IT, DevOps, and CostOps teams can now get a holistic understanding of cloud costs and budgeting and implement strategies that optimize resource utilization. Cost Anomaly Detection is the key to a profitable cloud. This also comes with free of cost.

