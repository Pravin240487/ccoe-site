---
id: AWS-Lambda-Container-Image-Support
title: AWS Lambda Container Image Support
sidebar_label: AWS Lambda Container Image Support
---
## AWS Lambda Container image Support 

> Point of Contact: ArunKumar

> Last Reviewed Date: 11/02/2021

### 1. Overview
#### 1.1. Purpose 

   Container image support for AWS Lambda was announced during AWS re:Invent 2020. This is a major new addition to the AWS functions-as-a-service offering. Lambda provides many benefits to developers in managing scaling, high availability and fault tolerance, and also enabling a pay-per-value model. By supporting container packaging for functions, Lambda is now an option for a broader audience of developers. 

##### Why did AWS add support for container packaging?

   Before this change, the Lambda deployment package was a zip file. The zip file contains the code and any libraries and dependencies. You could upload this file manually or use automation tools like AWS Serverless Application Model (AWS SAM), AWS CDK, or Serverless Framework. 

However, many customers have existing investments in container-based deployment tools and workflows. These include Docker in addition to CI/CD, security, and governance tools. With this change, developers can benefit from a uniform development and deployment process.

##### Container Images in AWS Lambda vs. AWS Fargate

Lambda Container image support further blurs the lines between Lambda and Fargate. It’s important to understand the remaining differences to decide which service to use in a given scenario:

* **Cost structure** Lambda is charged per execution, while Fargate has a fixed cost per vCPU per hour regardless of the actual workload. Depending on requests per second served by a single CPU, one model can be much more frugal than the other.

* **Scale to zero** Consequently, an idle Lambda function costs nothing while Fargate still incurs fixed minimal running costs. Therefore, breaking an application down to many small specialized Lambda functions is much more practical and common than micro Fargate instances.

* **Burst workloads** Lambda scales on a per-request basis and can go from zero to a thousand instances in seconds. It’s a great fit for applications with bursty workloads that need to switch from idle to full capacity and back.

* **Performance** Fargate runs on more dedicated resources, so overall performance will likely be better than on Lambda. For time-sensitive and critical APIs, Fargate may offer a fast and consistent experience superior to Lambda, especially on high percentiles.

* **Integration with AWS services** Lambda comes with native integration with 100+ AWS services. It’s straightforward to trigger a function for incoming SQS messages or new files in an S3 bucket, which requires more wiring for Fargate tasks.

* **Resource limits** Lambda executions are limited to 15 minutes and may only consume up to 10 GB of RAM. Fargate may be the only option for long-running resource-demanding jobs.

Overall, Lambda shines for unpredictable or inconsistent workloads and applications easily expressed as isolated functions triggered by events in other AWS services.

#### 1.2 Scope

The scope of this documentation is that to build a container image based on python and deploy it into the AWS Lambda.

### 2. pre-requisites

AWS provides the following resources to help us build a container image for our Python function.

* AWS base images for Lambda

  These base images are preloaded with a language runtime and other components that are required to run the image on Lambda. AWS provides a Dockerfile for each of the base images to help with building your container image.

* Open-source runtime interface clients
 
  If you use a community or private enterprise base image, add a runtime interface client to the base image to make it compatible with Lambda.

#### AWS base images for Python

AWS provides the following base images for Python

* **Docker Hub repository:** amazon/aws-lambda-python

* **Amazon ECR repository:** gallery.ecr.aws/lambda/python

### 3. Configuration steps
#### 3.1. Build and upload a docker image with the python:3.8 base image into Amazon ECR Repository

When you build a container image for Python using an AWS base image, you only need to copy the python app to the container and install any dependencies.

**3.1.1.** On your local machine, create a project directory for your new function.

In your project directory, add a file named app.py containing your function code. The following example shows a simple Python handler.

```
import sys
def handler(event, context):
    return 'Hello from AWS Lambda using Python' + sys.version + '!'
```
**3.1.2.** Use a text editor to create a Dockerfile in your project directory. The following example shows the Dockerfile for the handler that you created in the previous step.

```
FROM public.ecr.aws/lambda/python:3.8

COPY app.py   ./
CMD ["app.handler"]
```

**3.1.3.** Build your Docker image with the docker build command. Enter a name for the image. The following example names the image hello-world.
```
docker build -t hello-world .   
```

**3.1.4.** Authenticate the Docker CLI to your Amazon ECR registry.
```
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin 123456789012.dkr.ecr.us-east-1.amazonaws.com   
```
**3.1.5.** Tag your image to match your repository name, and deploy the image to Amazon ECR using the docker push command.
```
docker tag  hello-world:latest 123456789012.dkr.ecr.us-east-1.amazonaws.com/hello-world:latest
docker push 123456789012.dkr.ecr.us-east-1.amazonaws.com/hello-world:latest        
```

#### 3.2. Deploying ECR Container image in AWS Lambda

Once the image is pushed to the ECR, you can use it in a new Lambda function. 

**3.1.1.** In the Lambda console, choose Create function, and then select the new container image in the Basic information panel. Choose Create function to finish the process.

![](https://github.optum.com/raw/oaccoe/CCOE-Site/master/static/img/Lambda_Container_Creation.png)

**3.2.2.** In the next page, a notification appears when the function is successfully created with the container image. You can test this function in the same way as any regular Lambda function. After choosing Test, you see the random test data returned by the function code:

![](https://github.optum.com/raw/oaccoe/CCOE-Site/master/static/img/Lambda_Container_Invocation.png)

### 4. Terraform module for AWS Lambda Container Support

We also have a Terraform example to provision a Lambda function using Docker container Image.

[AWS Lambda Container](https://github.optum.com/oaccoe/aws_lambda_example/tree/master/examples/lambda-container)


### 5. Benefits of using container packaging for functions

   Lambda treats container-based functions as immutable entities. When invoked, functions deployed as container images are run as-is. This means that the deployment package is immutable across your different environments, including desktop, the CI/CD process, and the Lambda execution environment.

   For developers with larger workloads, a container-based deployment package can now be up to 10 GB in size. This unlocks many new workload possibilities, especially for data-heavy or-dependency-heavy applications. For machine learning or data analytics, this allows developers to take advantage of the benefits of serverless compute. If you use PyTorch, NumPy and similar libraries, the previous 250 MB deployment package limit prevented many workloads from using Lambda.

   This new approach also offers increased portability across different AWS compute options. You choose a preferred based image for your code and it’s simpler to achieve portability between services like AWS Fargate or Amazon EC2.

   Support for container images in AWS Lambda brings the power and usability of industry-standard packaging to serverless functions. It becomes easy to reuse application components packaged with the ubiquitous deployment format.


