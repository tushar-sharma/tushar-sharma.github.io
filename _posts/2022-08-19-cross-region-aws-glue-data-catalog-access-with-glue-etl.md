---
layout: post
title: Cross Region AWS Glue Data Catalog access with Glue ETL
category: blog
tags:
  - aws
  - glue
thumb: https://unsplash.com/photos/2EJCSULRwC8/download?w=437
summary: Fizz up with carbonated water
image: https://unsplash.com/photos/2EJCSULRwC8/download?w=437
author: Tushar Sharma
featuredPost: false
published: true
---

AWS Glue job are fully managed ETL service. Glue job uses hive-compatible metastore called Glue Data catalog.
<!-- truncate_here -->

AWS Glue job are fully managed ETL service. Glue job uses hive-compatible metastore called Glue Data catalog.

So one way to create `dynamic frame` in AWS Glue (Pyspark) is

<script src="https://gist.github.com/tushar-sharma/5ef39040eafc230490131e037c4fb1a1.js?file=spark_job1.py"></script>


This Glue job reads Glue `database` defined in same region. As if now, there's no way to access cross-region database in Glue catalog. 

However, if the s3 bucket is global, you can directly create `dataframe` from s3 bucket. 

<script src="https://gist.github.com/tushar-sharma/5ef39040eafc230490131e037c4fb1a1.js?file=spark_job2.py"></script>