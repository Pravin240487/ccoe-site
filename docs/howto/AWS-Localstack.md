---
id: AWS-Localstack
title: AWS Localstack
sidebar_label: AWS Localstack
slug: /AWS Localstack
---
## AWS LocalStack to test resources locally

> Author: PravinKumar S

> Last Reviewed Date: 07/26/2021

## Contents

- [Overview](#overview)
- [What is LocalStack](#what-is-localstack)
- [Docker Container to run Localstack](#docker-container-to-run-localstack)
- [Docker compose to setup container with Localstack](#docker-compose-to-setup-container-with-localstack)
- [Testing basic AWS services](#testing-basic-aws-services)
- [Setup AWSCLI for LocalStack](#setup-awscli-for-localstack)
- [List of services in free version of LocalStack](#list-of-services-in-free-version-of-localstack)
- [Significance of LocalStack](#significance-of-localstack)
- [Limitations with LocalStack](#limitations-with-localstack)
- [Conclusion](#conclusion)


### Overview

Sandbox / Development environments are currently used with actual cloud account for testing and development purposes. Cloud learners or beginners need to request for cloud account to do their testings. Any expensive resources created and missed to get destroyed will lead to additional cost to the AWS account. This documentation will explore LocalStack and identify how much LocalStack can remediate these issues. 

### What is LocalStack
LocalStack is a fully functional AWS cloud stack that helps simulating cloud applications simple by having everything running in your local environment. It provides local testing environment for applications utilising AWS managed services. LocalStack can be installed in your local machine, however it is idle to setup the official localstack image from Docker hub inside a Docker container as it may not support every operating system.

![](https://github.optum.com/raw/oaccoe/CCOE-Site/master/static/img/localstack.png)

### Docker Container to run Localstack  
Docker container image is a lightweight, standalone, executable package of software that includes everything needed to run an application code, runtime, system tools, system libraries and settings. Docker container images become containers when they run on Docker Engine. Docker Desktop can be installed from the AppStore to local machine and signup with DockerHub to get the "localstack\localstack" image.

Docker hub login: https://hub.docker.com/  
Localstack official github: https://github.com/localstack/localstack   
Fully functional local AWS cloud stack: https://hub.docker.com/r/localstack/localstack

### Docker compose to setup container with Localstack
Docker Compose is a Docker tool used to define and run multi-container applications. Docker compose use YAML file to configure application services and create all the services from that configuration. We use Docker compose to download the localstack image from the Docker hub we sign up previously and will start running the localstack container with all the required AWS services. Docker compose YAML file below will enable services likes S3,LAMBDA,API etc. Below script can be saved as docker-compose.yml and can be used to download and start the container.

``` 
version: "2.1"
  
services:
  localstack:
    container_name: "${LOCALSTACK_DOCKER_NAME-localstack}"
    image: localstack/localstack
    network_mode: bridge
    ports:
      - "127.0.0.1:4566:4566"
      - "127.0.0.1:4571:4571"
      - "127.0.0.1:${PORT_WEB_UI-8080}:${PORT_WEB_UI-8080}"
    environment:
      - SERVICES=s3,ec2,apigateway,lambda,iam,sns,sqs,ses,dynamodb
      - DEBUG=1
      - DATA_DIR=/tmp/localstack/data
      - PORT_WEB_UI=${PORT_WEB_UI- }
      - LAMBDA_EXECUTOR=${LAMBDA_EXECUTOR- }
      - LOCALSTACK_API_KEY=${LOCALSTACK_API_KEY- }
      - DOCKER_HOST=unix:///var/run/docker.sock
      - HOST_TMP_FOLDER=${TMPDIR}
    volumes:
      - "${TMPDIR:-/tmp/localstack}:/tmp/localstack"
      - "/var/run/docker.sock:/var/run/docker.sock"

```

Mac users use the command to start the container:  $ env TMPDIR=/private$TMPDIR docker-compose up

![](https://github.optum.com/raw/oaccoe/CCOE-Site/master/static/img/start_dockercontainer.png)



### Testing basic AWS services
Docker compose will start the container and from our local terminal just similar to using AWSCLI, we can start connecting to our AWS services within the LocalStack. Below are few of the services and commands tested,

### S3 EXAMPLES

Create S3 bucket : 
```
aws s3api create-bucket --bucket bucket-name --endpoint-url=http://localhost:4566
```
Copy files from local to S3 bucket: 
```
aws s3 cp local-file.txt s3://test-bucket/docker.yml --endpoint-url=http://localhost:4566
```
Delete files from S3 bucket: 
```
aws s3 rb s3://bucket-name --force --endpoint-url=http://localhost:4566
```
### LAMBDA EXAMPLES

Create Lambda function: 
```
     awslocal lambda create-function \
     --function-name my-function \
     --runtime python \
     --zip-file fileb://lambda.zip \
     --handler my-function.handler \
     --role test-role
```

### Setup AWSCLI for LocalStack
Localstack can be connected using the endpoint url, however we can customize it by replacing it with alias so that running AWSCLI commands becomes simpler.

You can install the awslocal command via pip:
```
pip install awscli-local
```

Once after the above install is complete we can start using the AWSCLI without specifying the --endpoint-url=http://localhost:4566 and can be used as below,

Upload file in S3:
```
awslocal s3 cp local-file s3://my-bucket
```
### List of services in free version of LocalStack:

ACM   
API Gateway  
CloudFormation  
CloudWatch  
CloudWatch Logs  
DynamoDB  
DynamoDB Streams  
EC2  
Elasticsearch Service  
EventBridge (CloudWatch Events)  
Firehose  
IAM  
Kinesis  
KMS  
Lambda  
Redshift  
Route53  
S3  
SecretsManager  
SES  
SNS  
SQS  
SSM  
StepFunctions  
STS  

Note: However all the advanced features in most of the services are available only in Pro version. Example: S3 BUCKET deny policy is included only in Pro version. 

### Significance of LocalStack

1. Isolated processes: LocalStack services live in isolation as a separate process, which makes it closely resemble the real cloud environment.
2. Cost reduction: Resources can be created locally for testings, thereby avoiding unnecessary resource creation in cloud.
3. LocalStack can be built in a common server, so that set of team members can work collaboratively creating common resources and test.
4. LocalStack provides free version with the above listed AWS services with limited features.
5. Depending on the individual users usage of services and features, LocalStack can be considered at an intial phase rather having accounts created with DCE(Disposable Cloud Environment).

### Limitations with LocalStack
1. Not all resources can be created and tested with LocalStack similar to a real account with all the features enabled.
2. Testing terraform scripts from COE or other official repositories requires code change to skip the provider information and other references to repositories to get the code tested successfully.
3. Free version of LocalStack does not support all the advanced features and using the terraform scripts to build resource may fail due to lack of feature and unable to satisfy the launchpad policies. (Example: S3 BUCKET deny policy can not be included in Free version.) Pricing - https://localstack.cloud/pricing/
4. Container owner has full access to the resources and hence we are not mocking it exactly similar to our sandbox/development account with restricted permissions.

### Conclusion    
LocalStack is currently not supporting all the features and mostly into development phase. However, it can help teams across the organization to get introduced to cloud environment and get hands on with different resources offline. This helps in saving considerable amount of cost spent on different teams during initial phase and avoid any unnecessary resources getting created in the actual cloud environment which adds to the monthly budget.
