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

{% template  customCode.html %}
---
id: 99fd2473fc4531b4158281654c7ff613
file: Makefile
---
{% endtemplate %}

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

{% template  customCode.html %}
---
id: 99fd2473fc4531b4158281654c7ff613
file:  MakefilePostgres 
---
{% endtemplate %}

#### Postgres Docker Compose

Here is the content for `postgres/docker-compose.yml`:

{% template  customCode.html %}
---
id: 99fd2473fc4531b4158281654c7ff613
file:  postgress.yaml
---
{% endtemplate %}


#### Postgres Init Script

And the initialization script `postgres/init-scripts/01-init-schema.sql`:

{% template  customCode.html %}
---
id: 99fd2473fc4531b4158281654c7ff613
file:  01-init-schema.sql
---
{% endtemplate %}



### Kafka Service

Similarly, for the `kafka` service:

```bash
mkdir kafka
cd kafka
touch Makefile docker-compose.yml
```

#### Kafka Makefile

The `kafka/Makefile` is identical to the Postgres one:

{% template  customCode.html %}
---
id: 99fd2473fc4531b4158281654c7ff613
file:  MakefilePostgres 
---
{% endtemplate %}

#### Kafka Docker Compose

And the `kafka/docker-compose.yml`:

{% template  customCode.html %}
---
id: 99fd2473fc4531b4158281654c7ff613
file:  kafkaDockerCompose.yaml
---
{% endtemplate %}



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