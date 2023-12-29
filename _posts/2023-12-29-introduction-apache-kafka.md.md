---
layout: post
title: Introduction to Apache Kafka
image: /img/
thumb: /img/
author: Tushar Sharma;
category: blog
tags: kafka
---

Kafka, at its core, is a **distributed commit log**. A log (a.k.a. {write-ahead, commit, transaction} log) is the simplest data structure. It’s an ordered structure that only supports appends. It’s immutable - you can’t edit or delete records in place.<!-- truncate_here -->

Kafka, at its core, is a **distributed commit log**. A log (a.k.a. {write-ahead, commit, transaction} log) is the simplest data structure. It’s an ordered structure that only supports appends. It’s immutable - you can’t edit or delete records in place.

### Consumer

Consumers read data from topic. Each consumer belongs to a specific consumer group, identified by a unique group id. Topics in Kafka are divided into partitions. Partitions allow for the data within a topic to be split and stored across multiple nodes in a Kafka cluster, enabling parallel consumption and providing fault tolerance.
 
When a consumer connects to a broker (bootstrap server), it's essentially connecting to the entire Kafka cluster. This is because Kafka brokers work together to create a distributed system, and any one broker can serve as the entry point to the system.

In a single partition, a consumer reads records in the order they were produced. However, with multiple partitions, consumers in the same group can read from different partitions in parallel, substantially increasing the overall read throughput.

If you have only two partition in a topic then : 

1. If you have three consumers with same group id (means they belong to same consumer group) , only two of them will be active, each consuming from one partition.

2. If you have three consumers with different group id, all three will be active.

If your goal is maximize paralleism and throughput, it's beneficial to have at least as many partitions as there are consumers.

### Consumer Offset

Kakfa stores the offset at which a consumer group has been reading. The offset is commited in kafka topic named `__consumer_offsets`.

### Producer

When a producer publishes to kafka topic without a key, it uses a round-robin strategy to distribute the messages evenly accross all partitions. This means that the first message goes to the first partition, the second message goes to the second partition, and so on. When the last partition is reached, the next message goes back to the first partition, hence the term "round-robin".

When a producer uses a key, each key is hashed and hash is used to determine the partition to which the message needs to be sent. ˇThis ensures that all messages with same key always end up in same partition to maintain the order.
