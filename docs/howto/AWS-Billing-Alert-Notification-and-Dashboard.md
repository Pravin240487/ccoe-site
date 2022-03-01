---
id: AWS-Billing-Alert-Notification-and-Dashboard
title: AWS Billing Alert 
sidebar_label: AWS Billing Alert Notification and Dashboard

---
### AWS Billing Alert Notification and Dashboard

`Status: In progress`

> Point of Contact: Arunkumar R

> Last Reviewed Date: 11/02/2021

### 1. Overview

#### Legacy Billing Alerts

AWS Billing Alert Notification is a setup which is written using python script to send billing alert notification to the product owners based on the budget allocated. This will help the product teams to keep track of their AWS usage and to avoid any surprises in the AWS Cost.

### 2. AWS Services Used

* Lambda Function - It is a computing service that runs code in response to events and automatically manages the computing resources required by that code.
* Cost Explorer - Cost Explorer is a tool that enables us to fetch the AWS Cost usage by Services/Tags and to the Forecasted cost-usage amount.
* Cloudwatch Rules - It is used to trigger the Lambda function on a scheduled basis.
* Amazon Budget - This will provide us the Billing Dashboard for visualizing the data.
* Amazon SES - It is an email service which can be used to send email to product owner

### 3. Implemented AWS Accounts

* awshcptprod - 894103836036
* awshcptdev - 585807852923

### 4. Budget Reporting Alert

- **Daily Warning/Critical Email Alert report:**
     - Notification to Product Owners/Developers with their product specific AWS usage cost grouped by AWS Resources if cost usage      exceeded their budget or forecasted usage.
     - Warning Alert - If forecasted_monthly_usage percent is greater than 150% or budget_used percent is greater than 90%.
     - Critical Alert - If forecasted_monthly_usage percent is greater than 200% or budget_used percent is greater than 100%.
- **Monthly Email report**
     - Notification to Product Owners/Developers with their product specific AWS usage cost grouped by AWS Resources and monthly cost history.
     - Notification to DevOps Team with the Overall Consolidated list of Product teams and their AWS usage cost  
- **Weekly Email report**
     - Notification to Product Owners/Developers with their product specific AWS usage cost grouped by AWS Resources and monthly cost history.
     - Notification to DevOps Team with the Overall Consolidated list of Product teams and their AWS usage cost
 
### 5. Budget Dashboard

The AWS Budgets Dashboard is the AWS Service which helps us to Visualize the billing trend of a product. From the AWS Budgets Dashboard, we can create, edit, and manage your budgets, as well as view the status of each of our budgets. We can also view additional details about your budgets, such as a high-level variance analysis and a budget criteria summary.

Budgets can be created at the monthly, quarterly, or yearly level, and we can customize the start and end dates. We can further refine your budget to track costs associated with multiple dimensions, such as AWS service, linked account, tag, and others. 

Budget dashboard url of the products will available in the AWS Email Billing report which we are sending. To access the dashboard, firstly we need to login to AWS Console and then the dashboard can be access. We can also explore the data using AWS Cost Explorer.

### 6. Future Plans

* Decommission Legacy Billing Alerts
* Deploy outside oaccoe and HCPT
* Account level reports (consider factoring in CC chargebacks)
