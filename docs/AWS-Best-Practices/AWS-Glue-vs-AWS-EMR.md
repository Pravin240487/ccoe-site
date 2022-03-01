---
id: AWS-Glue-vs-AWS-EMR
title: AWS Glue Vs AWS EMR
sidebar_label: AWS Glue Vs AWS EMR
---
> Point of Contact: Arun Kumar R

## AWS Glue Vs EMR Service:

The purpose of this doc is to identify the differences between AWS Glue and EMR and to know which works better for different use-cases.


#### What is AWS Glue?

AWS Glue is a fully managed extract, transform, and load (ETL) service that makes it easy for any teams to prepare and load their data for analytics. We can create and run an ETL job with a few clicks in the AWS Management Console or terraform. 
We simply point AWS Glue to our data stored on AWS, and AWS Glue discovers our data and stores the associated metadata (e.g. table definition and schema) in the AWS Glue Data Catalog. Once cataloged, our data is immediately searchable, queryable, and available for ETL.

We already did a POC on AWS Glue and provided a detailed guide about configurations at [AWS Glue for running Serverless Spark ETL Jobs](https://cloudpoc.optum.com/docs/doc22#aws-glue-for-running-serverless-spark-etl-jobs).

#### What is AWS EMR?

Amazon EMR is a managed cluster platform that simplifies running big data frameworks, such as Apache Hadoop and Apache Spark, on AWS to process and analyze vast amounts of data. By using these frameworks and related open-source projects, such as Apache Hive and Apache Pig, you can process data for analytics purposes and business intelligence workloads. Additionally, you can use Amazon EMR to transform and move large amounts of data into and out of other AWS data stores and databases, such as Amazon Simple Storage Service (Amazon S3) and Amazon DynamoDB. 

### Comparison of AWS Glue and EMR:

Please note that these 2 services are similar in a way that they both provide an environment for performing ETL jobs(Extract-Transform-Load). Yet, there are a few differences and the use cases vary across the services - as we will see later "You can replace Glue with EMR but not the other way round".

#### Managment Overhead:
Glue is a serverless approach where you do not worry too much about the underlying resources which are provisioned, managed and terminated for your. Yet, there are limited types of resources that you can choose from - currently, we only have 3 worker types.

On the other hand, with EMR you have the freedom to install different applications and managed your instances, which adds to the complexity of managing the EMR cluster but provides more functionality to the environment.

#### Pricing:
Since AWS Glue comes as a serverless platform, it has more cost attached to it. But, on the other hand, Amazon EMR is less costly as you already have the required setup.

Typically, AWS Glue costs you around $0.44 per hour per DPU. So roughly, you would need to pay around $21 per day.

But on the other hand, Amazon EMR is less costly. You have to pay around $14-16 per day for similar configurations.

#### Flexibility & Scalability:
AWS Glue is a flexible and easily scalable ETL platform as it works on AWS serverless platform. But, on the other hand, Amazon EMR is less flexible as it works on your onsite platform.

So, in short, if you have flexible requirements, and you need to scale up and down, AWS Glue is a more viable option. But, if you have fixed requirements and you have the setup, it is better to opt for Amazon EMR.

#### ETL Operations:
AWS Glue is designed to operate the Extract, Transform, and Load operations for big data analytics. Amazon EMR can also be used for ETL operations, amongst many other database operations.

But, AWS Glue is faster than Amazon EMR being an ETL-only platform. As a serverless platform, AWS Glue has the edge over EMR in terms of operational flexibility.

So if you want to use either one of these tools for ETL operations only, I would suggest you go for Amazon Glue from operational perspectives.

#### Performance:
In AWS Glue, you cannot store temp files, executable files on your end due to serverless infrastructure. This, in turn, affects the performance of the system.

But, on the other hand, if you’re using Amazon EMR, you can store these files on your end. This allows you to run the database faster and enhances the overall system performance.

When comparing AWS Glue and Amazon EMR from performance parameters, Amazon EMR is a faster platform.

#### The reasons to move to AWS Glue when currently using EMR
1) **Use of Glue Catalog as metastore:** Having a shared metastore like this allows us to access data between Glue,Athena and EMR. This removes the operating burden on us to ensure we keep our own metastore highly available at all times.

2) **Management and administration:** As Glue is a managed environment, this allows our business to spend more time creating and optimizing our jobs rather than administrating clusters. This allows users to integrate data from different sources faster. As there are no servers to manage, the user does not need to worry about configuration settings and scaling while only paying for the resources they actually use.

3) **Scheduling jobs:** On Glue, job scheduling is automatically built in, this allows the developer to automate their jobs easily and effectively without needing to run something like apache airflow to schedule tasks for them.

4) **Additional performance:** While Glue uses Spark, we have optimized some aspects,such as replacing dataframes with dynamicFrames[1] to help increase performance. We have also pretuned our Spark environments.

5) **Glue also has development endpoints** which can be used for testing and can be easily setup with jupyter and zeppelin notebooks and accessed through the console.


#### The reasons to not move to Glue when you have EMR clusters running already ?

1) You want full control over the resources and when they are provisioned(Glue can take a while for this, but has got better in recent months). You also want to specify the Spark configurations yourself and want to have the latest open source Spark version available.

2) You want jobs to be submitted to the same cluster while also having full control of the likes of scaling and which applications are run on the cluster. If your spark jobs utilize hbase or other applications this could be a reason to keep with EMR.

3) EC2 instance selection, EMR provides a great range of different instance types that can be used to meet very particular workloads you might have.

4) Application selection, Glue only runs Spark, if you also want Presto, HBase, Hive and many other applications to be accessed in one place, EMR would be your go to choice.

5) Equivalent to EMRFS Role mapping is not available in AWS Glue. If the Spark jobs are relying on writing the dataframes to S3 via EMRFS, then using AWS EMR would be the ideal choice and there is no very good support for this in AWS Glue as of now.

### Conclusion

If we are solely using Spark for our use-case, we can choose either of these services, with Glue having the additional functionality of Crawlers, Schedulers and auto-generated scripts that can help us implementing our logic. Yet, if we want to perform more complex actions on the data including other applications, we might have to use EMR.

We could replace Glue with EMR but not vice versa, EMR has far more capabilities than its server-less counterpart.

In conclusion, if our workforce is new to AWS configuration and we only wanted to execute simple ETL, Glue might be a sensible option. However if we wished to leverage Hadoop technologies and perform more complex transformation, EMR is the more viable solution.
