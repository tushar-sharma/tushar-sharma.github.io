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
---

<p> Dynamodb is a great NoSQL service by AWS. One of the most common use case is to export data to s3. There are multiple ways to export data to s3. For this tutorial we will leverage lambda function to achieve our goal.
</p>

First, let us review our use case. Our lambda function will read the entire dynamodb table. It will then export the data in JSON to s3.<!-- truncate_here -->

<p>Tags: {% for tag in page.tags %} <a class="mytag" href="/tag/{{ tag }}" title="View posts tagged with &quot;{{ tag }}&quot;">{{ tag }}</a>  {% if forloop.last != true %} {% endif %} {% endfor %} </p>

Dynamodb is a great NoSQL service by AWS. Often it's required to export data from the dynamodb table .


First, let us review our use case. Our lambda function will read from table from dynamodb and export JSON to s3.


| <img align="center" src="{{ root_url }}/img/dynamodbexport.png" alt="" /> |


## Using boto3 resource

<br>

<script src="https://gist.github.com/tushar-sharma/71d7b985435d2719d73dbf927e2c966a.js"></script>


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


<script src="https://gist.github.com/tushar-sharma/4d5c8a61cae95198e6033789e5dd604d.js"></script>

## Using boto3 client

Another way to export data is to use boto3 client. It's a low level AWS services. 

<script src="https://gist.github.com/tushar-sharma/2d8898fd4ae7cd629657d9a241c7d829.js"></script>



However boto3 client will generates dynamodb JSON. A simple python script to convert it back to normalized JSON using `dynamodb_json` library.


```python
import time
import uuid
from datetime import datetime
from decimal import Decimal

from dynamodb_json import json_util as json2
import json
import sys

filename = sys.argv[1]
output = sys.argv[2]

with open(filename) as f:
    data = json.load(f)
	
data_new = json2.load(data)

with open(output, 'w') as outfile:
    json.dump(data_new, outfile)

```

<nav class="pagination clear" style="padding-bottom:20px;">
{% if page.previous.url %} <a class="prev-item" href="{{page.previous.url}}" title="Previous Post: {{page.previous.title}}">&larr;Previous</a>   {% endif %}  {% if page.next.url %}<a class="next-item" href="{{page.next.url}}" title="Next Post: {{page.next.title}}">Next&rarr;</a>         {% endif %}
</nav>
