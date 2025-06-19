---
layout: post
title: "Getting Started with Redis: Concepts, Commands, and Monitoring"
tags: [redis, nosql, python]
author: tushar sharma
skipImage: true
img: https://unsplash.com/photos/qkfxBc2NQ18/download?w=437
thumb: https://unsplash.com/photos/qkfxBc2NQ18/download?w=437
---

## Introduction

Redis is a in-memory NoSQL database mainly used for caching. It's a key-value store which means each unique keys map to a value which could be either a stirng, list, set, hash, blob, JSON or any other data. Each keys are unique and can be queried.<!-- truncate_here --> 

Redis is a in-memory NoSQL database mainly used for caching. It's a key-value store which means each unique keys map to a value which could be either a stirng, list, set, hash, blob, JSON or any other data. Each keys are unique and can be queried.

## Connecting to a Redis Cluster

To connect to a Redis cluster securely using the command line, you can use the `redis-cli` tool with TLS and authentication:



{% template  customCode.html %}
---
id: 9e3075f5b90a37f78de2a38c80a13c48
file: ex1.sh
---
{% endtemplate %}

## Common Redis Operations

Common redis operations across different data types:

###  String Operations

Strings are the simplest Redis data type. A Redis string value can be up to 512 MB in size

{% template  customCode.html %}
---
id: 9e3075f5b90a37f78de2a38c80a13c48
file: ex2.sh
---
{% endtemplate %}

### List Operations

Redis Lists are implemented as linked lists, optimized for fast insertions and deletions from both ends.

{% template  customCode.html %}
---
id: 9e3075f5b90a37f78de2a38c80a13c48
file: ex3.sh
---
{% endtemplate %}

### Hash Operations

Hashes are maps between string fields and string values, ideal for representing objects.

{% template  customCode.html %}
---
id: 9e3075f5b90a37f78de2a38c80a13c48
file: ex4.sh
---
{% endtemplate %}

### Set Operations

Sets are unordered collections of unique strings. They support powerful set algebra operations.

{% template  customCode.html %}
---
id: 9e3075f5b90a37f78de2a38c80a13c48
file: ex5.sh
---
{% endtemplate %}

### Sorted Set Operations

Sorted Sets are similar to Sets but with an associated score that allows ordering.

{% template  customCode.html %}
---
id: 9e3075f5b90a37f78de2a38c80a13c48
file: ex6.sh
---
{% endtemplate %}

## Key Management & Expiration

Redis allows setting time-to-live (TTL) on keys and inspecting their status.

{% template  customCode.html %}
---
id: 9e3075f5b90a37f78de2a38c80a13c48
file: ex7.sh
---
{% endtemplate %}

## Monitoring Redis Memory Usage

Use the `INFO MEMORY` command to inspect memory consumption:

{% template  customCode.html %}
---
id: 9e3075f5b90a37f78de2a38c80a13c48
file: ex8.sh
---
{% endtemplate %}


## Subscribing to Keyspace Events

Redis provides a pub/sub mechanism to monitor events such as key updates, deletions, and expirations. To subscribe to all events under the myApp namespace:

{% template  customCode.html %}
---
id: 9e3075f5b90a37f78de2a38c80a13c48
file: ex9.sh
---
{% endtemplate %}


### Automating Event Monitoring with Python


You can automate monitoring of Redis keyspace events using Python and the `redis` library. The following script connects to Redis, subscribes to a pattern, and logs events to both a file and the console:

{% template  customCode.html %}
---
id: 9e3075f5b90a37f78de2a38c80a13c48
file: ex10.py
---
{% endtemplate %}

### **Sample Output:**

{% template  customCode.html %}
---
id: 9e3075f5b90a37f78de2a38c80a13c48
file: ex11.txt
---
{% endtemplate %}
