---
id: Terraform-Module
title: Terraform Module
---
With this module, you can set up a SSO solution for static sites hosted on Amazon. For static websites, there are two ways to set up single sign-on.

1.  Cloudfront authentication at edge
2.  Cloudfront authentication at edge Using AWS Cognito

Module Repo : [OACCOE - Cloudfront authorization at edge](https://github.optum.com/oaccoe/cloudfront-authorization-at-edge.git)

### Referenced module
These modules are used to create an SSO setup for a static website example module

- Create S3 origin bucket - [OACCOE S3-origin](https://github.optum.com/oaccoe/aws_s3/tree/master/profiles/cf-origin)
- Create cloudfront distribution - [AWS CloudFront Terraform module](https://github.com/terraform-aws-modules/terraform-aws-cloudfront.git)
- Create log bucekt - [OACCOE-S3](https://github.optum.com/oaccoe/aws_s3.git)
- Create Alias DNS records - [cloudposse/route53-alias/aws](https://github.com/cloudposse/terraform-aws-route53-alias.git)
- Create lambda@edge function - [lambda@edge](https://github.com/terraform-aws-modules/terraform-aws-lambda.git)
- Create IAM Role - [IAM Permission](https://github.optum.com/oaccoe/aws_iam/tree/master/profiles/iam-policy)

### Cloudfront authentication at edge

- Make a clone of the repository, copy the "/examples/cloudfront_auth_edge" and set up the terraform backend.

-  Fill the config-key.json file

``` json
{
 "AUTH_REQUEST": {
 "client_id": "${CLIENT_ID_FROM_IDP}",
 "response_type": "code",
 "scope": "${authorize_scopes}",
 "redirect_uri": "https://${CLOUDFRONT_DIST_URL}/_callback"
 },
 "TOKEN_REQUEST": {
 "client_id": "${CLIENT_ID_FROM_IDP}",
 "redirect_uri": "https://${CLOUDFRONT_DIST_URL}/_callback",
 "grant_type": "authorization_code",
 "client_secret": "${CLIENT_SECRET_FROM_IDP}"
 },
 "DISTRIBUTION": "amazon-oai",
 "AUTHN": "PING",
 "DISCOVERY_DOCUMENT": "https://${IDP_DOMAIN_NAME}/.well-known/openid-configuration",
 "SESSION_DURATION": 30,
 "BASE_URL": "https://${IDP_DOMAIN_NAME}/",
 "CALLBACK_PATH": "/_callback",
 "AUTHZ": "PING"
 }
 
```

- Run the module and verify all arguments were passed correctly.
```
provider "aws" {
  region = var.aws_region
}

####Creating the lambda@edge function
module "lambda_function" {
  source = "terraform-aws-modules/lambda/aws"

  ## Setup the lambda@edge function
  lambda_at_edge = true
  function_name = var.name
  description   = var.description
  source_path = [
    {
      path = "${path.module}/src/js",
      commands = [
        "npm install",
        ":zip"
      ],
      patterns = [
        "!.*/.*\\.txt",    # Skip all txt files recursively
        "node_modules/.+", # Include all node_modules
      ],
    }
  ]
  runtime    = var.runtime
  handler    = var.handler

  ## Create SSM parameter to store the app client secret
  attach_policy = true
  policy = module.lambda-secret-manager-policy.arn
  tags = var.tags
}

resource "aws_secretsmanager_secret" "config_key" {
  name = var.Secret_manager_name
  tags = var.tags
}

resource "aws_secretsmanager_secret_version" "config_key" {
  secret_id     = aws_secretsmanager_secret.config_key.id
  secret_string = jsonencode({"config"=filebase64("${path.module}/config-key.json")})
}

#### After cloudfront has been destroyed, we need to wait at least 15 minutes before destroying lambda or else module will fail
### It is known issue from AWS https://github.com/hashicorp/terraform-provider-aws/issues/1721. So here we have set sleep time to wait 20 Mins
resource "time_sleep" "wait_30_seconds" {
  depends_on = [module.lambda_function]

  destroy_duration = "1200s"
}

resource "null_resource" "next" {
  depends_on = [time_sleep.wait_30_seconds]
}

### IAM Policy for lambda to fetch SSM parameter
data "aws_caller_identity" "main" {}
data "aws_region" "current_region" {}
locals {
  aws_account_id     = data.aws_caller_identity.main.account_id
  aws_account_region = data.aws_region.current_region.name
}

data "aws_iam_policy_document" "lambda-ssm-access" {
  statement {
    effect = "Allow"

    actions = [
      "secretsmanager:GetResourcePolicy",
      "secretsmanager:GetSecretValue",
      "secretsmanager:DescribeSecret",
      "secretsmanager:ListSecretVersionIds",
      "s3:GetBucketAcl",
      "s3:PutObject",
      "s3:GetObject",
      "s3:ListBucket",

    ]

    resources = [
      "${aws_secretsmanager_secret.config_key.arn}",
      ]
  }
}

module "lambda-secret-manager-policy" {
  source      = "git::https://github.optum.com/oaccoe/aws_iam.git//profiles/iam-policy?ref=v2.2.2"
  name        = var.name
  path        = "/"
  description = "this policy for lambda to get ssm parameter"
  document    = data.aws_iam_policy_document.lambda-ssm-access.json
  namespace   = "ssm-access"
}
```


### Cloudfront authentication at edge Using AWS Cognito
-   Clone the repository 
``` go
git clone https://github.optum.com/oaccoe/cloudfront-authorization-at-edge.git
```
-   Change directory to the example folder
``` bash
cd examples/cloudfront_auth_with_cognito
```

-   Set up the terraform backend 
-   Point to OACCOE repository url in module source path in main.tf (or) you can point the profile like below sample code

``` go
####Creating the lambda@edge function
module "lambda_function" {
  source = "terraform-aws-modules/lambda/aws"

  ## Setup the lambda@edge function
  lambda_at_edge = true
  function_name = var.name
  description   = var.description
  source_path = [
    "src/",
    {
      path = "${path.module}/src/",
      commands = [
        "npm install",
        ":zip"
      ],
      patterns = [
        "!.*/.*\\.txt",    # Skip all txt files recursively
        "node_modules/.+", # Include all node_modules
      ],
    }
  ]
  runtime    = var.runtime
  handler    = var.handler

  ## Create SSM parameter to store the app client secret
  attach_policy = true
  policy = module.lambda-ssm-managed-policy.arn

  depends_on                   = [module.cognito]
  tags = var.tags
}

module "cognito" {
  source = "../../profiles/cognito_OIDC"

  name       = var.name
  aws_region = var.aws_region

  ## Rendering the config.json with cognito user pool details
  template_file_render = true
  config_location      = "${path.module}/src/config.json"
  template_location    = "${path.module}/config_template.json"

  ## Setting UP the  AWS Cognito for for OIDC idp 
  ## Create OIDC identity provider in cognito
  provider_type    = var.provider_type
  provider_name    = var.provider_name
  client_id        = var.client_id
  client_secret    = var.client_secret
  oidc_issuer      = var.oidc_issuer
  authorize_scopes = var.authorize_scopes
  Identifiers      = null

  ## Create cognito user pool
  userpool_name = var.userpool_name

  ## Create cognito user pool client
  client_name                          = var.client_name
  generate_secret                      = var.generate_secret
  allowed_oauth_flows                  = var.allowed_oauth_flows
  callback_urls                        = var.callback_urls
  scopes                               = var.scopes #allowed_oauth_scopes
  allowed_oauth_flows_user_pool_client = var.allowed_oauth_flows_user_pool_client
  supported_identity_providers         = ["COGNITO", var.provider_name]
  explicit_auth_flows                  = var.explicit_auth_flows

  ## Create cognito user pool domain 
  user_pool_domain = var.user_pool_domain

  ## Create SSM parameter to store the app client secret
  ssm_client_secret_param_name = var.ssm_client_secret_param_name
  tags = var.tags
}

#### After cloudfront has been destroyed, we need to wait at least 15 minutes before destroying lambda or else module will fail
### It is known issue from AWS https://github.com/hashicorp/terraform-provider-aws/issues/1721. So here we have set sleep time to wait 20 Mins
resource "time_sleep" "wait_30_seconds" {
  depends_on = [module.lambda_function]

  destroy_duration = "1800s"
}

resource "null_resource" "next" {
  depends_on = [time_sleep.wait_30_seconds]
}
```
-   Run the terraform commands and verify all arguments were passed correctly
``` bash
terraform init
terraform plan 
terraform apply
```

:::note
Lambda@edge functions propagate to the edge location specified by us. Therefore, we should delete the cloudfront first and then attempt to destroy the lambda@function after 15 minutes. We have handled this situation in our module, but in worst case, destroying the resource will fail.
:::