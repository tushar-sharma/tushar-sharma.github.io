---
layout: post
title: Export DynamoDB Table to S3 Bucket Using Lambda Function
category: blog
tags:
- aws
- lambda function 
- dynamodb
- s3
name: dynamodb-table-s3
thumb: https://cdn-media-1.freecodecamp.org/images/NRiku0VLpjCZJtuf14-rhKFtFpHe2iqs9oZP
featuredPost: true
---

Dynamodb is a great NoSQL service by AWS. One of the most common use case is to export data to s3. There are multiple ways to export data to s3. For this tutorial we will leverage lambda function to achieve our goal.<!-- truncate_here -->


Dynamodb is a great NoSQL service by AWS. Often it's required to export data from the dynamodb table .


First, let us review our use case. Our lambda function will read from table from dynamodb and export JSON to s3.


| <img align="center" src="{{ root_url }}/img/dynamodbexport.png" alt="" /> |


## Using boto3 resource

{% template  customCode.html %}
---
id: 71d7b985435d2719d73dbf927e2c966a
---
{% endtemplate %}

We can create a payload to test our lambda function 


```
{
   "TableName": "DynamoDB_Table_name",
   "s3_bucket": "s3_bucket_name",
   "s3_object": "s3_object_name",
   "filename": "output.json"
}
```


However, sometimes we might encounter errors for certain values in DynamoDB.  


```bash
TypeError: Object of type Decimal is not JSON serializable. 
```

We can use a JSONEncoder class to update our lamda function. 

{% template  customCode.html %}
---
id: 4d5c8a61cae95198e6033789e5dd604d
---
{% endtemplate %}

## Using boto3 client

Another way to export data is to use boto3 client. It's a low level AWS services. 


{% template  customCode.html %}
---
id: 2d8898fd4ae7cd629657d9a241c7d829
---
{% endtemplate %}


However boto3 client will generates dynamodb JSON. A simple python script to convert it back to normalized JSON using `dynamodb_json` library.

{% template  customCode.html %}
---
id: e7ee63cd8dcdbd2767ac34846762b72e
---
{% endtemplate %}