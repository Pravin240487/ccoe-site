---
id: AWS-Cost-Estimation-Guide
title: AWS Cost Estimation Guide
sidebar_label: AWS Cost Estimation Guide
slug: /aws-cost-estimation-guide
---
## AWS Cost Estimation Guide

> Author: ArunKumar R

> Last Reviewed Date: 09/13/2021

## Contents

- [Overview](#overview)
- [Purpose](#purpose)
- [Prerequisites](#prerequisites)
- [Step by Step instructions with screenshots](#step-by-step-instructions-with-screenshots)
- [Conclusion](#conclusion)


## Overview

AWS Cost Estimation is one of key steps in the AWS Cloud Journey. The below are some of the below tools which can help us do the AWS Cost Estimation.

1. **Terraform Community Module on AWS Pricing:** There is a terraform community module example for estimating the cost of AWS Resources during Terraform Plan using TF plan json file and with using terraform state file. For more details and examples, refer this repo
https://github.optum.com/oaccoe/aws_pricing_example

2. **AWS Pricing Calculator** lets us explore AWS services and create an estimate for the cost of our use cases on AWS. We can model our solutions before building them, explore the price points and calculations behind our estimate, and find the available instance types and contract terms that meet our needs. This enables us to make informed decisions about using AWS. We can plan our AWS costs and usage or price out setting up a new set of instances and services. This guide will mainly focus on this.


## Purpose

AWS Pricing Calculator is useful both for people who have never used AWS and for users who want to reorganize or expand their AWS usage. We don't need any experience with the cloud or AWS to use AWS Pricing Calculator. 

## Prerequisites
We don't need an AWS account or in-depth knowledge of AWS to use AWS Pricing Calculator.

For best results, it is suggested that we have a plan for how we want to use AWS before starting our estimate. For example, decide whether you want to break out your estimate by cost center, by product that we run on AWS, or by regional stacks. 

## Step by Step instructions with screenshots

The Getting Started chapter walks us through a task using AWS Pricing Calculator so that we can get an idea of how to use AWS Pricing Calculator. In this case, we walk you through getting an estimate for an Amazon EC2 instance using the Amazon EC2 Quick estimate option. The Amazon EC2 quick estimate enables you to add an Amazon EC2 instance to your estimate without delving deeply into the different Amazon EC2 options. This enables you to get an estimate without knowing the technical details of all of the Amazon EC2 instance types. 

To complete this tutorial, perform the following tasks:

    Step 1: Create an estimate

    Step 2: (Optional) Add a group

    Step 3: Add and configure a service


**Step 1:** Create an estimate

To get started generating an estimate, create your estimate and assign your estimate a Region.

To create your estimate

    1. Open AWS Pricing Calculator at https://calculator.aws/#/

    2. Choose Create estimate.

    3. On the Select service page, find the service of your choice and choose Configure.

    4. Add a Description for the estimated service.

    5. Select a Region.

    6. Enter your settings in the Service settings section.

    7. Choose Add to my estimate.


**Step 2:**: (Optional) Add a group

A group enables you to organize services together. You can add one or more services to each group. You can use groups to organize your estimate in different ways, such as by cost center, service stack, product architecture, or client. 

To add a group to your estimate

    1. To create a group, in the upper-right header, choose Add group.

    2. For Group name, enter My service group.

    3. Choose Add group.



**Step 3:** Set alert subscription

Step 3: Add and configure a service

After you have an estimate and (optionally) a group, add and configure services to your estimate to generate estimated costs. If you didn't create a group, use the My estimate view instead of the My service group view. Everything else in the following procedure remains the same.

In this case, we're adding Amazon EC2 using the Amazon EC2 Quick estimate option.

To add and configure a service for your estimate

    1. On the My service group page choose Add service, which brings you to a page of services that you can add to your estimate.

    2. On the Add service page, select Amazon EC2 and choose Configure in the upper-right header. This adds Amazon EC2 to your group and takes you to the Quick estimate view, where you can configure what you want in an Amazon EC2 instance.

    The Quick estimate view is preloaded with default values, enabling you to see a starting estimate without adding or changing any information. You can change any of the values for the following parameters or keep the defaults when applicable:

        Description

        Region

        The operating system

        The number of Amazon EC2 instances

        The Amazon EC2 instance search options

        The pricing model

        The reservation term

        The payment options

        The storage volume

        The storage amount

    3. Choose Add to my estimate.

    This adds an Amazon EC2 instance with the selected parameters to the group that you created in step 1 and returns you to the My estimate page. The Services section lists the service estimates that you added.

    The My service group page shows you how much the selected default instance would likely cost you. The Service section lists your service names with the Region that you specified for each service. You can create multiple estimates for the same service with different Regions to compare price differences. Note that estimates are just that: estimates. AWS charges are calculated using the actual AWS usage for an account.

Similarly, the other AWS Services can be added to the Estimate.

**Step 4:** Saving and sharing your estimate

You can save each estimate's unique link to share or revisit directly through your browser. Estimates are saved to AWS public servers.

Any changes that we make to an estimate requires us to save again. AWS Pricing Calculator doesn't save automatically.

Each time that we save an estimate, the system generates a unique link. If we don't copy and save the newly generated link, we can't access any saved changes.

Creating an estimate link

To create an estimate and share the results, save the estimate and copy the generated link.

To create your public save link

    1. Choose Save estimate, read the Public server acknowledgment and choose Agree and Continue.

    2. Choose Copy public link to save your generated link.

**Step 5:** Exporting estimates
You can export your AWS Pricing Calculator estimate as a CSV file. This enables you to save the parameters that AWS Pricing Calculator used to create your estimate so that you can revisit them if you decide to set up AWS services. 

To export an AWS Pricing Calculator estimate

    1. From the Action dropdown, choose Export.

    2. In the dialog box, choose Save File and choose OK.



## Conclusion:

To get the most out of our estimates, we should have a good idea of our basic requirements. For example, if we're going to try Amazon Elastic Compute Cloud (Amazon EC2), it might help if you know what kind of operating system you need, what your memory requirements are, and how much I/O you need. We should also decide whether we need storage, such as if you're going to run a database and how long we intend to use the servers. We don't need to make these decisions before generating an estimate, though. We can play around with the service configuration and parameters to see which options fit our use case and budget best.

**Note:** In addition to the above cost, there will be an additional cost as part of HCC Chargeback. Pleae Refer: https://cloud.optum.com/docs/operational-guides/chargeback