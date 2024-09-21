---
layout: post
title: Create a Lambda Function to run SQL queries in Redshift Cluster
category: blog
tags:
  - python
  - sql
  - lambda function
  - aws
  - redshift
featuredPost: true
summary: check fraud
image: 'https://unsplash.com/photos/BjL7XCugMNY/download?w=437'
thumb: 'https://unsplash.com/photos/BjL7XCugMNY/download?w=437'
author: Tushar Sharma
published: true
---

Amazon Redshift is fully managed warehouse service provided by AWS. The Amazon Redshift engine is a SQL-compliant, massively-parallel, query processing and database management system designed to support analytics workload.<!-- truncate_here -->


Amazon Redshift is fully managed warehouse service provided by AWS. The Amazon Redshift engine is a SQL-compliant, massively-parallel, query processing and database management system designed to support analytics workload.

An Amazon Redshift cluster is comprised of a leader node and one or more compute nodes. We also support a single-node design where leader and compute work is shared on a single node. The leader node accepts connections from client programs, parses requests, generates & compiles query plans for execution on the compute nodes, performs final aggregation of results when required, and coordinates serialization and state of transactions. The compute node(s) perform the heavy lifting inherent in both
query processing and data manipulation against local data.[^redshift]

AWS GUI provides Query Editor to execute sql command. However it’s better to leverage APIs by using AWS Lambda function.

### Read SQL Queries

Lets start with creating a flat file which would contain all our SQL commands that we want to execute in the Redshift Cluster. We will upload the flat file to the s3 bucket. The content for the file is

<script src="https://gist.github.com/tushar-sharma/0ea44788e9afe78b3dcc94a026dc53c1.js?file=sql_file.sql"></script>

Materialized views are useful in warehouses to increase the speed of queries on very large databases. They are a database object that stores the results of a query.

### Write Lambda Function

Lets start by creating a `lambda function handler` which would be invoked when the lambda function run.

<script src="https://gist.github.com/tushar-sharma/0ea44788e9afe78b3dcc94a026dc53c1.js?file=lambda_function1.py"></script>

Its not a good practice to hard code cluster information or password in the code. We will this information from the `AWS Secret Manger`. I’ll assume that secret is already created. We will write a method to retrieve those values using `secret_name` passed as an Environment variable. Other environment variables are

1. region e.g us-east-1

2. sql_bucket is the name of s3 bucket

3. sql_prefix is the prefix for the object stored on s3

<script src="https://gist.github.com/tushar-sharma/0ea44788e9afe78b3dcc94a026dc53c1.js?file=lambda_function2.py"></script>

Also we need to read the sql commands stored in s3 location.

<script src="https://gist.github.com/tushar-sharma/0ea44788e9afe78b3dcc94a026dc53c1.js?file=lambda_function3.py"></script>

Lastly we will write our method exec_redshift that will do the following

1. Retrieve cluster information from AWS Secret Manager

2. Read content of the sql file stored on s3

3. Execute sql commands sequentially in redshift cluster

<script src="https://gist.github.com/tushar-sharma/0ea44788e9afe78b3dcc94a026dc53c1.js?file=lambda_function4.py"></script>
