---
id: AWS-EC2-Image-Builder
author: PravinKumar S
tags: [POC]
---
## EC2 Image Builder

#### Introduction:
Amazon provides EC2 Image builder service which helps in simplifying the building, testing, and deployment of Virtual Machine and container images for use on AWS or on-premises. Image builder reduces the effort of keeping images up-to date, as we have the automated image builder pipeline which can be scheduled as per our requirement. Currently proof of concept on this feature is been tested and code has been developed for creating the Image builder pipeline for building Linux AMI's and to get the various components installed within the AMI.

#### Implemented AWS account:
Account: 082936434188

#### AWS services used:
1.Amazon EC2 Image builder.
2.S3 bucket for storing the playbook YAML file.

#### Requirement:
Supports:
Terraform ~> 0.12.24

#### Image builder pipeline components:

1. Image Builder basically creates a pipeline which builds the final AMI. And it has the feature to schedule when the pipeline needs to run and build images as planned.
2. Image recipes is created to specify the configuration parameters like, 
   * OS image type.
   * Source image.
   * Storage volume size, IOPS, Encryption, Delete the instance after Image is created and importantly specify the components or features which need to installed or upgraded when the image is built.
3. Components includes the various softwares, features which need to be installed and also includes Kernel updates, security updates etc. Component is then added as a part of recipe.
4. Infrastructure configuration primarily includes network related parameters like VPC, sub-net, security group informations. Also includes the IAM profile which need to attached to the EC2 instance during the build.
5. Distribution settings is the final component where we specify the region, account details, Output AMI name where the image need to created and shared, thereby end users can use the final built AMI.
 
#### Image builder work-flow:

Amazon owned AMI images (Linux currently) are identified for the build. Following it, image recipes are created with the components within it, which does the major activities which includes installing softwares, features, software updates and also includes Kernel updates, security updates etc.

Further, once these component installations are completed the EC2 instance used for building gets converted as AMI and will be placed in the specified region and account for the user access. Instances used for building will be terminated post the activity.

Note: During the image builder pipeline creation we set the VPC, sub-net, security group information where the image builder will be created. 

