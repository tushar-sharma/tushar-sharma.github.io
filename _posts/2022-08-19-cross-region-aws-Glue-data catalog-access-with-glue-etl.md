---
published: false
---

I have a Glue ETL job in a region us-west-2 that reads from database from AWS Glue Data Catalog from that region. Example

datasource0 = glueContext.create_dynamic_frame.from_catalog(database='my-database',
                                                            table_name='my-table');
I want to access AWS Glue Catalog cross region using glue job. So how can glue job in us-west-2 read AWS Glue database from us-east-1 belonging to the same account number?


dyf_parq = glueContext.create_dynamic_frame_from_options(connection_type = "s3", connection_options = {"paths": ["s3://s3-glue/testing-parquet"], "recurse"=True}, format = "parquet")

