---
published: false
---
---
layout: post
title: How to fetch million rows from database in python concurrently
category: blog
tags:
  - python
  - oracle
  - sybase
  - concurrency
name: python-kerberos-oracle
thumb: 
published: true
---

<p>Tags: {% for tag in page.tags %} <a class="mytag" href="/tag/{{ tag }}" title="View posts tagg1ed with &quot;{{ tag }}&quot;">{{ tag }}</a>  {% if forloop.last != true %} {% endif %} {% endfor %} </p>


I am trying to fetch data from oracle database into pandas dataframe. The database had 6 million rows. I was using something like this. 

```python

def get_conn(host, port, database, username, password, jar):
    
    dsn_tns = cx_Oracle.makedsn(host, port, database)
    
    return cx_Oracle.connect(user=username,
                             password=password,
                             dsn=dsn_tns)
                             
```

Then later I fetched the data as 

```python
def get_data(query, conn):
    return pd.read_sql(query, conn)
```

However this was very slow. I tried to optimize the get_data function as

```python
def get_data(query, conn):
    cur = conn.cursor()
    data = cur.execute(query).fetchall()
    
    return pd.DataFrame(data)
```

This helped me improved the performance by decreasing the execution time.