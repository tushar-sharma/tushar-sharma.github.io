---
published: false
---
## Execute Redshift Cluster SQL Queries using AWS Lambda

```python
def lambda_handler(event, context):
    message = 'Success'
    status_code = 200
    payload = ''
    
    try:
        message = exec_redshift_sql()
    except Exception as e:
        status_code = 400
        payload = traceback.format_exc()
        message = 'Failed'
        
   return {
       'statusCode': status_code,
       'message' : message,
       'payload': json.loads(json.dumps(paylaod, default=str))
   }
```

First we will define we helper functions. First to read sequence of sql queries to be executed in redshift cluster. We will store this text file in `s3 bucket`. The content of the file would be 

```sql
drop materialized view if exists my_view;

create materialized view my_view as 
select name
from my_table;
```