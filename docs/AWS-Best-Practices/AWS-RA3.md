---
id: AWS-RA3
title: AWS Redshift RA3 Clusters
sidebar_label: AWS Redshift RA3 Clusters
---
> Documented by: Sarojani Macharla

### Redshift - RA3 cluster information

#### Overview
In late 2019 AWS released RA3 nodes with managed storage which enable you to scale and pay for compute and storage independently allowing you to size your cluster based only on your compute needs and only pay for the managed storage that you use.
You should size your RA3 cluster based on the amount of data you process daily.
Redshift managed storage uses large, high-performance SSDs in each RA3 node for fast local storage and Amazon S3 for longer-term durable storage.
The RA3 node type is based on AWS Nitro and includes support for Redshift managed storage. If the data in a node grows beyond the size of the large local SSDs, Redshift managed storage automatically manages data placement across tiers of storage and caches the hottest data in high-performance SSD storage while automatically offloading colder data to S3.
Redshift managed storage uses advanced techniques such as block temperature, data block age, and workload patterns to optimize performance.
You pay the same low rate for Redshift managed storage regardless of whether the data sits in high-performance SSDs or S3.

You can find the cost of any redshift cluster price using https://aws.amazon.com/redshift/pricing/?&trk=em_a134p000006BmaQAAS&trkCampaign=pac_q120_Redshift_RIs_pricing&sc_channel=em&sc_campaign=

For workloads that require ever-growing storage, managed storage lets you automatically scale your data warehouse storage capacity without adding and paying for additional nodes.

#### RA3 node types

| Node size | vCPU | RAM (GiB) | Default slices per node | Managed storage quota per node | Node range with create cluster | Total managed storage capacity |
|:---------:|:----:|:---------:|:-----------------------:|:------------------------------:|:------------------------------:|:------------------------------:|
| ra3.xlplus | 4 | 32 | 2 | 32 TB | 2 - 16 | 1024 TB |
| ra3.4xlarge | 12| 96 | 4 | 128 TB |2 - 32 | 8192 TB |
| ra3.16xlarge| 48 | 384 | 16 | 128 TB | 2-128 | 16,384 TB|

#### Amazon Redshift node types

Amazon Redshift offers different node types to accommodate your workloads, and recommend choosing RA3 or DC2 depending on the required performance, data size and its growth.

* RA3 nodes with managed storage allow you to optimize your data warehouse by scaling and paying for compute and managed storage independently. With RA3, you choose the number of nodes based on your performance requirements and only pay for the managed storage that you use. You should size your RA3 cluster based on the amount of data you process daily.
   Redshift managed storage uses large, high-performance SSDs in each RA3 node for fast local storage and Amazon S3 for longer-term durable storage. If the data in a node grows beyond the size of the large local SSDs, Redshift managed storage automatically offloads that data to Amazon S3. You pay the same low rate for Redshift managed storage regardless of whether the data sits in high-performance SSDs or S3.
   For workloads that require ever-growing storage, managed storage lets you automatically scale your data warehouse storage capacity without adding and paying for additional nodes.

* DC2 nodes allow you to have compute-intensive data warehouses with local SSD storage included. You choose the number of nodes you need based on data size and performance requirements. DC2 nodes store your data locally for high performance, and as the data size grows, you can add more compute nodes to increase the storage capacity of the cluster. For datasets under 1TB uncompressed, we recommend DC2 node types for the best performance at the lowest price. If you expect your data to grow, we recommend using RA3 nodes so you can size compute and storage independently to achieve the best price and performance.

* DS2 nodes enable you to create large data warehouses using hard disk drives (HDDs), and we recommend using RA3 nodes instead. If you are using DS2 nodes, see Overview of RA3 Node Types in the Cluster Management Guide for upgrade guidelines. Customers using eight or more nodes of DS2.xlarge, or any number of DS2.8xlarge nodes, can now upgrade to RA3 and get 2x more storage and better performance for the same on-demand cost.

##### Concurrency Scaling pricing

Amazon Redshift automatically adds transient capacity to provide consistently fast performance, even with thousands of concurrent users and queries. There are no resources to manage, no upfront costs, and you are not charged for the startup or shutdown time of the transient clusters.
 You can accumulate one hour of concurrency scaling cluster credits every 24 hours while your main cluster is running. You are charged the per-second on-demand rate for a concurrency scaling cluster used in excess of the free credits - only when it's serving your queries - with a one-minute minimum charge each time a concurrency scaling cluster is activated.
The per-second on-demand rate is based on the type and number of nodes in your Amazon Redshift cluster.

Concurrency Scaling credits

Amazon Redshift clusters earn up to one hour of free Concurrency Scaling credits per day. Credits are earned on an hourly basis for each active cluster in your AWS account, and can be consumed by the same cluster only after credits are earned. You can accumulate up to 30 hours of free Concurrency Scaling credits for each active cluster. Credits do not expire as long as your cluster is not terminated.

Pricing example for Concurrency Scaling

A 10 DC2.8XL node Redshift cluster in the US-East costs $48 per hour. Consider a scenario where two transient clusters are utilized for five minutes beyond the free Concurrency Scaling credits. The per-second on-demand rate for Concurrency Scaling is $48 * 1/3600 = $0.013 per second. The additional cost for Concurrency Scaling in this case is $0.013 per second * 300 seconds * 2 transient clusters = $8. Therefore, the total cost of the Amazon Redshift cluster and the two transient clusters in this case is $56.

#### Cost and configuration per node in Redshift


|                   | vCPU | Memory | Addressable storage capacity | I/O | Price |
|:-----------------:|:----:|:------:|:----------------------------:|:---:|:-----:|
| Dense Compute DC2	|
| dc2.large | 2 | 15 GiB | 0.16TB SSD |	0.60 GB/s |	$0.25 per Hour |
| dc2.8xlarge |	32 | 244 GiB |	2.56TB SSD | 7.50 GB/s | $4.80 per Hour |
| Dense Storage DS2 |
| ds2.xlarge |	4 | 31 GiB | 2TB HDD |	0.40 GB/s |	$0.85 per Hour |
| ds2.8xlarge |	36 | 244 GiB | 16TB HDD | 3.30 GB/s | $6.80 per Hour |
| RA3 with Redshift Managed Storage* |
| ra3.xlplus |	4 |	32 GiB | 32TB RMS |	0.65 GB/s |	$1.086 per Hour |
| ra3.4xlarge |	12 | 96 GiB | 128TB RMS | 2.00 GB/s |$3.26 per Hour |
| ra3.16xlarge | 48	| 384 GiB |	128TB RMS |	8.00 GB/s |	$13.04 per Hour |



#### Total Cost and configuration comparision between DS2 and RA3


|  Node Type    | Number of Nodes | Total vCPU | Total Memory(GiB) | I/O (GB/Sec) | Total Addressable storage capacity | Cost Per Hour/Node | Total Cluster Cost/Hr |
|:-------------:|:---------------:|:----------:|:-----------------:|:------------:|:----------------------------------:|:------------------:|:---------------------:|
| ds2.xlarge    |	    6         |     24     |     186 GiB        |	2.4 GB/s  |           4TB HDD                  |	$0.85 per Hour  |   $5.1 per Hour       |
| ra3.4xlarge   |     	2         |  	24     |     196 GiB        |   4.0 GB/s  |         128TB RMS                  |	$3.26 per Hour  |   $6.52 per Hour      |




#### Creating a new Amazon Redshift RA3 cluster
You can create a new cluster on the Amazon Redshift console or the AWS Command Line Interface (AWS CLI).
You can follow the steps mentioned here to create new RA3 cluster https://aws.amazon.com/blogs/big-data/introducing-amazon-redshift-ra3-xlplus-nodes-with-managed-storage/

#### Upgrading existing cluster to RA3 type
DS2 nodes enable you to create large data warehouses using hard disk drives (HDDs), and AWS recommend using RA3 nodes instead.
Customers using eight or more nodes of DS2.xlarge, or any number of DS2.8xlarge nodes, can now upgrade to RA3 and get 2x more storage and better performance for the same on-demand cost.


The following table shows recommendations when upgrading to RA3 node types.

| Existing node type | Range of existing number of nodes | Recommended new node type |	Upgrade action |
|:------------------:|:---------------------------------:|:-------------------------:|:---------------:|
| ds2.xlarge | 1–7 | ra3.xlplus | Create 2 nodes of ra3.xlplus for every 3 nodes of ds2.xlarge. |
| ds2.xlarge | 8–128 | ra3.4xlarge | Create 1 node of ra3.4xlarge for every 4 nodes of ds2.xlarge. |
| ds2.8xlarge | 2–15 | ra3.4xlarge | Create 2 nodes of ra3.4xlarge for every 1 node of ds2.8xlarge. |
| ds2.8xlarge | 16–128 | ra3.16xlarge | Create 1 node of ra3.16xlarge for every 2 nodes of ds2.8xlarge. |
| dc2.8xlarge | 2–15 | ra3.4xlarge | Create 2 nodes of ra3.4xlarge for every 1 node of dc2.8xlarge1. |
| dc2.8xlarge | 16–128 | ra3.16xlarge | Create 1 node of ra3.16xlarge for every 2 nodes of dc2.8xlarge1.|
| dc2.large | 1–4 | none | Keep existing dc2.large cluster. |
| dc2.large |4–15 | ra3.xlplus | Create 3 nodes of ra3.xlplus for every 8 nodes of dc2.large1. |
| dc2.large | 16–128 | ra3.4xlarge | Create 1 node of ra3.4xlarge for every 8 nodes of dc2.large1. |


1Extra nodes might be needed depending on workload requirements. Add or remove nodes based on the compute requirements of your required query performance.

The minimum number of nodes for RA3 clusters is 2 nodes. Take this into consideration when creating an RA3 cluster.

#### To upgrade your existing node type to RA3, you have the following options to change the node type:



1. **Elastic resize** – You can quickly upgrade your existing DS2 or DC2 node type clusters to RA3 with elastic resize.
This is the most efficient way to change the instance type and update the nodes in your Amazon Redshift cluster. The cluster endpoint doesn't change and the downtime during resize is minimal. Elastic resize is the fastest method to resize a cluster. You can use elastic resize to add or remove nodes and change node types for an existing cluster.
 When you use elastic resize to change node type, Amazon Redshift automatically creates a snapshot, creates a new cluster, deletes the old cluster, and renames the new cluster.
The elastic resize operation can be run on-demand or can be scheduled to run at a future time.
With Amazon Redshift elastic resize, you slice your cluster in half or double the node count. Amazon Redshift presents slice mapping options that are applicable to your configuration. Amazon Redshift does not consider data size during a resize.

To check the available node migration options, choose the Nodes dropdown list in the AWS Management Console. If your current configuration supports elastic resize, then use elastic resize to upgrade your cluster with the RA3 node type. The minimum node count required to perform an elastic resize is two.

Note: Some configuration changes don't allow an elastic resize. If elastic resize is unavailable as an option in your AWS Management Console, use the snapshot restore method.

Before you perform an elastic resize, determine the possible node configurations for different node types using the following:

The DescribeNodeConfigurationOptions API, which returns properties of possible node configurations such as node type, number of nodes, and disk usage for the specified action type.
-or-
The describe-node-configuration-options AWS Command Line Interface (AWS CLI) command, which returns possible node configurations. Node configuration settings include node type, number of nodes, and disk usage for the specified action type.

**Note:** The AWS CLI doesn't offer node configuration options for slice mapping.

For example:
aws redshift describe-node-configuration-options --action-type resize-cluster --cluster-identifier your-redshift-clusteridentifier

To use elastic resize to change your cluster configuration in Amazon Redshift, perform the following steps:

 1.    Sign in to your AWS Management Console.

 2.    Open the Amazon Redshift console.

 3.    Choose Clusters.

 4.    Select your Amazon Redshift cluster.

 5.    Choose Actions.

 6.    Choose Resize.

 7.    Select Elastic Resize as your resize type.

 8.    Select the node that you want to migrate to for New cluster configuration.

 9.    Select the number of nodes based on node type.

 10.   Choose Resize cluster now to trigger the resize. When the resize completes, the status of your cluster changes from Available to Modifying.
       You can find more details about elastic-resize here - https://docs.aws.amazon.com/redshift/latest/mgmt/managing-cluster-operations.html#elastic-resize

2. **Restore from a snapshot** – Amazon Redshift uses the most recent snapshot of your DS2 or DC2 cluster and restores it to create a new RA3 cluster.
 As soon as the cluster creation is complete (usually within minutes), RA3 nodes are ready to run your full production workload.
 As compute is separate from storage, hot data is brought in to the local cache at fast speeds thanks to a large networking bandwidth.
 If you restore from the latest DS2 or DC2 snapshot, RA3 preserves hot block information of the DS2 or DC2 workload and populates its local cache with the hottest blocks.
  For more information, see https://docs.aws.amazon.com/redshift/latest/mgmt/working-with-snapshots.html#working-with-snapshot-restore-cluster-from-snapshot.

  To keep the same endpoint for your applications and users, you can rename the new RA3 cluster with the same name as the original DS2 or DC2 cluster.
  To rename the cluster, modify the cluster in the Amazon Redshift console or ModifyCluster API operation.
  For more information, see Renaming clusters or ModifyCluster API operation in the Amazon Redshift API Reference.

  Run the following command to describe the options available for this snapshot.
  aws redshift describe-node-configuration-options --snapshot-identifier mycluster-snapshot --region eu-west-1 -—action-type restore-cluster
  This command returns an option list with recommended node types, number of nodes, and disk utilization for each option.

 Choose the snapshot and restore method if elastic resize is unavailable (from a mismatch between slice and node count).
 Or, use this method to minimize the amount of time that it takes to write to your production database.

**Note:** Data written to the source cluster after the snapshot is taken must be copied over manually to the target cluster afterwards.

If elastic resize is unavailable to you in your Amazon Redshift console, use the snapshot and restore method. You can use the DescribeNodeConfigurationOptions API or describe-node-configuration-options AWS CLI command to obtain the possible node configurations for different node types. Then, restore your cluster to the original configuration.

For example:
aws redshift describe-node-configuration-options --action-type restore-cluster --snapshot-identifier your-snapshot-identifier

**Note:** If you receive errors when running AWS CLI commands, make sure that you’re using the most recent AWS CLI version.

To use the snapshot and restore method to change your cluster configuration, perform the following steps:

1.    Sign in to your AWS Management Console.

2.    Open the Amazon Redshift console.

3.    Choose Clusters.

4.    Choose Snapshots.

5.    Select the most recent snapshot of the source cluster.

6.    Choose Restore from Snapshot.

7.    Select the node type.

8.    Select the number of nodes.

9.    (Optional) Under Additional Configuration, modify the database configurations and default configurations (such as your VPC, parameter group, monitoring, and backup).

10.    Choose Restore cluster from snapshot.

To retain the same endpoint as your source cluster, perform the following steps:

Important: Before you begin, you must create an Amazon Redshift cluster.

1.    Delete the old Amazon Redshift cluster.

2.    Select the new cluster.

3.    Choose the Actions dropdown menu.

4.    Choose Modify.

5.    Specify the same Cluster Identifier as your deleted cluster.

6.    Choose Modify Cluster.

  You can also use the ModifyCluster API or modify-cluster AWS CLI command to rename your Amazon Redshift cluster. For more information, see Renaming clusters.
  You can find more details about Snapshot and restore method here - https://docs.aws.amazon.com/redshift/latest/mgmt/managing-cluster-operations.html#rs-tutorial-snapshot-restore-resize-overview

3. **Classic resize** - Choose the classic resize method if it's the only option available. For single node clusters, only a classic resize can be performed to convert the cluster into a multi-node cluster.

If elastic resize is unavailable to you in your Amazon Redshift console, use the classic resize method to update your node configurations. A classic resize depends on the amount of data and node count in your cluster. The resize can take anywhere from several hours to several days. It's a best practice to perform a classic resize if it is your only option for upgrading your node configuration.

**Note:** In some cases (such as single node clusters), the classic resize is your only option to update your node configuration.

To use a classic resize to change your node configuration, perform the following steps:

1.    Sign in to your AWS Management Console.

2.    Open the Amazon Redshift console.

3.    Select the cluster that you want to modify.

4.    Choose the Actions dropdown menu.

5.    Choose Resize.

6.    Choose Classic Resize.

7.    Under New cluster configuration, select your preferred node type and nodes for migration.

8.    Choose Resize cluster now to begin the classic resize. Your Amazon Redshift cluster remains in the read-only mode until the resize operation completes.IAM policies: It specifies the permission that need to be acquired.

  You can find more details about classic-resize here - https://docs.aws.amazon.com/redshift/latest/mgmt/managing-cluster-operations.html#classic-resize

 #### Comparison of RA3 vs. DS2 Instance Types
 Aws recommends upgrading to to RA3 clusters with the existing DS2 (dense storage) clusters.

  You can find more detailed comaprision statistics here - https://aws.amazon.com/blogs/apn/amazon-redshift-benchmarking-comparison-of-ra3-vs-ds2-instance-types/


 ## AQUA (Advanced Query Accelerator):
 The combination of large amounts of data (often accessed by queries that mandate a full scan) on RA3 and limits on network traffic, can result in a situation where network and CPU bandwidth become limiting factors.
 to address this AWS  introduced AQUA.  AQUA is enabled on ra3.4xlarge and ra3.16xlarge node types.
 AQUA pushes the computation needed to handle reduction and aggregation queries closer to the data. This reduces network traffic, offloads work from the CPUs in the RA3 nodes, and allows AQUA to improve the performance of those queries by up to 10x,
 at no extra cost and without any code changes.
 AQUA uses the custom-designed hardware in the AQUA nodes to accelerate queries. Each node performs the reduction and aggregation operations in parallel with the others. In addition to getting the n-fold speedup due to parallelism,
 the amount of data that must be sent to and processed on the compute nodes is generally far smaller (often just 5% of the original)
 All data cached by AQUA is encrypted using your keys. After performing a filtering or aggregation operation, AQUA compresses the results, encrypts them, and returns them to Redshift.
 There is no  additional charge  for AQUA to use.
 You don't need to change your databases or applications to use AQUA. Amazon Redshift identifies the scan portions of queries that can benefit from acceleration and push them to AQUA for processing. AQUA automatically optimizes query performance on subsets of the data that require extensive scans, filters, and aggregation. With this approach, you can use AQUA to run queries that scan, filter, and aggregate large datasets. AQUA excels at queries that require processing-intensive scans, filters, and aggregation such as those that contain LIKE and SIMILAR TO predicates.

**Notes:**

1. Cluster Version – Your clusters must be running Redshift version 1.0.24421 or later in order to be able to make use of AQUA
2. AQUA is designed to deliver up to 10X performance on queries that perform large scans, aggregates, and filtering with LIKE and SIMILAR_TO predicates.
3. AQUA is available now in the US East (N. Virginia), US West (Oregon), US East (Ohio), Europe (Ireland), and Asia Pacific (Tokyo) Regions.

#### You have the following choices when you configure AQUA:

  Turn on – You choose to activate AQUA. AQUA can only be activated in certain AWS Regions and for ra3.4xlarge and ra3.16xlarge node types.

  Turn off – You choose not to activate AQUA.

  Automatic – Amazon Redshift determines whether to use AQUA. This is the default. Currently, AQUA isn't activated with this option, but this behavior is subject to change.

#### Create a cluster with AQUA:
 Follow the instructions in this doc https://aws.amazon.com/blogs/big-data/introducing-amazon-redshift-ra3-xlplus-nodes-with-managed-storage/  to create the RA3 cluster and you see the option of AQUA (Advanced Query Accelerator) after you choose Node type ra3.4xlarge or ra3.16xlarge.

#### Enabling AQUA on  existing cluster:
 You can find wether the cluster already has AQUA enabled or not on General information section (select the cluster and the top you see General information on top section).
 Select existing cluster, select Configure AQUA for Actions (Assumingthe cluster is  ra3.4xlarge or ra3.16xlarge node type), select one of the modes from above, save and restart the cluster.

#### Managing AQUA using the AWS CLI:
 1. create-cluster - https://docs.aws.amazon.com/cli/latest/reference/redshift/create-cluster.html
 2. restore-from-cluster-snapshot - https://docs.aws.amazon.com/cli/latest/reference/redshift/restore-from-cluster-snapshot.html
 3. modify-aqua-configuration - https://docs.aws.amazon.com/cli/latest/reference/redshift/modify-aqua-configuration.html

#### Managing AQUA using Amazon Redshift API operations:
 1. CreateCluster - https://docs.aws.amazon.com/redshift/latest/APIReference/API_CreateCluster.html
 2. RestoreFromClusterSnapshotRestoreFromClusterSnapshot - https://docs.aws.amazon.com/redshift/latest/APIReference/API_RestoreFromClusterSnapshot.html
 3. ModifyAquaConfiguration - https://docs.aws.amazon.com/redshift/latest/APIReference/API_ModifyAquaConfiguration.html


#### When Redshift uses AQUA:
  For each query that scans a table, Amazon Redshift determines whether the scan operation is sent to AQUA or run locally on the Amazon Redshift cluster. Scan and aggregation operations are sent to AQUA when they contain at least one predicate that contains a LIKE or SIMILAR TO expression that AQUA supports.

**Example1:**
select num2 from tbl where str1 LIKE 'a%' and num1 > 10 GROUP BY num2;
   The following query includes the predicates str1 LIKE 'a%' and num1 > 10 that are sent to AQUA.
   In this case, AQUA scans the table tbl, filters by the predicates, groups the results by num2, and returns the results to Amazon Redshift.

**Example2:**
select  c.customer_name, p.prod_name, sum(revenue)
               from orders o
                 join customers c ON c.id = o.customer_id
                 join products p ON p.id = o.product_id
               where c.customer_name LIKE ‘%Amazon%Web%’
               order by sum(revenue);

  In this example, there is a LIKE predicate on the customer_name column that is used to filter the rows returned. The scan operation is sent to AQUA to run that part of the query. Amazon Redshift receives only the results of the scan, which Amazon Redshift then uses to perform a join locally and complete the query.

#### Type for SQL queries not supported by AQUA:
1. Queries that perform writes, such as, INSERT, UPDATE, DELETE, CREATE TABLE AS, COPY, and UNLOAD.
2. Python user-defined functions (UDFs) in scans, including scans on complex views that are defined by Python UDFs.
3. Queries that use the following metacharacters in LIKE and SIMILAR TO predicates:
   1. A nonconstant regular expression literal in a LIKE expression.
   2. Either of two alternatives
     ex: SIMILAR TO '%(cat|dog)%'
   3. Multiple instances of single-character wildcards in VARCHAR columns
     ex: SIMILAR TO 'ab.cd.ef'
   4. Unicode escape sequence, hex-characters, and octal-characters in the match string
     ex: SIMILAR TO '%ab\uc382'
         SIMILAR TO '%ab\U0000c382'
         SIMILAR TO '%ab\x88'
         SIMILAR TO '%ab\127'
   5. Repetition metacharacters such as “*”, “+”, “?”, {m,n} applied on a pattern within () and on multibyte characters
     ex: SIMILAR TO 'abc(def)*'
         SIMILAR TO 'abcʥ+'
   6. Multibyte characters within a bracket expression [...]
     ex: SIMILAR TO 'abc[ʥde]'.
4. Queries where string functions, such as LOWER, UPPER, LEFT, RIGHT, are applied to the output of a LIKE or SIMILAR.
   TO scan. For example, the following excerpt shows a LOWER function.
   LOWER(a) LIKE "%cat%"

   Instead, try to rewrite the query to use case-insensitive ILIKE without LOWER.
   ILIKE "%cat%"


####  How to determine if AQUA was used:
The following SQL shows segments of query execution from SVL_QUERY_SUMMARY that ran on AQUA.

select * from svl_query_summary where label ~ 'Aqua' limit 100;
If you have superuser access, you can also join the STL_QUERY and STL_QUERYTEXT views to see the SQL statements that correspond to queries run by AQUA. The explain plan that is generated by the EXPLAIN statement doesn't show if a query used AQUA.


#### AWS Reference Docs:
1. https://docs.aws.amazon.com/redshift/latest/mgmt/managing-cluster-aqua.html
2. https://docs.aws.amazon.com/redshift/latest/mgmt/managing-cluster-aqua-understanding.html
