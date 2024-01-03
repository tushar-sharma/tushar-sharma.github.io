---
layout: post
title: Introduction to Apache Kafka
image: https://unsplash.com/photos/5xmFg-EGhpw /download?w=800
thumb: https://unsplash.com/photos/5xmFg-EGhpw/download?w=800
author: Tushar Sharma;
category: blog
tags: kafka
---

In the realm of distributed data processing, Apache Kafka shines as a powerful and versatile tool, serving as the backbone of many real-time data pipelines and event-driven architectures. At its core, Kafka is a distributed commit log - a concept that underpins its efficiency and reliability. <!-- truncate_here -->

Apache Kafka is a distributed commit log. Why distributed? It's distributed because the data is replicated across multiple nodes in a Kafka cluster. Why commit log? Once a entry is written to commit log, it becomes immutable - it means it cannot be altered or deleted.

