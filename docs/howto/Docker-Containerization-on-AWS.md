---
id: Docker-Containerization-on-AWS
title: Docker Containerization on AWS
sidebar_label: Docker Containerization on AWS
---
## Docker Containerization on AWS

> Point of Contact: ArunKumar

> Last Reviewed Date: 11/02/2021

### 1. Overview
#### 1.1 Purpose

   The docker is a set of platform as a service products that use OS-level virtualization to deliver software in packages called containers. Containers are isolated from one another and bundle their own software, libraries and configuration files; they can communicate with each other through well-defined channels.
   
   The containers, which provide a standard way to package your application’s code, configurations and dependencies in a single object, virtualize at the operating system level, rather than the hardware stack. Users can run multiple containers at top of the OS kernel directly. Thus, they’re faster, more mobile, and use less memory than virtual machines, and can be crucial in contributing to the success of your cloud environment.
 
#### Monolithic Apps using Docker Containers

   If you think you can’t run your legacy monolithic app using Docker, think again. While microservices apps are best-suited for Docker, there’s no reason you can’t benefit from Docker with a monolithic app, too.

It’s a common misconception that Docker only makes sense if the app you want to host is composed of microservices, each of which can be deployed inside a separate container.

In fact, while it’s true that Docker is ideal for hosting distributed, microservices apps, monolithic deployments can benefit from Docker, too.

The docker can help you make the most of your legacy apps even if you don’t have time to refactor or rebuild them. In an ideal world, you’d have the time and resources to rewrite all of your monolithic apps so that they can be distributed as microservices.

But in the real world, you often have to deploy the apps you have, not the apps you wish you had. There’s no reason Docker can’t help you do that, even if your app is a monolith.

#### 1.2 Scope

   The management of containers at scale, otherwise known as container orchestration, can be a source of confusion. So here, we will compare and contrast two popular container orchestration services, Amazon ECS and Amazon EKS, so we can better determine which orchestration system is right for the products.

### 2. Pre-requisites

   We need to have the docker image to bring up the container.
  
### 3. Configuration steps

#### 3.1. Amazon ECS

   Amazon Elastic Container Service (Amazon ECS) is a highly scalable, high performance container orchestration service that supports Docker containers and allows you to easily run and scale containerized applications on AWS. ECS is built to perform at scale, offers high availability and security, and is deeply integrated with a variety of AWS services, including Elastic Load Balancing, Amazon VPC, AWS IAM, and more. Additionally, Amazon ECS features AWS Fargate, so you can deploy containers without provisioning servers, ultimately reducing management overhead.

##### 3.1.1. ECS (EC2 vs. Fargate)

   To run containers, we have two options. You can use ECS container instances, or you can use Fargate. Both options work together with ECS. The following figure demonstrates the difference.

![ECS_Fargate_architecture](https://github.optum.com/oaccoe/CCOE-Site/raw/master/static/img/ECS_Fargate_architecture.png)

##### 3.1.2. ECS container instance(Self-managed EC2)

   An ECS container instance is nothing more than an EC2 instance that runs the ECS Container Agent. The EC2 instance is owned and managed by you. The instance appears in the list of EC2 instances like any other EC2 instance. The ECS Container Agent regularly polls the ECS API if new containers need to be started or stopped. Usually, you run a cluster of container instances in an auto-scaling group. ECS is free of charge. You only pay for the EC2 instances. The downside is that you have to scale, monitor, patch, and secure the EC2 instances yourself. Especially the scaling is not easy because:

* There is no obvious metric to scale the cluster and no integration to scale when the task placement fails because of insufficient capacity.
* The auto-scaling group and ECS are not aware of each other, making task deployments very hard during cluster scale in or rolling updates via CloudFormation (Capacity Providers address this issue but are not ready for prime time yet).
* You have to scale down without killing running tasks, which is an even more significant challenge for long-lived tasks.

##### 3.1.3. ECS with Fargate

   AWS Fargate manages the task execution. No EC2 instances to manage anymore. You pay for running tasks. That’s it. As easy as it sounds.

Each task that runs in Fargate comes with a dedicated Elastic Network Interface (ENI) with a private IP address. All containers of the same task can communicate with each other via localhost. Inbound and outbound task communication goes through the ENI. A public IP address can be enabled as well.

![ECS_Fargate_Comparison](https://github.optum.com/oaccoe/CCOE-Site/raw/master/static/img/ECS_Fargate_Comparison.png)

Overall, Scaling container EC2 instances is a challenge. Fargate is much easier to operate but little expensive. 

There can be arguments made in favor of ECS over EKS in that it is simpler to use, provides heightened security due to its  integration with IAM, and is more cost-effective. But before we delve into this further, let’s briefly review Amazon EKS.

#### 3.2. Amazon EKS

   Amazon Elastic Container Service for Kubernetes (Amazon EKS) makes it easy to deploy, manage, and scale containerized applications using Kubernetes on AWS. Since this service leverages the open-source tool Kubernetes, all applications managed by Amazon EKS are fully compatible with applications managed by any standard Kubernetes environment. In that sense, it can be argued that Amazon EKS is more versatile than Amazon ECS.


#### 3.3. Amazon ECS vs. EKS: Compare and Contrast

Below are some of the core differences between the ECS and EKS,

* **Pricing**

One primary difference between ECS and EKS is the pricing model. With ECS, there is no additional charge for EC2 (elastic cloud compute) launch types. Instead, users pay for AWS resources you create to store and run applications. You only pay for  what you use and there are no additional pricing concerns.

EKS’ pricing model includes the same conditions as ECS, but there are additional costs. Users pay $0.20/hour for each Amazon EKS cluster. This isn’t as bad as it sounds though, as users can take advantage of a single cluster to run multiple applications by taking advantage of Kubernetes namespaces and IAM security.

* **Security**

There can be arguments made in favor of both Amazon ECS and EKS with regards to security. Amazon ECS is deeply integrated with IAM, enabling customers to assign granular access permissions for each container and using IAM to restrict access to each service and delegate the resources that a container can access. EKS, conversely, does not have this integration.

However, an argument for EKS is that it can support a much higher number of running pods (Containers) per EC2 worker than ECS due to the way it uses ENIs. And although IAM Roles cannot be applied natively to pods in EKS, there are add ons that allow this functionality, like KIAM.

* **Compatibility**

Since EKS is a Kubernetes-as-a-service offering for AWS, it can be run on any infrastructure, meaning that it’s much easier to run on-premises or with a different service provider. This isn’t the case for ECS, though, as it’s offered exclusively for AWS.

* **The Bigger Picture**

Since Amazon ECS currently offers more in-depth AWS integration than Amazon EKS, it may be considered the advisable choice if you’re looking to work solely in the AWS cloud. However, if you’re looking to run container deployments across multiple infrastructure providers and need additional flexibility provided by Kubernetes, Amazon EKS offers more versatility.

### 4. Benefits of docker cotnainers

* **Portability** - Docker makes it easy to move your app from one host to another by migrating the container image. That portability applies whether your app is monolithic or distributed.
* **Scalability** - Docker allows your app to scale up or down easily in response to fluctuating demand by spinning containers up or down.
* **Bare-metal access** - With Docker containers, your app can access bare-metal hardware. That’s a clear advantage over virtualization platforms that require hypervisors.
* **Easy distribution** - By packaging your app as a Docker container, you make it easy to distribute through an image repository. Anyone to whom you give access can pull the container image and run it. That beats having to install it manually via an installation process that could vary depending on which environment your users have.
* **Environment consistency** - Docker containers provide a consistent environment that you can use for development, testing, staging and deployment of your app. Environment consistency can help you build a continuous delivery pipeline.


