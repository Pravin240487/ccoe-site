---
title: AWS Step Functions
author: Wyatt Andersen
tags: [PEAT]
---

## AWS Step Functions (2021 PEAT)

---

This blog post was originally created for the July 2021 PEAT training days.

Presenters: Wyatt and Arun from the AWS Center of Excellence. 

* PEAT Day 1 Survey: AWS Step Functions (Wyatt & Arun) https://delighted.com/t/dc6UvByb?eventid=202107217 
* PEAT Day 2 Survey: AWS Step Functions (Wyatt & Arun) https://delighted.com/t/dc6UvByb?eventid=202107226

### What is an AWS Step Function? 

"_AWS Step Functions is a low-code visual workflow service used to orchestrate AWS services, automate business processes, and build serverless applications. Workflows manage failures, retries, parallelization, service integrations, and observability so developers can focus on higher-value business logic._" - https://aws.amazon.com/step-functions/

Think of Step Functions as wrapper logic you can put around other AWS services to manage an end to end process, for example, this [aws_emr module](https://github.optum.com/oaccoe/aws_emr/tree/master/profiles/on_demand_emr) uses a Step Function to let you run an EMR job on a "transient" cluster. The [Step Function](https://github.optum.com/oaccoe/aws_emr/blob/master/profiles/on_demand_emr/step-function.tf) takes care of setting up your EMR environment, running the job, and tearing down the cluster. 

![aws_emr Step Function diagram](/img/PEAT_Step_Functions_EMR_Example.png)

Step Functions can do _very little_ themselves (basically just branching logic, try/catch, pass variables, some data type conversions, and prompts for input), but they can invoke and interact with _many_ AWS services. By orchestrating those services AWS Step Functions can do a great deal!

Examples of AWS services that a Step Function can orchestrate:

* EMR <= popular at Optum! 
* Lambda <= popular at Optum! 
* ECS 
* Fargate 
* Batch
* Athena
* DynamoDB
* SNS
* SQS
* SageMaker
* EventBridge

AWS Step Functions can be built in the AWS Console with a visual edittor and can also be repesented in Terraform. 

AWS maintains state within Step Functions so you can include try/catch logic and records data on runs so you can iterate and troubleshoot later.

With "[Express Workflows](https://docs.aws.amazon.com/step-functions/latest/dg/concepts-standard-vs-express.html)" you can use Step Functions for stream processing, starting up to 100,000 executions per minute. 

With Standard Workflows you can manage long running workflows that take (I kid you not) up to 1 year to complete. 

Step Functions can also trigger other Step Functions! This means you can build "micro-service" workflows with consistent inputs and outputs and then compose and recompose them in a variety of complete processes.

Step Functions can be triggered in [a variety of ways](https://docs.aws.amazon.com/step-functions/latest/dg/concepts-invoke-sfn.html), but most often they are started by:

* AWS Lambda, using the `StartExecution` call.
* Amazon EventBridge, for example, starting a Step Function in response to a an `s3:CreateObject` event. 

Step Functions themselves have neglibile costs, they charge by step invoked, $0.000025 per state transition ("step"). You will of course still have to pay for the resources you Step Function orchestrates.

:::tip PEAT Q

Can I do computational analytics work (like detecting anomalous data in a record) directly in my Step Function with _no other AWS service involved_? 

:::

### Why would you use Step Functions?

If you have a process that: 

* You could draw in a diagram
* Involves multiple AWS services 
* Would take longer than a 15 minutes (max Lambda execution time) to run 
* Has internal "state" 

Step Functions are probably good choice.  

#### Step Functions vs. Lambdas vs. Batch

If you can solve your problem with a single Lambda, you probably should.

Batch is used to orchestrate processes running on EC2 or Fargate instances at scale. If that's what you need to do it's probably a better choice. However, you can orchestrate Batch from _within_ a Step Function (your Batch proccess can be a "step" in your Step Function) so it may be worth considering using both. 

#### Airflow and Other Tools

[Airflow](https://airflow.apache.org/) and other workflow orchestration tools make sense if your workflow needs to be cloud agnostic. 

They also generally offer more features that may be relevant to you needs. 

Unless your goal is being cloud agnostic or you need a "killer feature" from a tool like Airflow you should probably use Step Functions instead since they are very low cost, serverless, and native/managed.

:::tip PEAT Q

Name an AWS Service Step Functions CAN orchestrate.

:::

### How do you create Step Functions?

Creating a Step Function in Terraform is easy! 

(The hard part is building all the things it needs to orchestrate...)

Terraform provides a ["sfn_state_machine"](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/sfn_state_machine) `resource` that represents a Step Function. (_Hey, why does it say "state_machine" - we'll get to that!)

(We'll steal their [example](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/sfn_state_machine#basic-standard-workflow).)

```
resource "aws_sfn_state_machine" "sfn_state_machine" {
  name     = "my-state-machine"
  role_arn = aws_iam_role.iam_for_sfn.arn

  definition = <<EOF
{
  "Comment": "A Hello World example of the Amazon States Language using an AWS Lambda Function",
  "StartAt": "HelloWorld",
  "States": {
    "HelloWorld": {
      "Type": "Task",
      "Resource": "${aws_lambda_function.lambda.arn}",
      "End": true
    }
  }
}
EOF
}
```

The key elements here are:

* `role_arn`: This is the IAM Role your Step Function will run under, it must have permissions to execute each step, this means things like `emr:RunJobFlow` or `lamba:Invoke`. Note that the AWS Service being orchestrated by your Step Function will itself have its own IAM Role/Policy. If your Step Function triggers a Lambda and the Lambda reads from S3 then your Step Function needs `lamba:Invoke` and your Lambda needs `s3:GetObject`.
* `definition`: Here you define your Step Function's workflow (or "State Machine") using (JSON based) ["Amazon States Language"](https://docs.aws.amazon.com/step-functions/latest/dg/concepts-amazon-states-language.html), we'll get into this next.

(I'll also mention `type` which defaults to `STANDARD` but could also be `EXPRESS`, more on the difference [here](https://docs.aws.amazon.com/step-functions/latest/dg/concepts-standard-vs-express.html).)

#### State Machine Definition

A "State Machine" is generic [math and engineering concept](https://en.wikipedia.org/wiki/Finite-state_machine) not created by AWS or unique to it; [for instance, you can build a state machine in Azure](https://docs.microsoft.com/en-us/dotnet/framework/windows-workflow-foundation/state-machine-workflows). 

A State Machine is "a device which can be in one of a set number of stable conditions depending on its previous condition and on the present values of its inputs."

In a Step Function your "State Machine" is what you construct in your `definition`.

AWS uses ["Amazon States Language"](https://docs.aws.amazon.com/step-functions/latest/dg/concepts-amazon-states-language.html) to define the State Machines that their Step Function service manages. 

["Amazon States Language"](https://docs.aws.amazon.com/step-functions/latest/dg/concepts-amazon-states-language.html) is best understood by reading the docs and checking out some [examples](https://github.optum.com/oaccoe/aws_emr/blob/master/profiles/on_demand_emr/templates/create_on_demand_emr.json).

But! We'll cover the basics.

In AWS, each State Machine (the workflow, or "thing your Step Function does") must have:

* A `StartAt` which defines which "step" or "state" happens first. This is your `main()` or your "entry point" for your State Machine.
* One to many "steps" or "states" defined in `States`.

Each "step" or "state" defined in `States` must consist of:

* A `Type`, which determines what that step," "task," or "state" does, your options are:
  * `Pass`
  * `Task` <= where the magic happens
  * `Choice`
  * `Wait`
  * `Succeed`
  * `Fail`
  * `Parallel`
  * `Map`

We'll just look at [`Task`](https://docs.aws.amazon.com/step-functions/latest/dg/amazon-states-language-task-state.html) here.

`"Type": "Task"` "represents a single unit of work performed by a state machine." Each `Task` must have a `Resource` specified by `arn` which is the AWS Service (or instance of a Service) you intend to use for this step. This is the Lambda you want to invoke, the EMR cluster you want to create, the Batch job you want to run, etc. 

`Task` steps can take a variety of additional parameters like `Parameters` and `ResultsPath` that provide the context needed for your unit of work to execute. 

`Task` step definitions must also include either a `Next`, which tells your State Machine what step or state to move to when this unit of work is complete, or an `"End": true` which indicates that the State Machine has reached its final step or state.

:::tip PEAT Q

What `State` `Type` should I select to invoke a Lambda in my Step Function?   

:::

### How do you run Step Functions?

Step Functions can be triggered directly from within the AWS Console UI (click the orange "Start Execution" button) or via the AWS CLI.

1. Log into your AWS Account
2. Go to the Step Functions AWS Service
3. Click on State Machines / Select your State Machine [link](https://console.aws.amazon.com/states/home?region=us-east-1#/statemachines)
4. Click the orange "Start Execution" button! 

![AWS Console UI showing button to start a Step Function run](/img/AWS_Step_Function_Start_Execution.png)

You can find the final "output" of your step function by selecting an execution of it and clicking the "Execution output" tab.

For debugging purposes, you can use the AWS Console to select a Step/State from the digram rendering your Step Function and investigate it by clicking "Step input" or "Step output."

[But they can also be invoked by other AWS Services](https://docs.aws.amazon.com/step-functions/latest/dg/concepts-invoke-sfn.html) like Lambda with `StartExecution` or through Event Bridge when an `s3::CreateObject` event occurs.

### Tips an Tricks

* JSON is an ideal input/output for Step Functions. Step Functions have built in [intrinsic functions](https://docs.aws.amazon.com/step-functions/latest/dg/amazon-states-language-intrinsic-functions.html) for working with them.
* Build and test the things your Step Function will manage first, before orchestrating them with Step Functions.
* You can bulid your Step Function in the AWS Console UI and then export the JSON to your Terraform for deployment. 

### Step Functions in the Wild: aws_emr

The AWS Center of Excellence maintains an [EMR module](https://github.optum.com/oaccoe/aws_emr) that uses Step Functions for its "transient" EMR profile. Refer to that as example of "real world" Step Functions.

* [Terraform that creates the Step Function](https://github.optum.com/oaccoe/aws_emr/blob/master/profiles/on_demand_emr/step-function.tf)
* [State Machine JSON definition](https://github.optum.com/oaccoe/aws_emr/blob/master/profiles/on_demand_emr/templates/create_on_demand_emr.json)

:::tip PEAT Q - CHALLENGE

In Wyatt's DCE account there is a [single Terraform file (peat_step_function.tf)](https://github.optum.com/raw/CommercialCloud-Redbox-AWS/wanderse/master/terraform/peat_step_function.tf).  

If you drop that file into your terraform/ directory in your DCE account and run it, it will build you a Step Function, with a State Machine called "peat-demo-step-function".

Run that State Machine and find the "Step output" of the "PEAT Secret word" Step. 

The input for the Step Function is: `"IsHelloWorldExample": true`.

Post the text in the Teams Chat! 

:::








