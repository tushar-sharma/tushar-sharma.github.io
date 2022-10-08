---
layout: post
title: Resolve the Error CROSSSLOT Keys in request don't hash to the same slot
category: blog
tags:
  - python
  - redis
  - memorydb
  - aws
featuredPost: true
summary: Resolve the Error CROSSSLOT Keys in request don't hash to the same slot
category: blog
image: 'https://unsplash.com/photos/kEFrAFKY6Sk/download?w=800'
thumb: 'https://unsplash.com/photos/kEFrAFKY6Sk/download?w=800'
author: Tushar Sharma
published: true
---

AWS offers managed service Amazon MemoryDB which is redis compatible. The entire keyspace in Redis cluster is divided into hash slots and these slots are assigned to multiple nodes. In redis, getting a single value is straightforward.<!-- truncate_here -->
<p>Tags: {% for tag in page.tags %} <a class="mytag" href="/tag/{{ tag }}" title="View posts tagged with &quot;{{ tag }}&quot;">{{ tag }}</a>  {% if forloop.last != true %} {% endif %} {% endfor %} </p>

AWS offers managed service Amazon MemoryDB which is redis compatible.. The entire keyspace in Redis cluster is divided into hash slots and these slots are assigned to multiple nodes. In redis-cli, getting a single value is straightforward


```bash
> mget "user1.key1"

> mget "user1.key2"
```

However if you want to run multi-operations in redis, 

```bash
> MULTI 
Queued
> EVAL "return redis.call('TIME')[1]" 0 0

> mget "user1.key1"

> mget "user1.key2"

> EVAL "return redis.call('TIME')[1]" 0 0

> EXEC

```

This would most likely will result in following error

```bash
(error) CROSSSLOT Keys in request don't hash to the same slot
```

## Solution 1

One solution is to force redis to insert the keys into same slot. We can achieve that using patter "{...}"

So we have to modify are keys as `{user1}.key1` and `{user1}.key2`. Here hash slots are only computed for keys within the braces

## Solution 2

We could simply use a python script if you dont want to modify your keys

<script src="https://gist.github.com/tushar-sharma/8873da1fe181ff7624be0d544310c560.js?file=conn.py"></script>