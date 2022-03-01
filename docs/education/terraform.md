---
id: terraform 
title: Terraform 101
sidebar_label: Terraform 101
---

# Terraform 101

## What & Why

“Infrastructure as Code (IaC)” is part of the “Everything as Code (EaC)” movement. In this model instead of running scripts to build and deploy code and infrastructure you "declare" the infrastructure you want and your infrastructure provider (AWS, Azure, etc.) builds it to spec.

Benefits of IaC:

* Version Control and Code Review your infrastructure
* Create reproducible environments
* Audit your infra without interrogating a live service

[Terraform](https://www.terraform.io/) is a HashiCorp tool for doing IaC:

“HashiCorp Terraform enables you to safely and predictably create, change, and improve infrastructure. It is an open source tool that codifies APIs into declarative configuration files that can be shared amongst team members, treated as code, edited, reviewed, and versioned.” - https://www.terraform.io/

Terraform is not "mandated" at Optum, but IaC is and Terraform has a lot community momentum behind it. It's what the [Health Care Cloud (HCC) team](https://github.optum.com/CommercialCloud-EAC) uses, what the [Cloud Center of Excellence (CCOE) team](https://github.optum.com/oaccoe) uses, and what most [Provider teams use](https://github.optum.com/search?l=HCL&q=terraform&type=Repositories).

## Getting Started

The [Terraform website and docs](https://www.terraform.io/) are great! They have [tutorials](https://learn.hashicorp.com/collections/terraform/aws-get-started) that will help get your feet wet.

If you use new [Disposable Cloud Environment (DCE)](https://cloud.optum.com/docs/dce/overview) it will come with a GitHub project and repo that has [terraform/main.tf](https://github.optum.com/CommercialCloud-Team/aws_dce_starter/blob/master/terraform/main.tf) file you can use to start writting Terraform right away. 

CCOE recommends using [tfswitch](https://tfswitch.warrensbox.com/) to manage what version of Terraform you're running. 

Example:

```
$ tfswitch
Use the arrow keys to navigate: ↓ ↑ → ← 
? Select Terraform version: 
  ▸ 0.12.28 *recent
    0.11.14 *recent
    0.12.0 *recent
    0.15.3
↓   0.15.2
```

## How to Write Terraform

### Terraform Syntax

[Terraform syntax](https://www.terraform.io/docs/configuration/syntax.html) is based on HashiCorp's "[HCL](https://github.com/hashicorp/hcl2)."

Terraform syntax allows for:

Block based creation of infrastructure assests, for example:

```
# Source: https://www.terraform.io/docs/providers/aws/r/s3_bucket.html
resource "aws_s3_bucket" "b" {
  bucket = "my-tf-test-bucket"
  acl    = "private"

  tags = {
    Name        = "My bucket"
    Environment = "Dev"
  }
}
```

Nested JSON configuration:

```
# Source: https://www.terraform.io/docs/providers/aws/r/s3_bucket.html
resource "aws_s3_bucket" "b" {
  bucket = "s3-website-test.hashicorp.com"
  acl    = "public-read"
  policy = "${file("policy.json")}"

  website {
    index_document = "index.html"
    error_document = "error.html"

    routing_rules = <<EOF
[{
    "Condition": {
        "KeyPrefixEquals": "docs/"
    },
    "Redirect": {
        "ReplaceKeyPrefixWith": "documents/"
    }
}]
EOF
  }
}
```

Light "[function](https://www.terraform.io/docs/configuration/functions.html)" utlities, for example:

```
# Source: https://www.terraform.io/docs/configuration/functions/replace.html
> replace("1 + 2 + 3", "+", "-")
1 - 2 - 3
```

Terraform also defines several first class objects, we'll discuss those below. 

> **NOTE:** You will want syntax highlighting in whatever development tool you're using for Terraform. Most IDEs have support for this. 

### Terraform Provider

A Terraform "[Provider](https://www.terraform.io/docs/providers/index.html)" is the translation layer between Terraform code and the API for the resources you're using Terraform to define. For example, the following defines an [AWS Provider](https://www.terraform.io/docs/providers/aws/index.html) and specifies that the credentials file that contains the authentication info for your account with that provider can be found at `/home/jenkins/.aws/credentials` and the specfic profile from that file to use is `saml`. 

> **Note**: If you don't specify a profile it will look for the `default` profile from your credentials file. 

```
provider "aws" {
  region                  = "us-east-1"
  shared_credentials_file = "/home/jenkins/.aws/credentials"
  profile                 = "saml"
}
```

Your Terraform code should always contain a provider block. 

### Terraform (Backend and Version)

The [Terraform](https://www.terraform.io/docs/configuration/terraform.html) block allows you to use custom settings when running [Terraform CLI](https://www.terraform.io/docs/commands/index.html) commands on code that includes that block. 

For example, the following tells Terraform to store it's state in an S3 bucket with the name `575066535343-terraform-state` and to throw an error if the currently executing version of terraform is less than version `0.12.0`.

```
terraform {
  backend "s3" {
    bucket  = "575066535343-terraform-state"
    region  = "us-east-1"
    profile = "saml"
  }
  required_version = ">= 0.12.0"
}

```

### Terraform Resources

Assuming you've set up your Provider block and your Terraform configuration block (if needed) the next element you'll need is a [Terraform Resource](https://www.terraform.io/docs/configuration/resources.html) Terraform provides a large number of Resources for each Provider. For example, [on the left side of this page is the list of resources available for the AWS Provider](https://www.terraform.io/docs/providers/aws/index.html).

Resources are infrastructure building blocks. They usually correspond one-to-one with "resources" as defined by your Provider's API. For example: 

The [AWS CLI command](https://docs.aws.amazon.com/cli/latest/reference/s3api/create-bucket.html) for creating a bucket:

`aws s3api create-bucket --bucket my-bucket --region us-east-1`

Is equivalent to the [Terraform resource for an AWS S3 bucket](https://www.terraform.io/docs/providers/aws/r/s3_bucket.html):

```
resource "aws_s3_bucket" "my-bucket" {
  bucket = "my-bucket"
  region = "us-east-1"
}
```

### Terraform Modules

A [Terraform Module](https://www.terraform.io/docs/configuration/modules.html) is a tool for creating one or more Terraform Resources in a custom and repeatable way. This can prevent mistakes by building in sane defaults and reduce code duplication and boilerplate by moving that to a Module and referencing the Module from your Terraform code. 

Think of a Module as a class and your use of it in your code as instantiating that class. 

[Terraform Variables](https://www.terraform.io/docs/configuration/variables.html) allow developers to pass data (strings) into Modules to customize the Resource(s) they create, as permitted by the Module. 

**Note:** Creating modules should be considered intermediate Terraform. Start by working with "raw" Resources, and remember there's nothing you can do with a Module that you can't do with Resources in terms of what will actually be deployed as infrastructure.

All Modules have three basic elements: 
* Resource definitions
* (Input) Variables
* Outputs

#### Resource Definitions

A module could have a single main.tf file defining the Resources it creates, but it usually has several organized by what service is configured there or what layer of infrastructure it represents. Within the Module, the Resource code looks like it would if we were using the Resource directly, for example: 

```
resource "aws_s3_bucket_policy" "attach_s3_ssl_policy" {
  bucket = aws_s3_bucket.s3_bucket.id
  policy = data.aws_iam_policy_document.bucket_enforce_ssl.json
}
```

That code (above) just uses the [aws_s3_bucket_policy resource](https://www.terraform.io/docs/providers/aws/r/s3_bucket_policy.html) to attach a policy to a bucket. However, many Resource attributes are set by `var.` Variables. For example, look at how a bucket name might get defined:

```
bucket = var.name
```

We'll cover Variables next.

**Note:** When should you create a Module? First off, Modules add cognitive overhead and are unlikely to be as well constructed and documented as the base Terraform Resources they define. If they are within your repo (internal modules) in a "monolith" approach they can be updated iteratively and can be a good way to organize your code, but then they aren't suited for reuse acrosss projects. If they are in seperate repos for reuse you now have multiple places to look at and make changes in. For that reason it's wise to resist the temptation to create external modules for everything until doing so meets one of the following criteria: **1.** You need to insure that a resource is created a specific way, that is _not_ the default for the base model. For example: if you want to ensure that _every S3 bucket_ defines and uses a logging bucket. **2.** You are reusing the same set of Resources the same way, multiple times, but with different configurations. In that case, using Modules can cut down on boiler plate and duplicated code. This second case is where Terraform "playbooks" and "profiles" come from. [Dojo](https://dojo.o360.cloud/) uses "playbook" to describe not only a module, but a pattern of architecture that provides an end to end capability. Profile is used to describe different "flavors" of the same playbook, for example an EMR playbook could have profiles for both transient and persistent EMR clusters.

#### (Input) Variables

[(Input) Variables](https://www.terraform.io/docs/configuration/variables.html) are Terraform Module paremeters. They are the strings you pass into a Module to customize it beyond the modules default settings. The Module can make none to many of its parameters required. 

The parameters for a Module are described in a `variables.tf` file. 

For example, our example module defines four [variables](https://github.optum.com/OptumAnalyticsPlatform/oadw_s3_module/blob/master/terraform_module/variables.tf) (`name`, `custom_policy`, `logging_bucket`, and `acl`). 

`name` is required, it has no default, and your Terraform build will throw an error if you don't provide it. 
`custom_policy` and `logging_bucket` are both entirely optional.
`acl` is optional, but defaulted to `private`.

Here's an example of "instantiating" a module with variables:

```
# main.tf
module "transient_emr" {
  source         = "./transient_emr"
  service_prefix = local.service_prefix
  s3_prefix      = local.s3_prefix
  aws_region     = data.aws_region.current.name
  aws_azs        = ["us-east-1a"]
  logging_bucket = data.aws_ssm_parameter.logging_bucket.value
  vpc_id         = data.aws_ssm_parameter.vpc_id.value
}
```

This code tells terraform to build a local Module, `"./transient_emr"` and provides the path to it. In that module we might find:

```
# transient_emr/s3.tf
module "emr_jar_bucket" {
  source = "git::https://github.optum.com/OptumAnalyticsPlatform/oadw_s3_module.git//terraform_module?ref=v1.1"

  name           = "575066535343-${var.s3_prefix}-jar-storage"
  logging_bucket = var.logging_bucket
}
```

You can see that we've passed the variables from `main.tf` to `transient_emr?s3.tf` to the `oadw_s3_module` available at the `source`.

In a simpler case (where we weren't nesting our Terraform code into local modules) we could have cut out the middle man and done the following in `main.tf`:

```
# main.tf
module "my_bucket" {
  source         = "git::https://github.optum.com/OptumAnalyticsPlatform/oadw_s3_module.git//terraform_module?ref=v1.1"
  name           = 'my-bucket'
  logging_bucket = 'my-logging-bucket'
}
```

#### Outputs

[Terraform Outputs](https://www.terraform.io/docs/configuration/outputs.html) are the public attributes of your Module. By default, a Resource will make all of its attributes available, but a Module will only make attributes available that are specficially defined as `outputs`, generally in the Module's `outputs.tf` file. 

The most common outputs for AWS Terraform modules are - `name` and `arn`.

```
output "name" {
  value = aws_s3_bucket.s3_bucket.id
}

output "arn" {
  value = aws_s3_bucket.s3_bucket.arn
}
```

Those can now be referenced from any file that instantiates the Module via the syntax: `module.<module_name>.<output>`.

## Structuring your projects

Terraform is very flexible in how you structure your projects. The following recommendations are have been consolidated from various teams and projects using Terraform at Optum.

### Repository Structure

Terraform should be organized to handle both account-level infrastructure and infrastructure within a logical Terraform environment (such as Dev vs QA) where multiple logical environments can sit within a single account. The 2 layers of infrastructure (account and environment) can either be handled in the same repository or different repositories. Note that using environments as a way to manage promotion of Lambdas and Step Functions is a fairly reliable way of managing being able to deploy and test Lambdas before migrating to higher environments. However, it is possible to manage step function and lambda versions in other ways.

  * Account-level resources will typically include S3 buckets, IAM Policies and Roles, AppStream services, gold pipelines for producing AMIs, or other resources that can reasonably be shared across any logical environments within the account.
  * Environment-level resources might contain Lambdas, Step Functions, etc., and these resources will depend on the account-level infrastructure.
  * Teams working within a single account should agree on the number and naming of logical environments to be shared by users and document them. As an example, [OPA has 6 main environments in its repository](https://github.optum.com/opa/OPA-EAC/tree/dev/terraform):
    * NonProd-Shared (Account-level infrastructure for NonProduction account)
    * Dev (logical environment within NonProd account). Depends on resources in NonProd-Shared
    * QA (logical environment within NonProd account). Depends on resources in NonProd-Shared
    * Prod-Shared (Account-level infrastructure for Production account)
    * Stage (logical environment within Prod account). Depends on resources in Prod-Shared
    * Prod (logical environment within Prod account). Depends on resources in Prod-Shared
    * In addition, "dev-jdoe" environments can be added to create copies of "Dev" that can be used as sandboxes for individual developers. These would also depend on resources in NonProd-Shared

The individual environments should be composed of Terraform modules either defined directly in the repo or referenced remotely from GitHub. This way the main.tf file for a given environment is mostly responsible for passing appropriate configuration variables.

#### Example:

```
terraform
|── environments
│   |── prod
│   │   ├── main.tf
│   │   ├── backend.tf
│   |── stage
│   │   ├── main.tf
│   │   ├── backend.tf
│   |── dev
│   │   ├── main.tf
│   │   ├── backend.tf
|── modules
│   |── compute
│   │   ├── README.md
│   │   ├── variables.tf
│   │   ├── main.tf
│   │   ├── outputs.tf
│   |── networking
│   │   ├── README.md
│   │   ├── variables.tf
│   │   ├── main.tf
│   │   ├── outputs.tf
```

(Of course, this only factors in Terraform. In the wild you will likely have other code to manage in this repo: scripts/, api/, docs/, a jenkinsfile, etc.)

#### Workspaces

Terraform has a concept called "[Workspaces](https://www.terraform.io/docs/cli/workspaces/index.html)" while these can be useful they are a more "advanced" concept than will be covered here and are not recommended for teams starting out in Terraform. 

## How to Run Terraform

### Terraform Commands

The [Terraform CLI](https://www.terraform.io/docs/commands/index.html) offers several commands, but there are really only five you need to know to start:

* [`terraform fmt`](#terraform-fmt)
* [`terraform init`](#terraform-init)
* [`terraform plan`](#terraform-plan)
* [`terraform apply`](#terraform-apply)
* [`terraform destroy`](#terraform-destroy)

### Local Development vs. Pipelines

You should be able to run all of these against your dev-jdoe environment from your local terminal, being able to do so against dev is premissible as well, with the caveat that **it is critical that all team members use a consistent version of terraform when updating a shared environment**. 

Production environments, meaning environments in a production AWS account (examples: stage, prod) **should only be managed with a CI/CD pipeline.** 

#### terraform fmt

[`terraform fmt`](https://www.terraform.io/docs/commands/fmt.html) enforces an opinionated style for your Terraform code. It's nice for keeping code readable with multiple developers writting it and it's often enforced in CI/CD pipelines. Before commiting Terraform code you'll want to run `terraform fmt`. While you can run it on individual files, the `-recursive` will run it on every `.tf` file in a directory, so you should generally run it at your Terraform root directory: `terraform fmt -recursive terraform/`.  

> **NOTE:** You should see if you can have your IDE run `fmt` on save!

#### terraform init

[`terraform init`](https://www.terraform.io/docs/commands/init.html) is the first "real" Terraform command you'll want to run after writing your code. It establishes a connection with your provider, downloads the remote Modules your code calls for, figures out where your state is going to be (basically everything specified in `backend.tf`). You'll want to run it from your Terraform root directory. 

> **Note:** If you haven't put a `provider` block in your Terraform code `init` will ask you to provide some info via the command line. It's better (less prone to error) to provide the info in code and avoid this step entirely. 
> **Note:** You can run into a "chicken and the egg problem" when you start with Terraform where you want an S3 bucket to put your Terraform state file, but you can't build that with Terraform without `init` have a bucket to put Terraform state files in! This is easily solved by creating the bucket that holds your Terraform state files outside of Terraformm and with a simple script that calls the AWS API directly. 

#### terraform plan

[`terraform plan`](https://www.terraform.io/docs/commands/plan.html) will document what your current Terraform code will attempt to create. It **does not touch your actual infrastructure** so it's always safe to run. While a successful `plan` does not mean that your actual build will succeed (since it doesn't actually talk to your provider), it will check for basic logical errors. Think of it like "compiling" your code - it's a good sign of it runs cleanly, but doesn't mean your code will do what you think it will.

#### terraform apply

[`terraform apply`](https://www.terraform.io/docs/commands/apply.html) is where the magic happens. `apply` **will attempt to change your actual cloud infrastructure** to reflect your current Terraform code. 

> **Note:** You may have to run `terraform apply` several times because of inconsistencies in how your provider works, versus how Terraform expects it to work. An example would be a resource taking longer to create that Terraform permits. Most of the time `apply` will work on the first run, if hasn't worked by the third, something else is almost certainly wrong.

> **Note:** I recommend running `plan` manually, evaluating the output, and then running `apply`. However, in that flow `apply` will create it's own `plan` and if the code changes between the two steps it's possible that what gets applied is not what you saw in `plan`. To prevent this you can save the output of `plan` and pass it directly to the `apply` step: `terraform apply path_to_plan`. This is probably more trouble than it's worth. 

Running `apply` updates your state file. Your state file always reflects what _terraform believes_ has been deployed into your environment. If Terraform reports errors during an `apply` your state will be updated _only with what was successfully deployed_. There are several ways a state file can get out of sync with what's actually in your deployed environment, but the number one cause is:

* **Manual Intervention:** If you delete or create something in your AWS environment without using Terraform - Terraform won't know about it. 

For this reason you should be **very careful** about making manual changes to the infrastructure Terraform manages. 

#### terraform destroy 

[`terraform destroy`](https://www.terraform.io/docs/commands/destroy.html) **will attempt to chage your actual infrastructure** by looking at your state file and attempting to destroy every resource it documents. 

> **Note**: `destroy` is the _least reliable_ of the Terraform commands covered here. You may have to run it twice and you may have to destroy resources manually. This is generally fine since you shouldn't be running `destroy` on an environment you care about anyway.

> **Note**: `destroy` does not delete your state file if you're saving that (for example) on S3. If you want that gone you'll have to delete it manually. 

## Additional Resources and Tools
