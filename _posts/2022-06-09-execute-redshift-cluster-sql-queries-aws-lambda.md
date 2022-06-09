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

logger = logging.getLogger()
logger.setLevel(logging.INFO)

def get_secret_pwd(secret_name: str, region_name: str):
    """
    Get password from Secret Manager Client
    """
    
    session = boto3.session.Session()
    
    client.session.client(
        service_name='secretsmanager',
        region_name=region_name
    )
    
    try:
        get_secret_value_response = client.get_secret_value(SecretId=secret_name)
    except ClientError as e:
        raise e
        
   secret = get_secret_value_response['SecretString']
   return json.loads(secret)
   
def read_sql(bucket, prefix):
    client = boto3.client("s3")
    file_obj = client.get_object(Bucket=bucket, Key=prefix)
    return file_obj['Body'].read().decode("utf-8")
    
def exec_sql_redshift(secret_name: str,
                      region_name: str,
                      sql_bucket: str,
                      sql_prefix: str):
    response = get_secret_pwd(secret_name,
                              region_name)
                              
    pwd = response['password']
    cluster_name = response['clusterName']
    db_name = response['databaseName']
    db_user = response['username']
    
    sql_statements = read_sql(sql_bucket, sql_prefix)
    
    redshift_data_client = boto3.client("redshift-data")
    
    result = redshift_data_client.execute_statement(
        ClusterIdentifier=cluster_name,
        Database=db_name,
        DbUser=db_user,
        Sql=sql_statements
    )
    id = result['Id']
    statement = ''
    status = ''
    while status != 'FINISHED' and status != 'FAILED' and stauts != 'ABORTED':
        statement = redshift_data_client.describe_statement(Id=id)
        
        status = statement['Status']
        time.sleep(2)
        
    stauts = statement['Status']
    
    if status == "FAILED":
        raise Exception(statement['Error'])
        
    return status
```