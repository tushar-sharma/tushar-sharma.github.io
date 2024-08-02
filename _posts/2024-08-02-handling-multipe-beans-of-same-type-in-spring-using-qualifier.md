---
layout: post
title: Handling Multiple Beans of the Same Type in Spring with Qualifier
image: 'https://unsplash.com/photos/FTFUli-xi3E/download?w=800'
thumb: 'https://unsplash.com/photos/FTFUli-xi3E/download?w=800'
author: tushar sharma
category: blog
tags:
 - spring boot
 - spring
---

In Spring application, it's common to have multiple beans of the same type. However, this can lead to issues when Spring tries to autowire these beans, as it doesn't know which bean to inject. This problem can be resolved using Qualifier annotation.<!-- truncate_here -->

In Spring application, it's common to have multiple beans of the same type. However, this can lead to issues when Spring tries to autowire these beans, as it doesn't know which bean to inject. This problem can be resolved using Qualifier annotation.  

## Problem of multiple beans

Suppose you have two beans of same type like 

{% template  customCode.html %}
---
id: d3879dba90ba8946da656b1d032913be
file: Bean1.java
---
{% endtemplate %}


When Spring encounters these beans, it will throw an error due to the ambiguity of which bean to autowire.

## Solution using Qualifier

To differentiate these beans, you can use the `@Qualifier` annotation. This annotation helps Spring identify which bean to inject when multiple beans of the same type exist.

### Define Beans with @Qualifier:


{% template  customCode.html %}
---
id: d3879dba90ba8946da656b1d032913be
file: Bean2.java
---
{% endtemplate %}

### Autowire Beans with Qualifier

Use the` @Qualifier` annotation to specify which bean to inject in your components:


{% template  customCode.html %}
---
id: d3879dba90ba8946da656b1d032913be
file: Bean3.java
---
{% endtemplate %}

Using the @Qualifier annotation in Spring allows you to manage multiple beans of the same type efficiently. By specifying unique qualifiers for each bean and using these qualifiers during autowiring, you can avoid conflicts and ensure your application runs smoothly.