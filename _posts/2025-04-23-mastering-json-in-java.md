---
layout: post
title: Mastering JSON in Java using Jackson
image: https://unsplash.com/photos/aFXlb5vSpbw/download?w=437
thumb: https://unsplash.com/photos/aFXlb5vSpbw/download?w=437
author: tushar sharma
category: blog
tags:
 - java
---

JSON(Javascript Object Notation) is the universal language for data exchange in modern applications, particularly when working with REST APIs. In Java, <b>Jackson</b> library is often used for JSON processing. <!-- truncate_here -->

JSON(Javascript Object Notation) is the universal language for data exchange in modern applications, particularly when working with REST APIs. In Java, <b>Jackson</b> library is often used for JSON processing.

## Jackson Core Components

- **ObjectMapper**: Bridge between JSON and Java objects

- **JsonNode**: Tree model for dynamic JSON navigation

- **ObjectNode/ArrayNode**: Mutable JSON node builder

## Json Parsing fundamentals

### Parse JSON String 

{% template  customCode.html %}
---
id: b69b13dc8616b6b132e767b0f561ec3d
file: Json1.java
---
{% endtemplate %}

### Building JSON dynamically

Create new JSON object

{% template  customCode.html %}
---
id: b69b13dc8616b6b132e767b0f561ec3d
file: Json2.java
---
{% endtemplate %}

### Java Objects <-> JSON Conversion

**Deserialization (JSON -> Object)**

{% template  customCode.html %}
---
id: b69b13dc8616b6b132e767b0f561ec3d
file: Json3.java
---
{% endtemplate %}

**Serialization (Object -> JSON)**

{% template  customCode.html %}
---
id: b69b13dc8616b6b132e767b0f561ec3d
file: Json4.java
---
{% endtemplate %}

## Common Issues

### Date Handling

{% template  customCode.html %}
---
id: b69b13dc8616b6b132e767b0f561ec3d
file: Json5.java
---
{% endtemplate %}

**Don't forget** to register JavaTimeModule

{% template  customCode.html %}
---
id: b69b13dc8616b6b132e767b0f561ec3d
file: Json6.java
---
{% endtemplate %}

### Extra Getters

If the getter have no corresponding field, then deserialization would fail


{% template  customCode.html %}
---
id: b69b13dc8616b6b132e767b0f561ec3d
file: Json7.java
---
{% endtemplate %}

**Use Ignore Unknown Properties**

{% template  customCode.html %}
---
id: b69b13dc8616b6b132e767b0f561ec3d
file: Json8.java
---
{% endtemplate %}

**Or use Read-Only Properties**


{% template  customCode.html %}
---
id: b69b13dc8616b6b132e767b0f561ec3d
file: Json9.java
---
{% endtemplate %}
