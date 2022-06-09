---
published: false
---
## Execute Redshift Cluster SQL Queries using AWS Lambda

First we will define we helper functions. First to read sequence of sql queries to be executed in redshift cluster. We will store this text file in `s3 bucket`. The content of the file would be 

```sql
drop materialized view if exists my_view;

create materialized view my_view as 
select name
from my_table;
```

We will then create a function to read the sql file from s3

```python
import json 
import boto3 
import os
import logging
import botocore
from datetime import datetime, timezone
import traceback 
import time
import base64
from botocore.exceptions import ClientError


```