---
layout: post
title: Reference Memory in Claude
image: https://unsplash.com/photos/6uhTmirqHlA/download?w=437
thumb: https://unsplash.com/photos/6uhTmirqHlA/download?w=437
author: tushar sharma
published: false
tags: 
 - claude
category: blog
---

What's a reference memory in Claude? It's a persistent bookmark that tells calude to recall external knowledge for future sessions. Looks like a RAG. What could be trigger point for this? <!-- truncate_here -->

## What's a reference memory in Claude?

It's a persistent bookmark that tells calude to recall external knowledge for future sessions. Looks like a RAG. What could be trigger point for this? 

Zalando has a [github repo](git@github.com:zalando/restful-api-guidelines.git) for guidelines for API design. I want claude to leverage this everytime I working on API projects. 

First we will start with creating a sample Java API project and ask claude API questions. We expect generic answers

```bash
mkdir -p ~/myFiles/tutorial/api-experiment/

cd ~/myFiles/tutorial/api-experiment

curl https://start.spring.io/starter.tgz \
    -d dependencies=web,validation,lombok \
    -d javaVersion=21 \
    -d bootVersion=3.3.0 \
    -d groupId=com.example \
    -d artifactId=user-service \
    -d name=UserService \
    -d packageName=com.example.userservice \
    -d type=gradle-project | tar -xzf - 
```
