---
layout: post
title: Mastering JSON in Java
image: https://unsplash.com/photos//download?w=437
thumb: https://unsplash.com/photos//download?w=437
author: tushar sharma
category: blog
---

Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.<!-- truncate_here -->

- JSON is format is used to exchange information with REST APIs

- Java library Jackson for processing JSON

- Jackson has ObjectMapper, JsonNode, ObjectNode, ArrayNode

- ObjectMapper converst JSON string to Java Objects

```java
String jsonString = "{\"name\": \"Alice\", \"age\": 30, \"address\": {\"street\": \"123 Maple Street\", \"city\": \"Wonderland\"}, \"isActive\": true}";

ObjectMapper objectMapper = new ObjectMapper();

JsonNode jsonObject = objectMapper.readTree(jsonString);

// print jsonObject.get("name").asText();
// print jsonbObject.get("address").asText();
```

with `ObjectNode` we can add / modify objects

```java
ObjectNode jsonObject = objectMapper.createObjectNode();
jsonObject.put("name", "Tom");
jsonObject.put("age", 30);
```

### Convert JSON to Java Objects

```java
class Person {
   private String name;
   private int age;
}

String jsonString = "{\"name\": \"Tom\", \"age\": 30}";

Person person = objectMapper.readValue(jsonStrong, Person.class);
```

### Java Object to JSON

You can serialize Java object into a JSON string 

```java
String jsonOutput = objectMapper.writeValueAsString(person);

```

### Mastering JSON with Path Expression

Jackson's `JsonNode` allows you to use `.path()` for retreiving nested data without worrying about nulls.

example?
