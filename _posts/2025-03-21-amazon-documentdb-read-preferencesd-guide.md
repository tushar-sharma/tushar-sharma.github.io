---
layout: post
title: Amazon DocumentDB Read Preferences Guide
image: https://unsplash.com/photos/Nw-zEo99004/download?w=437
thumb: https://unsplash.com/photos/Nw-zEo99004/download?w=437
author: tushar sharma
category: blog
tags:
 - mongodb
 - documentdb
 - aws
---

Amazon DocumentDB is a fully managed, MongoDB-compatible database service provided by AWS. It replicates data six times across three Availability Zones (two copies per zone) for high durability and availability.<!-- truncate_here -->

Amazon DocumentDB is a fully managed, MongoDB-compatible database service provided by AWS. It replicates data six times across three Availability Zones (two copies per zone) for high durability and availability.

### Connection String Example with Read Preferences

Specify read preferences directly in the connection string:

```bash
mongodb://host:port/database?readPreference=secondaryPreferred
```

### Consistency Tradeoffs

NoSQL databases like DocumentDB often use eventual consistency by default. This means reads immediately after writes might return stale data, as updates propagate asynchronously to replicas. This design prioritizes availability and scalability over strict consistency. You can override this behavior using read preferences, though this may impact scalability.

| Read Preference Mode | Consistency                          | Behavior                                                                 | Use Case                          | Consideration                                                                 |
|----------------------|--------------------------------------|--------------------------------------------------------------------------|-----------------------------------|-------------------------------------------------------------------------------|
| **primaryPreferred** | Read-after-write consistency        | - Routes reads to primary by default<br>- Fails over to replicas if unavailable | Critical reads requiring fresh data | Creates primary bottleneck (not ideal for read-heavy workloads)       |
| **secondaryPreferred** | Eventual consistency               | - Prioritizes replica reads<br>- Uses primary only if replicas unavailable     | Read scaling & high availability  | Distributes read traffic across replicas                                |
| **nearest**          | Variable (depends on replication lag) | - Selects lowest-latency nodes<br>- Uses both primary and secondary nodes      | Latency-sensitive applications    | Fast responses but potentially stale data                              |