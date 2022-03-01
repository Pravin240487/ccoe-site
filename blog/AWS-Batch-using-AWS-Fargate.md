---
title: AWS Batch using AWS Fargate
author: Jonathan Ng
tags: [POC]
---

## AWS Batch using AWS Fargate

---

#### Summary

At the end of 2020 it was announced that AWS Batch will now support AWS Fargate along with EC2 instances as a compute resource. This allows you to jump right in to running jobs on AWS Batch without having to worry about provisioning, maintaining, or scaling compute resources. It also helps save time as you do not need to wait for EC2 instances to spin up before running your jobs.

##### Using Fargate vs EC2 on AWS Batch

AWS Batch uses either AWS Fargate or EC2 instances as the basis for its compute resources. Each one has its own advantages and disadvantages:

* **Provisioning** One advantage of using Fargate over an EC2 instance is that you do not need to worry about managing/patching AMIs. You should still use EC2 instances if your jobs require specific configurations (architecture, GPU, processors)

* **Cost** The only cost associated with AWS Batch are the compute resources it uses, so it comes down to the differences between the price to run EC2 instances, Fargate, or the Spot variation of both.

* **Performance** Since you don't need to wait for instances to launch, using Fargate will start sooner when you want to scale-out your jobs. However, it is recommended to use EC2 instance for larger workloads because instances/container images are reused when running subsequent jobs.

* **Terraform Availability** At the time this was written (4/2021) Terraform does not support AWS Fargate when using the `aws_batch_compute_environment` resource and by extension the `aws_batch_job_definition` resource, but [it may be available in the next release](https://github.com/hashicorp/terraform-provider-aws/pull/16850). Using an EC2 instance with the `aws_batch_compute_environment` resource is fully supported.

---

#### Configuring a Compute Environment

Before you create your compute environment, it may be helpful to set up the required networking resources. All compute resources need to be able to communicate with the Amazon ECS service endpoint. This is done through a VPC endpoint or by giving your compute resource a public IP address. When you create your compute environment, it will ask you to provide a VPC ID, subnets on that VPC to launch the compute resources, and optionally any security groups to attach to the instance.

 Since using AWS Fargate as a compute resource is not currently supported in Terraform, the best way to initialize it is through the AWS web console. You can do this by navigating to AWS Batch in the console and select `Compute environments`, then create. For AWS Fargate, you must have `Managed` selected as the compute environment type and then you can select Fargate or Fargate Spot for the `provisioning model`. From here you can specify the maximum amount of vCPUs to use and set up the networking resources that were mentioned above.

#### Configuring Job Definitions

It is recommended that any creation of job definitions is done using the AWS web console when using AWS Fargate as a compute resource. This is because the current Terraform resource requires a parameter that is not supported for Fargate job definitions. It is possible to create a job definition for Fargate using the AWS CLI, but certain parameters are either not supported or have different behavior. See [this userguide](https://docs.aws.amazon.com/batch/latest/userguide/fargate.html) for details.

#### Configuring Job Queues

Creating a job queue for AWS Batch is pretty easy and straight forward. The only thing to keep in mind is that all compute environments listed must be of the same type. This means you can list compute environments for Fargate or Fargate_Spot, but you cannot mix EC2 and Fargate environments.
