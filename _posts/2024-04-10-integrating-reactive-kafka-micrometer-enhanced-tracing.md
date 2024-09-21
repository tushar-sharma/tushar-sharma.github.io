---
layout: post
title: Integrating Reactive Kafka with Micrometer for Enhanced Tracing
image: 'https://unsplash.com/photos/jAJZfSh4rXU/download?w=437'
thumb: 'https://unsplash.com/photos/jAJZfSh4rXU/download?w=437'
author: Tushar Sharma
category: blog
published: false
tags:
 - kafka
---

Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.<!-- truncate_here -->

### Create Consumer Project

### Create Producer Project

### Run Zipkins

```bash
$ docker run -p 9411:9411 openzipkin/zipkin
```

### Run kafka locally

Copy this `docker-compose.yaml` 

{% template  customCode.html %}
---
id: 4c71b625acb564e86fd80c2ede8ae138
file: kafka-docker-compose.yaml
---
{% endtemplate %}


```bash
$  docker compose up
```