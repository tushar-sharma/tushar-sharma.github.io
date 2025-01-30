---
layout: post
title: Mapping YAML to Configuration classes in Spring Boot
image: https://unsplash.com/photos/TXxiFuQLBKQ/download?w=437
thumb: https://unsplash.com/photos/TXxiFuQLBKQ/download?w=437
author: tushar sharma
category: blog
tags:
 - spring boot
 - java
---

Spring Boot provides an elegant way to bind YAML configurations directly to Java classes using the `@ConfigurationProperties` annotation. This tutorial will walk you through the basics and show you how to map a nested YAML structure to a configuration class.<!-- truncate_here -->

Spring Boot provides an elegant way to bind YAML configurations directly to Java classes using the `@ConfigurationProperties` annotation. This tutorial will walk you through the basics and show you how to map a nested YAML structure to a configuration class.

## Prerequisites
1. **Spring Boot project**: If you don't have a project ready, you can create one using [Spring Initializr](https://start.spring.io/).

---

### YAML Example
Consider the following YAML structure:

```yaml
access:
  projects:
    - allowedAccess: t1
      allowedGroup: 
        - m1
        - m2
    - allowedAccess: t2
      allowedGroup: 
        - m2
        - m3
```

In this YAML:
- `access.projects` is a list of project configurations.
- Each project has `allowedAccess` (a string) and `allowedGroup` (a list of strings).

---

### Step 1: Adding Dependencies
Ensure you have the following dependency in your `pom.xml` (if using Maven):

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-configuration-processor</artifactId>
    <optional>true</optional>
</dependency>
```

This dependency generates metadata for configuration properties, making it easier to manage properties in the IDE.

---

### Step 2: Define the Configuration Class
To bind the YAML structure, create a configuration class using the `@ConfigurationProperties` annotation.

```java
package com.example.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Configuration
@ConfigurationProperties(prefix = "access")
@Getter
@Setter
public class Config {

    private List<Project> projects;

    @Getter
    @Setter
    public static class Project {
        private String allowedAccess;
        private List<String> allowedGroup;
    }
}
```

#### Explanation:
1. **`@ConfigurationProperties("access")`**: Maps properties under the `access` key in the YAML file.
2. **Nested Class `Project`**: Represents the structure of each project entry in the `projects` list.
3. **Lombok Annotations**:
   - `@Getter` and `@Setter` reduce boilerplate code for getters and setters.
   - Ensure Lombok is configured in your project.

---

### Step 3: Enable Configuration Properties
Annotate your main application class with `@EnableConfigurationProperties` to enable configuration property binding.

```java
package com.example;

import com.example.config.Config;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.EnableConfigurationProperties;

@SpringBootApplication
@EnableConfigurationProperties(Config.class)
public class Application {
    public static void main(String[] args) {
        SpringApplication.run(Application.class, args);
    }
}
```

---

### Step 4: Using the Configuration in Your Application
You can now inject and use the configuration in any Spring component.

#### Example Usage:

```java
package com.example.service;

import com.example.config.Config;
import org.springframework.stereotype.Service;

@Service
public class ProjectService {

    private final Config config;

    public ProjectService(Config config) {
        this.config = config;
    }

    public void printProjects() {
        for (Config.Project project : config.getProjects()) {
            System.out.println("Allowed Access: " + project.getAllowedAccess());
            System.out.println("Allowed Groups: " + project.getAllowedGroup());
        }
    }
}
```

#### Output:
For the provided YAML, the output will be:

```
Allowed Access: t1
Allowed Groups: [m1, m2]
Allowed Access: t2
Allowed Groups: [m2, m3]
```

---

### Key Benefits
1. **Type Safety**: Configuration values are bound directly to strongly typed Java objects.
2. **Centralized Configuration**: Manage all project-specific configurations in one place.
3. **Flexibility**: Easy to extend or modify as the YAML structure changes.

---

### Common Pitfalls
1. **Ensure YAML indentation is correct**: Misaligned spaces can cause parsing errors.
2. **Dependency management**: Ensure the `spring-boot-configuration-processor` is included for better development experience.
3. **Lombok setup**: Verify Lombok is properly configured in your IDE.

---

### Conclusion
Using `@ConfigurationProperties` in Spring Boot is a powerful way to manage hierarchical configurations. By following this tutorial, you can effectively bind YAML properties to Java classes and use them in your application. Happy coding!

---

**References:**
- [Spring Boot Documentation](https://docs.spring.io/spring-boot/docs/current/reference/htmlsingle/)
