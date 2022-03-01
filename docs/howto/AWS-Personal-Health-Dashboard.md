---
id: AWS-Personal-Health-Dashboard
title: AWS Personal Health Dashboard
sidebar_label: AWS Personal Health Dashboard
slug: /AWS-Personal-Health-Dashboard
---
## AWS Personal Health Dashboard notification 

> Author: PravinKumar S

> Last Reviewed Date: 10/19/2021

## Contents

- [Overview](#overview)
- [Personal Health Dashboard](#personal-health-dashboard)
- [Significance of enabling PHD notification](#significance-of-enabling-phd-notification)
- [Personal Health Dashboard module](#personal-health-dashboard-module)
- [Conclusion](#conclusion)


### Overview

The AWS Personal Health Dashboard is available to all AWS customers and provides a personalized view of the performance and availability of the AWS services. Notifications and remediation guidance are provided when AWS experiences events that affect the account.

### Personal Health Dashboard

Personal Health Dashboard provides proactive notifications of scheduled activities, such as maintenance of resources within the account and within regions. This helps end users plan their scheduled activities and infrastructure provisioning. PHD(Personal Health Dashboard) alerts include detailed information and guidance, enabling you to take immediate action to deal with events impacting AWS resources. Additionally, the AWS Health API can be integrated with existing in-house or third-party IT management tools.

PHD includes two types of events,
1. Account specific event: Issues specific to the resources which is used within the accounts will be notified.

2. Public event: Resources which are not in use, but are available in the accounts region, so that customers will be aware of any events relating to the resource.

### Significance of enabling PHD notification

1. PHD helps in providing pro-active notifications regarding the events and can act on scheduled events accordingly.
2. PHD includes remediation details and specific guidance so that actions can be taken for events that affect your resources.
3. Personalized view of the service health which includes the services affectd specific to the account.
4. AWS Health API helps in integrating the events with external tools as well as with internal services to get customized notifications.

### Personal Health Dashboard module

To make sure PHD notifications reach individual and group mailboxes, the AWS Personal Health Dashboard module is included specifically into the OACCOE repository. Cloudwatch event rule "aws.health" is created to capture events and passes them to the target Lambda function to trigger e-mails to individuals and groups. In this example, the Azure email SMTP relay server is used to send emails from AWS cloud to distribution list.  

Reference module: https://github.optum.com/oaccoe/aws_personal_health_dashboard

### Conclusion:
AWS's Personal Health Dashboard is a simple and common service that helps users keep track of maintenance and scheduled events. Further, these modules help to send notification emails from PHD directly to our mailboxes, so that we can avoid surprises during infrastructure provisioning and disruptions during business hours. 

