---
id: AWS-EMR-Serverless-POC-Guide
title: AWS EMR Serverless POC Guide
sidebar_label: AWS EMR Serverless POC Guide
slug: /aws-emr-serverless-poc-guide
---
## AWS EMR Serverless POC Guide

> Author: ArunKumar R

> Last Reviewed Date: 02/01/2022

## Contents

- [Overview](#overview)
- [Purpose](#purpose)
- [Prerequisites](#prerequisites)
- [Architecture Diagram](#architecture-diagram)
- [Step by Step instructions](#step-by-step-instructions)
- [Conclusion](#conclusion)


## Overview

Amazon EMR Serverless is a new deployment option released during AWS Reinvent 2021 for Amazon EMR. EMR Serverless provides a serverless runtime environment that simplifies running analytics applications using the latest open source frameworks such as Apache Spark and Apache Hive. With EMR Serverless, you don’t have to configure, optimize, secure, or operate clusters to run applications with these frameworks.

### Benefits
* EMR Serverless helps you avoid over- or under-provisioning resources for your data processing jobs. 
* EMR Serverless automatically determines the resources required by the applications, acquires these resources to process your jobs, and relinquishes them when the jobs finish. 
* For use cases where applications require a response within seconds, such as interactive data analysis, you can pre-initialize required resources during application creation.
* With EMR Serverless, you'll continue to get the benefits of Amazon EMR such as open source compatibility, concurrency, and performance optimized runtime for popular frameworks.
* EMR Serverless is suitable for customers who want ease in operating applications using open source frameworks. 
* It offers easy provisioning, quick job startup, automatic capacity management, and simple cost controls.

## Purpose

This tutorial helps you get started using EMR Serverless by deploying a sample Spark workload. You'll create your application with default pre-initialized capacity, run the sample application with logs stored in your S3 bucket and view event logs in the Spark History Server. Note that, for simplicity, we have chosen default options in most parts of this tutorial. For examples of running Hive applications, see Running Hive jobs.

## Prerequisites
Before you launch an EMR Serverless application, make sure you complete the following tasks:

* EMR Serverless is currently in preview release. To access the preview of EMR Serverless, follow the sign-up steps at https://pages.awscloud.com/EMR-Serverless-Preview.html

* You must update the AWS CLI with the latest service model for EMR Serverless. Once you've received confirmation of access, use the following command to download the latest API model file and update the AWS CLI.

```
aws s3 cp s3://elasticmapreduce/emr-serverless-preview/artifacts/latest/dev/cli/service.json ./service.json

aws configure add-model --service-model file://service.json
```

To use EMR Serverless, you must choose the AWS Region where preview is available. This applies to any AWS services and resources that EMR Serverless will need to access as part of running your workloads. Preview is currently available in US East (N. Virginia) us-east-1, and you may want to configure the AWS CLI to send all your AWS requests to this specific region by default. You can do so with the following command.

```
aws configure set region us-east-1
```

Validate that the AWS CLI configuration and permissions to interact with EMR Serverless are correctly set up. You can do so by running the following command to see a list of your EMR Serverless applications in your current Region.

    aws emr-serverless list-applications


## Architecture Diagram
![AWS EMR Serverless Workflow](https://github.optum.com/raw/oaccoe/CCOE-Site/master/static/img/emr-serverless-workflow.png)

## Step by Step instructions

**Step 1:** Plan an EMR Serverless application

### Prepare output log storage for EMR Serverless

In this tutorial, you'll use an S3 bucket to store output files and logs from the sample Spark workload you'll run using an EMR Serverless application. To create a bucket, follow the instructions in Creating a bucket in the Amazon Simple Storage Service Console User Guide.

As noted in the prerequisites, the S3 bucket must be created in the same Region where EMR Serverless is available (us-east-1). Replace any further reference to DOC-EXAMPLE-BUCKET with the name of the newly created bucket.

### Set up a job execution role

Job runs in EMR Serverless use an execution role that provide granular permissions to specific AWS services and resources at runtime. In this tutorial, the data and scripts are hosted in a public S3 bucket, however, the output including logs will be stored in DOC-EXAMPLE-BUCKET.

To setup a job execution role, you will first create an execution role with a trust policy to allow EMR Serverless to use the new role. Next, you'll attach the required S3 access policy to that role. The following steps walk you through the process.

a. Create a file named emr-serverless-trust-policy.json that contains the trust policy to use for the IAM role. The file should contain the following policy.

```
{
    "Version": "2012-10-17",
    "Statement": [{
        "Sid": "EMRServerlessTrustPolicy",
        "Action": "sts:AssumeRole",
        "Effect": "Allow",
        "Principal": {
            "Service": "emr-serverless.amazonaws.com"
        }
    }]
}
```

b. Create an IAM role named sampleJobExecutionRole using the trust policy created in the previous step.

```
aws iam create-role \
    --role-name sampleJobExecutionRole \
    --assume-role-policy-document file://emr-serverless-trust-policy.json
```
Take note of the ARN in the output, as you will use the ARN of the new role during job submission, henceforth referred to as the <execution_role_arn>.

c. Create a file named emr-sample-access-policy.json that defines the IAM policy for your workload to get read access the script and data stored in public S3 buckets and read-write access to DOC-EXAMPLE-BUCKET. You must replace DOC-EXAMPLE-BUCKET in the policy below with the actual bucket name created in Step 1). 

```
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "ReadAccessForEMRSamples",
            "Effect": "Allow",
            "Action": [
                "s3:GetObject",
                "s3:ListBucket"
            ],
            "Resource": [
                "arn:aws:s3:::*.elasticmapreduce",
                "arn:aws:s3:::*.elasticmapreduce/*"
            ]
        },
        {
            "Sid": "FullAccessToOutputBucket",
            "Effect": "Allow",
            "Action": [
                "s3:PutObject",
                "s3:GetObject",
                "s3:ListBucket",
                "s3:DeleteObject"
            ],
            "Resource": [
                "arn:aws:s3:::DOC-EXAMPLE-BUCKET",
                "arn:aws:s3:::DOC-EXAMPLE-BUCKET/*"
            ]
        }
    ]
}
```

d. Create an IAM policy named sampleS3AccessPolicy using the policy file created in the previous step. Take note of the ARN in the output, as you will use the ARN of the new policy in the next step.
```
aws iam create-policy \
    --policy-name sampleS3AccessPolicy \
    --policy-document file://emr-sample-access-policy.json
```
Take note of the new policy's ARN in the output, as you will substitute it for <policy_arn> in the next step.

e. Attach the IAM policy sampleS3AccessPolicy to the job execution role sampleJobExecutionRole.
```
aws iam attach-role-policy \
    --role-name sampleJobExecutionRole \
    --policy-arn <policy_arn>
```

**Step 2:** Create an EMR Serverless application

Now you're ready create a new Spark application using EMR Serverless. To create an application, run the following command.

```
aws emr-serverless create-application \
    --release-label emr-6.5.0-preview \
    --type 'SPARK' \
    --name my-application
```
Take note of the application ID returned in the output, as you will use the ID to start the application and during job submission, henceforth referred to as the <application_id>.

Although EMR Serverless automatically pre-initializes a set of workers for you (with additional workers created on demand), you may choose a different set of pre-initialized workers by setting the initialCapacity parameter while creating the application. You may also choose to set a limit for the total maximum capacity that an application can use by setting the maximumCapacity parameter. To learn more about these options, see Configuring and managing pre-initialized capacity.

**Step 3:** Start your application

Before you can schedule a job using your application, you must start the application. This action will pre-initialize a set of workers. You must ensure the application has reached the CREATED state before starting it. To check the state of your application, run the following command, substituting <application_id> with the ID of your new application.
```
aws emr-serverless get-application \
    --application-id <application_id>
```
When application has reached the CREATED state, start your application using the following command.
```
aws emr-serverless start-application \
    --application-id <application_id>
```
Before moving to the next step, ensure your application has reached the STARTED state using the get-application API. 

**Step 4:** Schedule a job run to your EMR Serverless application

Now your Spark application is ready to run jobs. In this tutorial, we use a PySpark script to compute the number of occurrences of unique words across multiple text files. Both the script and the dataset are stored in a public, read-only S3 bucket. The output file and the log data from the Spark runtime will be pushed to /output and /logs directory in the S3 bucket you created in Step 1 (DOC-EXAMPLE-BUCKET).

In the command below, substitute <application_id> with your application ID. Substitute <execution_role_arn> with the execution role ARN you created in Step 1. Replace all DOC-EXAMPLE-BUCKET strings with the Amazon S3 bucket you created, adding /output and /logs to the path. This creates new folders in your bucket, where EMR Serverless can copy the output and log files of your application.

```
aws emr-serverless start-job-run \
    --application-id <application_id> \
    --execution-role-arn <execution_role_arn> \
    --job-driver '{
        "sparkSubmit": {
            "entryPoint": "s3://us-east-1.elasticmapreduce/emr-containers/samples/wordcount/scripts/wordcount.py",
            "entryPointArguments": ["s3://DOC-EXAMPLE-BUCKET/output"],
            "sparkSubmitParameters": "--conf spark.executor.cores=1 --conf spark.executor.memory=4g --conf spark.driver.cores=1 --conf spark.driver.memory=4g --conf spark.executor.instances=1"
        }
    }' \
    --configuration-overrides '{
        "monitoringConfiguration": {
           "s3MonitoringConfiguration": {
             "logUri": "s3://DOC-EXAMPLE-BUCKET/logs"
           }
        }
    }'
```
Note the job run ID returned in the output, as you will replace <job_run_id> with this ID in the following steps.


**Step 5:** Review your job run's output

The job run should typically take 3-5 minutes to complete. You can check for the state of the job using the following command.

```
aws emr-serverless get-job-run \
    --application-id <application_id> \
    --job-run-id <job_run_id>
```
With your log destination set to s3://DOC-EXAMPLE-BUCKET/logs, the logs for this specific job run can be found under s3://DOC-EXAMPLE-BUCKET/logs/applications/<application_id>/jobs/<job_run_id>.

Depending upon the type of application and log file, EMR Serverless will upload logs to your bucket at different cadences. For Spark applications, EMR Serverless will push event logs every 30 seconds to the sparklogs folder in the S3 log destination. The Spark runtime logs for the driver and executors (i.e., stderr and stdout log files) will upload upon completion of the job to folders named appropriately by the worker type, such as driver or executor.

The output of the PySpark job will be uploaded upon sucessful execution of the job to s3://DOC-EXAMPLE-BUCKET/output/.

**Step 6:** Stopping or Deleting the Application

When you’re done working with this tutorial, consider deleting the resources you created. This will help you avoid any unnecessary expenses. Note that in preview, there is no additional cost to using EMR Serverless. However, we still recommend following best practives by releasing resources that you don't intend to use again.
Delete your application

To delete an application, it must be in the STOPPED state. Use the following command to stop the application.
```
aws emr-serverless stop-application \
    --application-id <application_id>
```
Once the application is in the STOPPED state, use the following command to delete the application.
```
aws emr-serverless delete-application \
    --application-id <application_id>
```

### Logging:
When you submit job runs to your EMR Serverless application, you can enable logging. This section describes how to configure logging during job submission and how to launch the Spark history server locally using Docker to view logs on the Spark UI after your job has completed. 

**Detailed Guide:** https://docs.aws.amazon.com/emr/latest/EMR-Serverless-UserGuide/logging.html

### Limitations:

These are the limitations while EMR Serverless is in preview:

* You can have up to 10 running applications per account.
* You can have up to 100 active workers per application.
* A job can run up to three hours.


## Conclusion:

Adapting to a serverless architecture can be very efficient for certain use cases of your business. AWS EMR Serverless is still under preview and will be released soon. I hope this will take vast amounts of data processing on the cloud to another level.

Visit the [official documentation](https://docs.aws.amazon.com/emr/latest/EMR-Serverless-UserGuide/emr-serverless.html) to know more about the feature and experiment.


