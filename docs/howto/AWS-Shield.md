---
id: AWS-Shield
title: AWS Shield
sidebar_label: AWS Shield
---
> Point of Contact: Atchaya Saminathan

> Last Reviewed Date: 11/17/2021

### AWS Shield

AWS Shield Advanced provides expanded DDoS attack protection for web applications running on the resources. The Shield service is a combination of the integrated services which comprise of WAF and FM services to help mitigate against attacks.

#### Difference between WAF, Shield and Firewall Manager

| WAF (Web Application Firewall) | Shield | Firewall Manager |
|:------------------------------:|:------:|:----------------:|
| Protects Layer 7 (Application layer) | Protects Layer 3 (Network layer), Layer 4 (Transport layer) and also Layer 7  (Application layer) with the help of WAF | Centrally configures and manages the firewall rules (WAF and Shield) across multiple accounts and applications in AWS Organizations |
| Determines the attacks based on the Web ACL rules which we configured | Determines the attacks based on the analysis (AttackVector of DDoS) of network protocols, ports and DNS health check (Route 53 health check)| - |
| Metrics: AllowedRequests and BlockedRequests| Metrics: DDoSDetected, DDoSAttackBitsPerSecond, DDoSAttackPacketsPerSecond and DDoSAttackRequestsPerSecond | - |

#### Difference between Standard and Advanced Shield tiers

| Feature | Shield Standard | Shield Advanced |
|:--------:|-----------------| ----------------|
| 24X7 DDoS Response Team (DRT) Support - Event management, custom mitigations during high severity events and Post-attack analysis | Not available | Available |
|Cost reimbursement for DDoS charges related to Route 53, CloudFront and ELB | Not available | Available |
|Layer 3/4 attack forensics reports (source IP, attack vector, and more) | Not available | Available |
|Layer 3/4/7 attack historical report | Not available | Available |

## Usecases

We can block the requests based on the following usecases,
* Rate-limit
* Country
* URI path
* IP address
* Header
* Query string
* Single Query parameter
* All Query parameters
* Size of the request
* Body
* HTTP method
* SQL injection
* XSS injection

AWS also provides the managed rule groups which contain the rules to block the request patterns associated with the exploitation of vulnerabilities specific to Linux and Windows Operating Systems, PHP, SQL database, etc...

We have subscribed to the AWS Shield advanced, added the ALB under its protection and tested the below usecases. 

#### Rate-limit (rate-based rule type)
* We can block the requests based on the request count using the rate-limit rule
* I had set up the rate-limit (Maximum number of requests allowed in any 5 minutes period) as 100 and produced the web request flood through Apache benchmark
* The requests that exceeded the rate-limit have been blocked by WAF successfully

#### Country-wise block
* We can block the requests from any specific countries using regular rule type
* I have added the India and US countries as the black-listed countries and tried to access the site
* The requests have been blocked successfully

#### URI path
* We can block the requests based on the URI
* I had set up one of the HTML files in the URI path and tried to access the specific web page
* The request has been blocked successfully 

## Steps followed

* Created the internet-facing Application Load Balancer
* Created the self-signed SSL certificate and added the 443 listener rule to forward the requests to the target group
* Launched the EC2 private instances and registered under the target group
* Subscribed to the AWS Shield Advanced protection in the account AWS_165387667510
* Added the ALB to protected resources, created the Web ACL with rate-based (100 requests/5 minutes) rule, country-wise and URI path rule and tested the requests.
* We have connected with the AWS support team to produce some dummy malicious attacks on ALB to test the Layer 3 (Network layer) and Layer 4 (Transport layer) level mitigations. But seems, this simulation testing must be performed by an AWS Partner Network (APN) Partner that has been pre-approved by AWS to conduct DDoS simulation tests (AWS DDoS Test Partner). 
* Created the SNS topic and added it to the protected resource (CloudWatch alarms will be created automatically for DDoS detection and Rate-limit while adding the SNS topic)
* The Cloudwatch alarm has not triggered the notification as the region field is missing in the alarm's metric configuration. This has been fixed by updating the metric configuration with the region.
* We can add the Route 53 health-based detection rule in the Web ACL if the protected resource has a record

## Terraform module

I have created the terraform module for the below activities,

* To subscribes the Shield advanced tier 
* To provision the lambda function which adds/deletes the shield protection based on the resource tag
* To add a resource to Shield protection
* To create the Web ACL 
* To create the Web ACL rules for rate-limit, URI path and country based restrictions

Please find the terraform module link - https://github.optum.com/oaccoe/aws_shield

Terraform not yet released the feature to attach SNS topic to the protected resources in Shield. Hence, we will add it in the future.  

## Pricing of Shield Advanced

* Shield Advanced Cost - Nothing, as Healthcare Cloud has obtained an enterprise license that allows all AWS accounts to outfit their resources with AWS Advanced Shield at no cost to them. (No additional cost for WAF and Firewall manager.)
* Data Transfer Out Usage (Data transfer out to the internet)- $0.05/1GB (ELB, Elastic IP and Global accelerator), $0.025/1GB (CloudFront) and no additional cost for Route 53.

## Benefits

* Access to 24x7 DDoS Response Team (DRT) to get an assistance 
* Availability of forensic reports and historical reports for layer 3/4 attacks
* Cost reimbursement for DDoS charges 
