---
id: creating-a-techhub-jenkins-instance
title: Creating a Techhub Jenkins Instance
sidebar_label: Creating a Techhub Jenkins Instance
---

### Creating a Techhub Jenkins Instance

> Point of Contact: Arunkumar R

> Last Reviewed Date: 11/02/2021

### 1. Overview
#### 1.1. Purpose

   Jenkins is an open-source server that is written entirely in Java. It lets you execute a series of actions to achieve the continuous integration process, that too in an automated fashion.
   
#### 1.2. Scope
  The scope of this documentation is to create the Techhub jenkins instance

### 2. Prerequisites

* Be a member of the **OpenShiftContainerPlatform_prod_users** group.
* Create a Secure group for Jenkins admins, ex: **oa_test_jenkins**.
* Create a Secure group for the Jenkins storage account (or reuse your Jenkins admins group).

### 3. Configuration steps
#### 3.1. Creation of Techhub Jenkins Instance

**3.1.1.** Login to TechHub Portal with the Url, https://tech.optum.com/login?redirect=%2Fproducts%2Fjenkins. Choose "Create Jenkins Master" and click "Start Now" option. 
![](https://github.optum.com/raw/oaccoe/CCOE-Site/master/static/img/Techhub-jenkins-creation-1.png)

**3.1.2.** Choose Instance Type as "Managed" and Click Next.
![](https://github.optum.com/raw/oaccoe/CCOE-Site/master/static/img/Techhub-jenkins-creation-2.png)

**3.1.3.** Choose the configurations as shown below.
![](https://github.optum.com/raw/oaccoe/CCOE-Site/master/static/img/Techhub-jenkins-creation-3.png)

**3.1.4.** Choose the AD group created for managing Jenkins.
![](https://github.optum.com/raw/oaccoe/CCOE-Site/master/static/img/Techhub-jenkins-creation-4.png)

**3.1.5.** Choose the AD group created for the Storage Account and Submit.
![](https://github.optum.com/raw/oaccoe/CCOE-Site/master/static/img/Techhub-jenkins-creation-5.png)

**3.1.6.** Below is the Jenkins creation status. 
![](https://github.optum.com/raw/oaccoe/CCOE-Site/master/static/img/Techhub-jenkins-creation-6.png)

**3.1.7.** Below is the logs of Jenkins Creation.

![](https://github.optum.com/raw/oaccoe/CCOE-Site/master/static/img/Techhub-jenkins-creation-7.png)

Request Details in the form of json:

`curl "https://tech.optum.com/api/proxy/api/infra/tools/jenkins/v2/create?hub_proxy=cicd" -X POST -H "Authorization: Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJhY2NvdW50VHlwZSI6InByaW1hcnkiLCJlbXBsb3llZUlEIjoiMDAxMzk2MzM0IiwiZW1haWwiOiJhcnVua3VtYXJAb3B0dW0uY29tIiwicHJlZmVycmVkX3VzZXJuYW1lIjoiYXJhamVuMTIiLCJpYXQiOjE1OTM1OTgzODEsImlzcyI6IkRldk9wcyBIdWIifQ.TOgEeJeyKYoarmVx4HdKFmm7uNXkRJNF5NL2mEplUE3s0KmR6i2JXvP0SD7qcLXQHXyxiDwbLKGXv5SKhRzo8g" -H "Content-Type: application/json" --data-binary "{\"cpuLimit\":2,\"datacenter\":\"ctc\",\"image\":\"docker.repo1.uhc.com/ci-cd-marketplace/jenkins-managed-standard:2.235.1-52\",\"isManaged\":true,\"memoryRequestLimit\":4,\"namespace\":\"oa-cloud-operations\",\"objectStorageBackup\":{\"accessKey\":\"\",\"adGroup\":\"oa_cloudops_jenkins_storage_account\",\"apiEndpoint\":\"https://s3api-core.uhc.com\",\"askId\":\"UHGWM110-022676\",\"backupRetentionDays\":30,\"bucketName\":\"oa-cloud-operations\",\"description\":\"managed jenkins backups\",\"secretKey\":\"\"},\"openShiftBilling\":{\"askId\":\"UHGWM110-022676\"},\"platform\":\"prod-origin\",\"storageSize\":140,\"userOrGroup\":\"oa_cloudops_jenkins\"}"`

**3.1.8.**

Access Jenkins portal using the url "https://jenkins-oa-cloud-operations.origin-ctc-core.optum.com"

![](https://github.optum.com/raw/oaccoe/CCOE-Site/master/static/img/Techhub-jenkins-creation-8.png)

#### 3.2. Accessing TechHub Dashboard and Openshift Console

**3.2.1.** Goto https://tech.optum.com/dashboard. Click Browse Projects and Select Openshift to view the Jenkins Instance created.

![](https://github.optum.com/raw/oaccoe/CCOE-Site/master/static/img/Techhub-jenkins-creation-9.png)

**3.2.2.** Below is the logs of Jenkins Creation.

![](https://github.optum.com/raw/oaccoe/CCOE-Site/master/static/img/Techhub-jenkins-creation-10.png)

**3.2.3.** Click the Jenkins Instance to view the Info details.

![](https://github.optum.com/raw/oaccoe/CCOE-Site/master/static/img/Techhub-jenkins-creation-11.png)

![](https://github.optum.com/raw/oaccoe/CCOE-Site/master/static/img/Techhub-jenkins-creation-12.png)

![](https://github.optum.com/raw/oaccoe/CCOE-Site/master/static/img/Techhub-jenkins-creation-13.png)

**3.2.4.** Click OpenShift Console to navigate to Openshift dashboard.

![](https://github.optum.com/raw/oaccoe/CCOE-Site/master/static/img/Techhub-jenkins-creation-14.png)

**3.2.5.** Login to Openshift console with MSID login credentials.

![](https://github.optum.com/raw/oaccoe/CCOE-Site/master/static/img/Techhub-jenkins-creation-15.png)

**3.2.6.** Here, the Jenkins instance details will be available. It is created using Openshift platform. Any customization can be done here in this portal.

![](https://github.optum.com/raw/oaccoe/CCOE-Site/master/static/img/Techhub-jenkins-creation-16.png)



