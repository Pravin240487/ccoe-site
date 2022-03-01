---
id: navigating-an-eis-review
title: Navigating an EIS review
sidebar_label: Navigating an EIS review
---

# Navigating an EIS Review (aka EIS Endorsement)

> Point of Contact: Andersen, Wyatt

> Last Reviewed Date: 08/24/2021

## Overview

Guidance on initiating the EIS Review process and what information EIS will expect.

(See also Step 6. and Step 12. [here](https://cloud.optum.com/docs/intake/intake-overview).)

## Step by Step Process

### Step 1: Prerequisites

Before initiating an endorsement request have the following ready:

#### Clean Cloud Board Status

Self explanatory, all open issues in [Cloud Board](https://cloud.optum.com/cloudboard/dashboard) should be addressed prior to beginning your review. 

#### Cloud Cloud Native Status

* [AWS Trusted Advisor](https://console.aws.amazon.com/trustedadvisor/home?region=us-east-1#/dashboard)
* [AWS Gaurd Duty](https://console.aws.amazon.com/guardduty/home?region=us-east-1#)

#### Clean Static/Dynamic Scans

* Use [Sonar](https://sonar.optum.com/) for all applicable application code.
* Run a [WebInspect scan](https://scanadministrator/Scan/ScanRequest.aspx) against your application’s public URL (if applicable).
* Consider using TwistLock and Constrast (if applicable). 
* See additional security tools [here](https://cloud.optum.com/docs/security-guides/security-tools-checklist/).

#### Intake.md

An updated **[intake.md](https://cloud.optum.com/docs/intake/intake-template)**. 

Pay special attention to:

  * Section 2: Data Governance
  * Section 4: Architecture Summary (esp. the Logical Diagram)
   * Logical Diagram should show all the applications you have running and all the AWS services you are using as well as "what talks to what." ([Example](https://github.optum.com/cloud-idp/everything-as-code#section-3-architecture-summary))
  * Section 5: Network Summary (esp. the Network Diagram)
    * Network Digram should show your VPC(s), subnet(s), and general network topology. Note the ports and protocols involved for ingress and egress and connectivity between services. 
  * Section 6: Security Criteria (esp. ["EIS Security Intent Review" (the "55 questions" document)](https://vanguard.optum.com/docs/patterns/security/55-security-questions/))

### Step 2: Service Now Request

Start the Official Review Process by following below steps

1. Open a [Service Now](https://optum.service-now.com/itss2/) ticket. "Cloud Services" > "Security Cloud Endorsement." 

2. Set up a meeting with your **"Cloud Security Engineer"** EIS reviewer. They will want to see your intake.md.

3. Email your **"Application Security Architect"** EIS reviewer. They will want send you a link to complete your Application Security Assessment on [GovReady](https://eis-esa.optum.com/). See [Complete a GovReady Application Security Assessment](#Complete-a-GovReady-Application-Security-Assessment).

### Step 3. Complete a GovReady Application Security Assessment

[GovReady](https://eis-esa.optum.com/)

* Be prepared to answer questions on: 
  * What type (PHI, PII, Confidential) of data you work with.
  * Your application as defined by "layers": presentation, application, data, etc. 
  * Your authentication/authorization system.
  * Your logging system.
  * You data at rest / in transit encryption strategy.
* **Warning:** The GovReady system is _slow_ allow significant time to complete this assessment. 

### Step 4. Complete a Compliance, Privacy, & Legal (CPL) Product Assessment

_PHI/PII/PCI use cases only_

This review consists of filling out a form and then reviewing it with the CPL team. 

[Requirements Source](https://hub.uhg.com/sites/hub/Optum/Corporate-Functions/Pages/Product-Development.aspx)

* Distribution List - compliance-product@optum.com
* Example [COMPLIANCE, PRIVACY, & LEGAL (CPL) PRODUCT ASSESSMENT FORM](https://github.optum.com/OptumAnalyticsPlatform/assets/blob/master/Optum%20Analytics%20Platform%20Privacy%20and%20Compliance%20PAF.docx)
