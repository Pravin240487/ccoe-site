---
id: secure-group-creation
title: Secure Group Creation
sidebar_label: Secure Group Creation
---


## Secure Group Creation

> Point of Contact: Macharla, Sarojani

> Last Reviewed Date: 11/02/2021

### Overview

Secure global group is an active directory which will grants the permissions(IAM role with same group name permissions are mapped to this group) to the members of the group.

### Step by step configuration

#### Step 1:

Go to [Secure](https://secure.uhc.com/) > Access Support > Self-service Group Creation ([link](https://secure.uhc.com/GroupMaintenance/CreateWindowsGroup))

![](https://github.optum.com/raw/oaccoe/CCOE-Site/master/static/img/self-service-group-creation.png)


#### Step 2: 

Fill out the form by selecting the below details at https://secure.uhc.com/GroupMaintenance/CreateWindowsGroup.

Platform: "Windows"

Group Type: "Global"

Domain: "MS"

How is this group going to be used? "General Purpose / Non-server"

Group Name: For Groups Associated with IAM Roles ** Group Name must be identical to your IAM Role in AWS** and follow the pattern: `AWS_<AWS Account ID>_<Name>`, example: `AWS_894103836036_COSTEXPLORER_RO`.

Access type: "Non privileged" if meant for humans and "Privileged" if meant for machines (example: a Service Account).

Description: Explanation of what the Group is for and who should use it. 

Status: "Active"

Time Based Access Enforced: Use this if you want members of the group to have to re-add it periodically. 

Owner: Will be you.

Approvers: Add at least two people with the authority to approve member's requests to join the Group. 

Business Justification: Explanation of why you need to create this group for the Secure team.

And click on Submit button!!

![](https://github.optum.com/raw/oaccoe/CCOE-Site/master/static/img/self-service-group-creation-form.png)



