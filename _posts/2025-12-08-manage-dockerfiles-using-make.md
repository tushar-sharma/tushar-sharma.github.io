---
layout: post
title: Manage Your Dockerfiles Using Make
image: 'https://unsplash.com/photos/S7u9sJ1gvqY/download?w=437'
thumb: 'https://unsplash.com/photos/S7u9sJ1gvqY/download?w=437'
author: Tushar Sharma
category: blog
tags:
  - docker
  - devops
---

Managing multiple `docker-compose` projects can become cumbersome. If you have separate services like Postgres, Kafka, and others, each with its own `docker-compose.yml`, running commands across them can be repetitive. In this post, we'll explore a neat way to simplify this using a master `Makefile`.<!-- truncate_here -->

The idea is to have a single entry point to start and stop all your services, without having to `cd` into each directory.

### Project Structure

Let's organize our project like this:

```
masterImages/
├── Makefile
├── postgres/
│   ├── docker-compose.yml
│   ├── init-scripts/
│   │   └── 01-init-schema.sql
│   └── Makefile
└── kafka/
    ├── docker-compose.yml
    └── Makefile
```

The `masterImages` directory will contain our master `Makefile` and subdirectories for each service.

### The Master Makefile

First, create the `masterImages` directory and the main `Makefile` within it.

```bash
mkdir masterImages
cd masterImages
touch Makefile
```

Now, add the following content to the `masterImages/Makefile`:

```makefile
.PHONY: start stop

start:
	@$(MAKE) -C $(filter-out $@,$(MAKECMDGOALS)) start

stop:
	@$(MAKE) -C $(filter-out $@,$(MAKECMDGOALS)) stop

%:
    @:
```

This master `Makefile` is the heart of our setup. It redirects `make` commands to the `Makefile` inside the respective service directory. For instance, `make postgres start` will execute the `start` target in the `postgres/Makefile`.

### Postgres Service

Now, let's set up the `postgres` service.

```bash
mkdir -p postgres/init-scripts
cd postgres
touch Makefile docker-compose.yml init-scripts/01-init-schema.sql
```

#### Postgres Makefile

The `postgres/Makefile` is simple:

```makefile
.PHONY: start stop

start:
	docker compose up

stop:
	docker compose down
```

#### Postgres Docker Compose

Here is the content for `postgres/docker-compose.yml`:

```yaml
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
```

#### Postgres Init Script

And the initialization script `postgres/init-scripts/01-init-schema.sql`:

```sql
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

### Kafka Service

Similarly, for the `kafka` service:

```bash
mkdir kafka
cd kafka
touch Makefile docker-compose.yml
```

#### Kafka Makefile

The `kafka/Makefile` is identical to the Postgres one:

```makefile
.PHONY: start stop

start:
	docker compose up

stop:
	docker compose down
```

#### Kafka Docker Compose

And the `kafka/docker-compose.yml`:

```yaml
version: '2.1'

services:

  zookeeper:
    image: confluentinc/cp-zookeeper:7.7.0
    container_name: zookeeper
    ports:
      - 2181:2181
    environment:
      ZOOKeeper_CLIENT_PORT: 2181
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

### Usage

Now, from the `masterImages` directory, you can manage your services like this:

To start the Postgres service:
```bash
make postgres start
```

To stop the Postgres service:
```bash
make postgres stop
```

To start the Kafka cluster:
```bash
make kafka start
```

And to stop it:
```bash
make kafka stop
```

This approach keeps your projects organized and makes them easy to manage from a single place.
