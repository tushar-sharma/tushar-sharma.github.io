---
layout: post
title: Optimizing SQL Queries - Understanding and Refreshing Materialized Views
image: https://unsplash.com/photos/PUvPZckRnOg/download?w=437
thumb: https://unsplash.com/photos/PUvPZckRnOg/download?w=437
tags:
  - sql
  - database
  - python
  - docker
author: Tushar Sharma
category: blog
---

When to use a materialized view? And how does it perform against a normal view. Benchmarking using docker.<!-- truncate_here -->

When to use a materialized view? And how does it perform against a normal view. Benchmarking using docker.

## What's a view?

A view is a virtual table based on a result-set of a SQL query. It's not physically materialized, the query is run every time the view is referenced.

## Materialized view

A materialized view is a physical table that contains the result of a query. It's used when the query is complex and involves large amounts of data, making it unfeasible to execute each time. Instead, results are pre-computed and stored in the view.

## Stale data

Data can become stale after a time in a materialized view. Since the data is pre-computed and stored, it can get out of sync with the underlying base tables if those tables are updated.

The concurrency option is more resource-intensive and might not be suitable for all scenarios.


## Solutions 

### Traditional refresh

Drop the old version of the view and replace it with new one. This can cause issues as it can block other queries from reading the view during the refresh process.

```sql
refresh materialized view view_name
```

### Concurrent refresh

Queries can read the view even when the view is getting refreshed as the update can be performed concurrently in the background. In order to use this approach, a unique index must be added to the materialized view. This unique index acts as a lookup table while the table is refreshing.

```sql
create unique index my_unique_index on test. programs(program_id);

refresh materialized view concurrently view_name;
```

##  Benchmarking with Docker

### Dockerfile

```dockerfile
FROM postgres:latest

RUN mkdir -p /data/postgres
COPY schema.sql /docker-entrypoint-initdb.d/

EXPOSE 5432
ENTRYPOINT ["docker-entrypoint.sh", "postgres"]
```

This `dockerfile` defines a container based on official PostgreSQL image. It creates a directory for persistent data and copies a schema file (containing the materialized view definition and sample data) to the initialization directory, ensuring the schema is applied when the container starts.

### schema.sql

This schema creates a courses table and a programs materialized view contianing the count of courses grouped by ID. Additionally, it defines a unique index on the course_id column of the materialized view, which is necessary for concurrent refresh.

```sql
create table courses (
 course_id serial primary key,
 course_name varchar(255) not null
);

create materialized view programs as 
    select c.course_id, count(*) as program_count
    from courses c 
    group by c.course_id;

create unique index idx_programs on programs(course_id);
```

### Deploy postgres container

Build and run the container using docker- 

```bash
$ docker build -t my_postgres_image .
$ docker run --name my_postgres_container -p 5432:5432 -e POSTGRES_PASSWORD=password my_postgres_image
```

### Install dependencies


```bash
$ python3 -m venv myenv 
$ . myenv/bin/activate
$ pip install psycopg2-binary
$ python benchmark.py
```

### Python script

{% template  customCode.html %}
---
id: 2089f8af1ba720e91e29e206a28f7430
file: benchmark.py
---
{% endtemplate %}

### Result

Traditional refresh are usually faster than concurrent refresh. However traditional refresh take longer time for queries due to lock mechanism.

```
***Traditional Refresh***
Refresh time:  1.312699794769287
Fetch time:  1.4531309604644775
***Concurrent Refresh***
Refresh time:  6.476271152496338
Fetch time:  1.2998201847076416
```