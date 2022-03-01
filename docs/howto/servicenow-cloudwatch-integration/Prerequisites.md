---
id: Prerequisites
title: Prerequisites
sidebar_label: Prerequisites
---

## Create Integration Access

```Step- 1 :```   Go to https://optum.service-now.com/itss2/

```Step- 2 :```   click on ***Request Something***

![arch](https://github.optum.com/raw/oaccoe/CCOE-Site/master/static/img/servicenow-integration/request-something.JPG)

```Step- 3 :```   Search *** ServiceNow Integration***

![arch](https://github.optum.com/raw/oaccoe/CCOE-Site/master/static/img/servicenow-integration/search-servicenow.JPG)

```Step- 4 :```   Select ***Create New Integration*** and click ***Next***

![arch](https://github.optum.com/raw/oaccoe/CCOE-Site/master/static/img/servicenow-integration/Create-new-integration.JPG)

```Step- 5 :```   Provide ***Alternate Contact***

```Step- 6 :```   In ***Request Details Sections***, 

***Select the Service that will be integrating with ServiceNow***
provide ASK ID

![arch](https://github.optum.com/raw/oaccoe/CCOE-Site/master/static/img/servicenow-integration/ASKID.JPG)

***Provide an integration owner/contact***
Provide Integration owner Email ID 

***Describe what kinds of transactions your integration will be performing and for what purpose***
Provide the description

***Identify the expected transactions per day***
Provide the maximum number of expected service tickets will be create 

![arch](https://github.optum.com/raw/oaccoe/CCOE-Site/master/static/img/servicenow-integration/max-incident.JPG)

***Select the ServiceNow product(s) this integration will access***. Choose ***Incident*** in drop down box.
Provide the type of issue

![arch](https://github.optum.com/raw/oaccoe/CCOE-Site/master/static/img/servicenow-integration/issue-type.png)

***Select the assignment group that will be responsible for supporting this integration***
Select the group to which the incident should be assigned 

![arch](https://github.optum.com/raw/oaccoe/CCOE-Site/master/static/img/servicenow-integration/assign-group.png)

***Could an issue with the integration cause P1/P2 impact to a Critical Business Application (CBA)?***
Choose "NO"

![arch](https://github.optum.com/raw/oaccoe/CCOE-Site/master/static/img/servicenow-integration/p1-p2.JPG)

Finally Acknowledge the t&c and provide the ***Requestor Summary*** and click ***Next***

![arch](https://github.optum.com/raw/oaccoe/CCOE-Site/master/static/img/servicenow-integration/ack.JPG)

```Step- 7 :```   Click ***Order now**

![arch](https://github.optum.com/raw/oaccoe/CCOE-Site/master/static/img/servicenow-integration/order.png)

In response to the service now ticket to create integration account access, you will receive an email with user details and instructions to retrieve the password

Below is sample E-Mail content
![arch](https://github.optum.com/raw/oaccoe/CCOE-Site/master/static/img/servicenow-integration/email.JPG)

## Store ServiceNow integration credentials in AWS Secrets Manager
```Step.1```    Open the Secrets Manager console 

```Step.2```    Choose Store a new secret

```Step.3```    On the Store a new secret page, do the following:

```Step.3.1```  For Secret type  Choose Other type of secret, and then in Key/value pairs

![arch](https://github.optum.com/raw/oaccoe/CCOE-Site/master/static/img/servicenow-integration/select-secret.JPG)

```Step.3.2```
In Key/value, enter the secret you want to store in pairs.

![arch](https://github.optum.com/raw/oaccoe/CCOE-Site/master/static/img/servicenow-integration/username-password.JPG)

