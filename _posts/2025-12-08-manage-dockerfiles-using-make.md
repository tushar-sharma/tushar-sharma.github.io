---
layout: post
title: Manager your docker files using make
image: 'https://unsplash.com/photos//download?w=437'
thumb: 'https://unsplash.com/photos//download?w=437'
author: null
category: blog
published: false
---

Dear Vishi, dear logs for today.<!-- truncate_here --	>

Dear Vishi, dear logs for today.


Create a folder `masterImages`. 

```bash
cd masterImages
cd $_
touch Makefile
```

Create a Makefile with following content

```
.PHONY: start stop

start:
	@$(MAKE) -C $(filter-out $@,$(MAKECMDGOALS)) start

stop:
	@$(MAKE) -C $(filter-out $@,$(MAKECMDGOALS)) stop

%:
    @:

```

lets create a postgres image

```bash
mkdir postgres
cd $_
Makefile

.PHONY: start

start:
        docker compose up

.PHONY: stop

stop:
        docker compose down

```

and docker-compose

```
version: '3.8'
services:
  postgres:
    image: postgres:17
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
      POSTGRES_DB: postgres
      POSTGRES_SCHEMA: digitalassets
    ports:
      - '5432:5432'
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./init-scripts:/docker-entrypoint-initdb.d

volumes:
  postgres_data:

cat init-scripts/01-init-schema.sql
-- Create the schema
CREATE SCHEMA IF NOT EXISTS mySchema;

-- Grant all permissions to postgres user
GRANT ALL PRIVILEGES ON SCHEMA mySchema TO postgres;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA mySchema TO postgres;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA mySchema TO postgres;
GRANT ALL PRIVILEGES ON ALL FUNCTIONS IN SCHEMA mySchema TO postgres;

-- Set default search path for postgres user
ALTER USER postgres SET search_path TO mySchema,public;
```

kakfa

````
mkdir -p kakfa
version: '2.1'

services:

  zookeeper:
    image: confluentinc/cp-zookeeper:7.7.0
    container_name: zookeeper
    ports:
      - 2181:2181
    environment:
      ZOOKEEPER_CLIENT_PORT: 2181
      ZOOKEEPER_TICK_TIME: 2000

  kafka-1:
    image: confluentinc/cp-kafka:7.7.0
    ports:
      - "9092:9092"
    environment:
      KAFKA_BROKER_ID: 1
      KAFKA_ZOOKEEPER_CONNECT: zookeeper:2181
      KAFKA_ADVERTISED_LISTENERS: LISTENER_DOCKER_INTERNAL://kafka-1:19092,LISTENER_DOCKER_EXTERNAL://${DOCKER_HOST_IP:-127.0.0.1}:9092
      KAFKA_LISTENER_SECURITY_PROTOCOL_MAP: LISTENER_DOCKER_INTERNAL:PLAINTEXT,LISTENER_DOCKER_EXTERNAL:PLAINTEXT
      KAFKA_INTER_BROKER_LISTENER_NAME: LISTENER_DOCKER_INTERNAL
      KAFKA_LOG4J_ROOT_LOGLEVEL: ERROR
      KAFKA_CONFLUENT_SUPPORT_METRICS_ENABLE: "false"
      KAFKA_ALLOW_EVERYONE_IF_NO_ACL_FOUND: "true"
    depends_on:
      - zookeeper

  kafka-2:
    image: confluentinc/cp-kafka:7.7.0
    ports:
      - "9093:9093"
    environment:
      KAFKA_BROKER_ID: 2
      KAFKA_ZOOKEEPER_CONNECT: zookeeper:2181
      KAFKA_ADVERTISED_LISTENERS: LISTENER_DOCKER_INTERNAL://kafka-2:19093,LISTENER_DOCKER_EXTERNAL://${DOCKER_HOST_IP:-127.0.0.1}:9093
      KAFKA_LISTENER_SECURITY_PROTOCOL_MAP: LISTENER_DOCKER_INTERNAL:PLAINTEXT,LISTENER_DOCKER_EXTERNAL:PLAINTEXT
      KAFKA_INTER_BROKER_LISTENER_NAME: LISTENER_DOCKER_INTERNAL
      KAFKA_LOG4J_ROOT_LOGLEVEL: ERROR
      KAFKA_ALLOW_EVERYONE_IF_NO_ACL_FOUND: "true"
      KAFKA_CONFLUENT_SUPPORT_METRICS_ENABLE: "false"
    depends_on:
      - zookeeper

  kafka-3:
    image: confluentinc/cp-kafka:7.7.0
    ports:
      - "9094:9094"
    environment:
      KAFKA_BROKER_ID: 3
      KAFKA_ZOOKEEPER_CONNECT: zookeeper:2181
      KAFKA_ADVERTISED_LISTENERS: LISTENER_DOCKER_INTERNAL://kafka-3:19094,LISTENER_DOCKER_EXTERNAL://${DOCKER_HOST_IP:-127.0.0.1}:9094
      KAFKA_LISTENER_SECURITY_PROTOCOL_MAP: LISTENER_DOCKER_INTERNAL:PLAINTEXT,LISTENER_DOCKER_EXTERNAL:PLAINTEXT
      KAFKA_INTER_BROKER_LISTENER_NAME: LISTENER_DOCKER_INTERNAL
      KAFKA_LOG4J_ROOT_LOGLEVEL: ERROR
      KAFKA_ALLOW_EVERYONE_IF_NO_ACL_FOUND: "true"
      KAFKA_CONFLUENT_SUPPORT_METRICS_ENABLE: "false"
    depends_on:
      - zookeeper

```

makefile is : ```.PHONY: start

start:
        docker compose up

.PHONY: stop

stop:
        docker compose down```


make start postgress
make sstop postgress
make start kafka


