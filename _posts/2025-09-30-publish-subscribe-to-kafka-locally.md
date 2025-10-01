---
layout: post
title: Publish / Subscribe to Kafka locally 
category: blog
tags:
 - kafka
 - kcat
 - docker
---

Here's a docker compose file 

```yaml 
version: '3.8'
services:
  zookeeper:
    image: confluentinc/cp-zookeeper:latest
    environment:
      ZOOKEEPER_CLIENT_PORT: 2181
      ZOOKEEPER_TICK_TIME: 2000
    ports:
      - '2181:2181'
    volumes:
      - zookeeper_data:/var/lib/zookeeper/data
      - zookeeper_logs:/var/lib/zookeeper/log

  kafka:
    image: confluentinc/cp-kafka:latest
    depends_on:
      - zookeeper
    environment:
      KAFKA_BROKER_ID: 1
      KAFKA_ZOOKEEPER_CONNECT: zookeeper:2181
      KAFKA_ADVERTISED_LISTENERS: PLAINTEXT://localhost:9092
      KAFKA_LISTENER_SECURITY_PROTOCOL_MAP: PLAINTEXT:PLAINTEXT
      KAFKA_INTER_BROKER_LISTENER_NAME: PLAINTEXT
      KAFKA_OFFSETS_TOPIC_REPLICATION_FACTOR: 1
      KAFKA_AUTO_CREATE_TOPICS_ENABLE: 'true'
    ports:
      - '9092:9092'
    volumes:
      - kafka_data:/var/lib/kafka/data

  kafka-init:
    image: confluentinc/cp-kafka:latest
    depends_on:
      - kafka
    entrypoint: [ '/bin/sh', '-c' ]
    command: |
      "
      # Wait for Kafka to be ready
      echo 'Waiting for Kafka to be ready...'
      while ! kafka-topics --bootstrap-server kafka:9092 --list > /dev/null 2>&1; do
        sleep 1
      done

      # Create test-topic
      echo 'Creating test-topic...'
      kafka-topics --bootstrap-server kafka:9092 --create --if-not-exists --topic test-topic --partitions 1 --replication-factor 1

      echo 'Topics created successfully!'
      "
    restart: "no"

volumes:
  zookeeper_data:
  zookeeper_logs:
  kafka_data:
```

Next start it up 

```bash 
docker compose up
```

Publish it 

```
echo '{"name": "Test", "status": false}' | kcat -P -b localhost:9092 -t test-topic
```

Subscribe it : 

```
kcat -C -b localhost:9092 -t test-topic
```
