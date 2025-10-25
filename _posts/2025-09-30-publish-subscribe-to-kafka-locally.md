---
layout: post
title: Publish / Subscribe to Kafka locally
category: blog
thumb: https://unsplash.com/photos/w1IKykb2YmQ/download?w=437
image: https://unsplash.com/photos/w1IKykb2YmQ/download?w=437
tags:
 - kafka
 - kcat
 - docker
name: kafka-local-setup
summary: Complete guide to setting up Apache Kafka locally using Docker Compose with practical examples and production considerations
author: tushar sharma
---

Apache Kafka is a distributed streaming platform designed for building real-time data pipelines and streaming applications. Originally developed by LinkedIn, Kafka excels at handling high-throughput, fault-tolerant publish-subscribe messaging between systems.<!-- truncate_here -->

Apache Kafka is a distributed streaming platform designed for building real-time data pipelines and streaming applications. Originally developed by LinkedIn, Kafka excels at handling high-throughput, fault-tolerant publish-subscribe messaging between systems.

## Core Concepts

Before diving into the setup, let's understand Kafka's fundamental concepts:

- **Broker**: A Kafka server that stores and serves data
- **Topic**: A logical channel for organizing messages, similar to database tables
- **Partition**: Topics are split into partitions for scalability and parallelism
- **Producer**: Applications that publish messages to topics
- **Consumer**: Applications that subscribe to topics and process messages
- **Zookeeper**: Coordinates cluster metadata and leader election (being phased out in newer versions)

## Local Development Setup

For local development, we'll use Docker Compose to orchestrate Kafka and its dependencies. This approach provides isolated, reproducible environments without cluttering your system.

### Docker Compose Configuration

Our setup includes three services:
1. **Zookeeper** - Manages cluster coordination and configuration
2. **Kafka** - The main message broker
3. **Kafka-init** - Initializes topics and waits for Kafka readiness 


{% template  customCode.html %}
---
id: 73b1f793093ead650f00dbdc2d11d145
file: docker-compose.yml
---
{% endtemplate %}

### Configuration Breakdown

#### Zookeeper Service
- **ZOOKEEPER_CLIENT_PORT**: Port for client connections (standard is 2181)
- **ZOOKEEPER_TICK_TIME**: Basic time unit in milliseconds for heartbeats
- **Volumes**: Persistent storage for Zookeeper data and transaction logs

#### Kafka Service
Key environment variables explained:

- **KAFKA_BROKER_ID**: Unique identifier for this broker in the cluster
- **KAFKA_ZOOKEEPER_CONNECT**: Connection string to Zookeeper ensemble
- **KAFKA_ADVERTISED_LISTENERS**: How clients should connect to this broker
- **KAFKA_OFFSETS_TOPIC_REPLICATION_FACTOR**: Set to 1 for single-broker development
- **KAFKA_AUTO_CREATE_TOPICS_ENABLE**: Automatically creates topics when referenced

⚠️ **Important**: `ADVERTISED_LISTENERS` must match how you'll access Kafka. Use `localhost:9092` for local development.

#### Kafka-init Service
This utility container:
- Waits for Kafka to be fully ready
- Creates the `test-topic` with 1 partition and replication factor of 1
- Exits after initialization (restart: "no")

### Starting the Environment

```bash
docker compose up
```

Wait for all services to be ready. You should see logs indicating Kafka is accepting connections and the test-topic has been created.
