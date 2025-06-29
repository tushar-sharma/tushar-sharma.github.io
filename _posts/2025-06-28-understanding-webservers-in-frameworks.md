---
layout: post
title: Understanding Webservers in Frameworks
image: https://unsplash.com/photos/9CILN1ybspA/download?w=437
thumb: https://unsplash.com/photos/9CILN1ybspA/download?w=437
author: tushar sharma
category: blog
skipImage: true
tags: 
 - web server
---

Curious in understanding webservers role in popular frameworks.<!-- truncate_here -->

### FastAPI and Uvicorn

FastAPI is a modern, asynchronous web framework for building APIs.  
It requires an **ASGI-compatible web server** (like **Uvicorn**) to handle HTTP requests, since it doesn't include a server itself.  
Uvicorn is a high-performance ASGI server that supports asynchronous I/O and is well-suited for FastAPI.  
This contrasts with Django, which uses **WSGI** — a synchronous and blocking interface — making FastAPI more performant and scalable for concurrent workloads.

### Django and WSGI

Django includes a built-in development server based on **WSGI** (Web Server Gateway Interface), which is synchronous and blocking.  
This server is suitable for development but not recommended for production.  
For production, Django apps are typically served with servers like **Gunicorn** or **uWSGI**, often behind a reverse proxy like **Nginx**.

### Spring Boot

Spring Boot is a Java framework that includes an **embedded web server** by default, simplifying deployment:  
- For traditional servlet-based applications, it uses servers like **Apache Tomcat**, **Jetty**, or **Undertow**.  
- For reactive, non-blocking applications, it uses **Netty**, which supports asynchronous processing and backpressure.  

This flexibility allows Spring Boot to support both blocking (traditional) and reactive programming models.

### Angular

Angular is a frontend framework for building single-page applications (SPAs).  
It does **not** include a backend server; instead, it runs in the browser and communicates with backend APIs over HTTP.  
During development, Angular uses a development server (`ng serve`) powered by Webpack Dev Server to serve the frontend assets and enable live reload.  
In production, Angular apps are compiled into static files (HTML, JS, CSS) and served by any static file server or CDN.

### NestJS

NestJS is a Node.js backend framework built with TypeScript and inspired by Angular’s architecture.  
It supports multiple underlying HTTP servers:  
- By default, it uses **Express**, which is synchronous and callback-based (though async is supported).  
- It can also use **Fastify**, which is faster and supports async handlers.  
NestJS is modular and supports building scalable server-side applications, with support for WebSockets, microservices, and GraphQL.

