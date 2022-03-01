---
id: CyberArk-Jenkins
title: How to Integrate CyberArk with Jenkins
sidebar_label: Integrate CyberArk with Jenkins
slug: /cyberark-jenkins
---

## Fetching Secrets from CyberArk in Jenkins

> Author: Evan Machnic

> Last Reviewed Date: 02/24/2022

## Contents

* [Overview](#overview)
* [Purpose](#purpose)
* [Prerequisites](#prerequisites)
* [Step-by-step Instructions](#step-by-step-instructions)
* [Conclusion](#conclusion)

## Overview

CyberArk makes it easy to have non-user IDs with automatic password rotation. While there is a bit of setup, we can use these IDs with Jenkins.

## Purpose

CyberArk provides a way of securing accounts and automatically rotating passwords. Unfortunately, this means we must grab them dynamically as we cannot assume the password will be static. As we move to using privileged accounts that are secured by CyberArk, we need a way to use those accounts in Jenkins. Since Jenkins Open Source does not have an official CyberArk integration, we need to use a bit of Bash Fu to grab the password. The following steps show how to get started with a CyberArk-secured account and use it in Jenkins.

## Prerequisites

### SAW

Before we begin, you need to make sure you have access to CyberArk via a Secure Administrative Workbench (SAW). While you shouldn't need to use the SAW for this particular exercise, you will need it if you want to actually view what's in the Safe or add new secrets that aren't managed in Secure. For SAW access, follow the documentation at https://helpdesk.uhg.com/At_Your_Service/SW/Documents/SAW/Requesting%20Secure%20Administrative%20Workbench.pdf

### RSA Token

You'll also need an RSA token that you can use as a second factor. The documentation for that is at https://hub.uhg.com/sites/hub/Optum/Resources/Tech-Services/Pages/RSASecurIDTokens.aspx

### Venafi Certificate

Because Jenkins utilized Docker for it's runners, we can't use IP authentication for CyberArk; we need to use [certificate-based auth](https://psp.optum.com/docs/cyberark/ccpauth#2client-certificates-authentication). A cert that's issued from Venafi can be used for this. You'll need to generate one and download it; make sure to download in PEM format or use `openssl` to convert to PEM. Refer to the [guide](https://github.optum.com/pages/certsvcs/Certificate-Services/certsvcs/downloads/Venafi-User-Guide.pdf) for information on using Venafi.

After you've downloaded the certificate, create a Service Now request in the [CyberArk - Application Access Manager](https://optum.service-now.com/itss2/?id=sc_cat_item_guide&sys_id=f13513f5dbda7344cca51ffa68961975) service to whitelist the cert. **Do not include the cert or password in the request**

## Step-by-step Instructions

### 1. Request New CyberArk Safe

Once you have access via an [SAW](#saw) and you have an [RSA token](#rsa-token), you can create a new CyberArk Safe using the instructions provided at https://psp.optum.com/docs/cyberark/esmnewsafe.

* Make sure to select "CyberArk AAM - Programmatic Retrieval Safe".
* You can find the ASK ID from the [Application Inventory Data for the Enterprise](https://aide.optum.com/) page
* The solution type should be "Central Credential Provider"
* For the Zone, "Core" is for internal network and "DMZ" is external.

### 2. Create New Non-User ID in Secure

After you've received an email that the CyberArk Safe was created, you'll need to request a new non-user ID account in [Secure](https://secure.optum.com). Make sure and select "Windows" under "Request New Access"

![Request new Windows account](/static/img/cyberark-jenkins1.png)

The platform should automatically be "Windows" and "MS" so you should be able to leave that as-is.

![Platform](/static/img/cyberark-jenkins2.png)

On the next screen, make sure a select "Create New Non-User ID" and make sure to use one according to the requirements

![Create New Non-User ID](/static/img/cyberark-jenkins3.png)

![Create New Non-User ID - Requirements](/static/img/cyberark-jenkins4.png)

On the next screen, you can assign whatever groups you'll need for this ID

![Groups](/static/img/cyberark-jenkins5.png)

The "Account Security" section is really what relates to CyberArk. For the ASK ID, you can fill it in or look it up using the button.

![Account Security - ASK ID](/static/img/cyberark-jenkins6.png)

![Account Security - Available Safe(s)](/static/img/cyberark-jenkins7.png)

Under "Available Safe(s)" you'll select the Safe you previously created. Clicking "Create New Safe" will take you out to the CyberArk Safe creation process again.

![Account Security - Available Safe(s)](/static/img/cyberark-jenkins8.png)

For "Automated Password Management" you can choose the password rotation timeframe: 30, 60, or 90 days

![Account Security - Automated Password Management](/static/img/cyberark-jenkins9.png)

Click "Next" and on the following page, make sure and fill out the description with why you need the new ID then click "Submit"

![Request Confirmation](/static/img/cyberark-jenkins10.png)

After your request is approved, you'll receive an email with the details of the request. Now, we can move on to the next step and fetch the secret within Jenkins

![Request Approval](/static/img/cyberark-jenkins11.png)

### 3. Use Jenkins to Fetch CyberArk Secret

After you have a CyberArk Safe, created and whitelisted a Venafi certificate, and created a non-user ID, it's now time to actually fetch the secret in Jenkins. To do this, the certificate needs to be available in the Jenkins credential store so make sure you can access that.

While Jenkins does have the ability to store certificates, it doesn't support PEM files and so we'll store our PEM as a "Secret File" and the password for the certificate as "Secret Text"

![Add Credentials](/static/img/cyberark-jenkins12.png)

![Secret File](/static/img/cyberark-jenkins13.png)

![Secret Text](/static/img/cyberark-jenkins14.png)

Assuming you have set up a Jenkins project that's tied to a GitHub repository, you should be able to fetch the secret with the following Jenkinsfile code:

**Add certificate and password to the environment**

	environment {
	  CYBERARK_CERT = credentials('emachnic2_pem')
	  CYBERARK_CERT_PASS = credentials('emachnic2_pem_pass')
	}

**Use `curl` to fetch the secret from CyberArk**

(Don't actually print out the secret)

	script {
	  sh '''
		set +x
		. /etc/profile.d/jenkins.sh
		cyberarkUrl="https://esm-cert.uhc.com/AIMWebService/api/Accounts"
		appId="APPID-CORE-UHGWM110-022676-DEV"
		safe="AAM-CORE-UHGWM110-022676-DEV"
		object="Directory-AAM-CORE-IAC720-ms.ds.uhc.com-chunkybacon"
		password=\$(curl -k "$cyberarkUrl?AppID=$appId&Safe=$safe&Object=$object" -E "$CYBERARK_CERT:$CYBERARK_CERT_PASS" | jq -r '.Content')
		echo "The CyberArk secret is: $password"
	  '''
	}

## Conclusion

There is quite a bit of initial setup but after that, adding and retrieving secrets is fairly simple.

**A couple of notes:**

* Make sure to use the correct CyberArk URL, otherwise certificate auth won't work
* Objects in CyberArk should all have consistent naming conventions:

		TYPE: "Directory"
		PLATFORM: "AAM-CORE-IAC720"
		ADDRESS: "ms.ds.uhc.com"
		USERNAME: "chunkybacon"

* You can see the details of the secret from within the SAW:

![CyberArk Secret Details](/static/img/cyberark-jenkins15.png)

* In "AAM-CORE-IAC720", AAM refers to "Application Access Manager"; CORE refers to the zone; IAC720 refers to the rotation policy, 720 being 30 days.