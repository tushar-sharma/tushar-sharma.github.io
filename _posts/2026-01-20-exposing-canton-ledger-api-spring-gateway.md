---
layout: post
title: Exposing Canton Ledger API via Spring Cloud Gateway
image: https://unsplash.com/photos/1tpLdmxki-c/download?w=437
thumb: https://unsplash.com/photos/1tpLdmxki-c/download?w=437
author: Tushar Sharma
category: blog
tags:
  - spring
  - kubernetes
  - gateway
  - canton
image: https://unsplash.com/photos/1tpLdmxki-c/download?w=437
thumb: https://unsplash.com/photos/1tpLdmxki-c/download?w=437
skipImage: true
---

Exposing the Canton Ledger API from Kubernetes Pods Using Spring Cloud Gateway. <!-- truncate_here -->

Exposing the Canton Ledger API from Kubernetes Pods Using Spring Cloud Gateway. 

## The Problem

The Canton Ledger API (also known as the JSON API) provides a RESTful interface to interact with the Canton distributed ledger. By default, it runs on port `7575` inside the pod.

You can verify it's working by executing a shell into the pod and running:

{% template customCode.html %}
---
id: 5ed82057f90f950fbf4aa5b9c3f2e031
file: curl.sh 
---
{% endtemplate %}


This returns a JSON response with version and feature information:

{% template customCode.html %}
---
id: 5ed82057f90f950fbf4aa5b9c3f2e031
file: payload.json 
---
{% endtemplate %}

## The Challenge: Accessing the Service Externally

How do you access this service from outside the pod? There are two main approaches:

1. **Expose port 7575 directly** - This is often not feasible because most non-standard ports are blocked for security reasons.

2. **Use Spring Cloud Gateway** - Route traffic through the gateway on port `8080`, which is typically already exposed.

The second approach is more secure and flexible, so let's implement that.

## Solution: Configure Spring Cloud Gateway

Add the following route configuration to your `scg.yaml` file:

{% template customCode.html %}
---
id: 5ed82057f90f950fbf4aa5b9c3f2e031
file: scg.yaml
---
{% endtemplate %}

### Understanding the Configuration

Let's break down each part:

| Property | Description |
|----------|-------------|
| `id` | A unique identifier for this route |
| `uri` | The internal Kubernetes service URL where the JSON API is running (see note below) |
| `predicates` | Conditions that must match for the route to be used. Here, any request starting with `/json-api/` will match |
| `filters` | Transformations applied to the request. `RewritePath` removes the `/json-api` prefix before forwarding |

> **What is `svc.cluster.local`?**
>
> Kubernetes provides built-in DNS for service discovery. Every service gets a DNS name following the pattern:
>
> ```
> <service-name>.<namespace>.svc.cluster.local
> ```
>
> - `svc` indicates this is a Service resource
> - `cluster.local` is the default cluster domain
>
> This allows pods to communicate with services by name without hardcoding IP addresses. The DNS is only resolvable from within the Kubernetes cluster.

### How It Works

1. A request comes in to the gateway: `GET /json-api/v2/version`
2. The predicate matches because the path starts with `/json-api/`
3. The `RewritePath` filter transforms `/json-api/v2/version` to `/v2/version`
4. The gateway forwards the request to the internal service on port 7575

### Testing the Route

After deploying the configuration, you can access the JSON API through the gateway:

{% template customCode.html %}
---
id: 5ed82057f90f950fbf4aa5b9c3f2e031
file: curl2.sh
---
{% endtemplate %}


This will return the same version information as before, but now accessible from outside the pod. 