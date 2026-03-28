---
layout: post
title:  Spotless Tutorial for Spring Boot
category: blog
tags:
- java
- spring boot
name: canton-oauth-fix
thumb: https://unsplash.com/photos/_mX0sSpVbOg/download?w=437
image: https://unsplash.com/photos/_mX0sSpVbOg/download?w=437
published: false
---

In team development, code formatting inconsistencies lead to : 

- Noisy diff : whitespaces changes pollute pull requests
- merge conflicts: Different IDE settings cause formatting wars
- Technical debt: Inconsistent styel makes code harder to read

Spotless

- Enforce consistent formatting

- Automatically fixes code before commits


Lets create a spring boot project

```
curl https://start.spring.io/starter.tgz \
  -d dependencies=web \
  -d type=gradle-project \
  -d language=java \
  -d bootVersion=4.0.4 \
  -d baseDir=spotless-demo \
  -d groupId=com.example \
  -d artifactId=spotless-demo | tar -xzvf -

cd spotless-demo
```

**Or manually via [start.spring.io](https://start.spring.io/):**
- Project: Gradle - Groovy
- Language: Java
- Spring Boot: 4.0.4
- Dependencies: Spring Web
- Group: `com.example`
- Artifact: `spotless-demo`
- Java: 21

## Create Sample Java Files

Create `src/main/java/com/example/spotlessdemo/controller/UserController.java`:

```java
package com.example.spotlessdemo.controller;

import org.springframework.web.bind.annotation.*;
import java.util.*;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private List<String> users = new ArrayList<>();

    @GetMapping
    public List<String> getUsers()
    {
        return users;
    }

    @PostMapping
    public void addUser(@RequestBody String user) {
        users.add(user);
    }

    @DeleteMapping("/{id}")
    public void deleteUser(@PathVariable int id){
        if(id<users.size()){
            users.remove(id);
        }
    }
}
```

now run the build it would be successful even the there are formatting inconsistencies.

```
./gradlew clean build
Build Successful
````

Add **Spotless** to build.gradle

```
plugins {
    id 'java'
    id 'org.springframework.boot' version '3.2.0'
    id 'io.spring.dependency-management' version '1.1.4'
    id 'com.diffplug.spotless' version '7.0.2'  // Add this
}

group = 'com.example'
version = '0.0.1-SNAPSHOT'

java {
    sourceCompatibility = '17'
}

repositories {
    mavenCentral()
}

dependencies {
    implementation 'org.springframework.boot:spring-boot-starter-web'
    testImplementation 'org.springframework.boot:spring-boot-starter-test'
}

// Spotless configuration
spotless {
    encoding 'UTF-8'

    java {
        // Use Google Java Format with AOSP style (4-space indent)
        googleJavaFormat().aosp()

        // Remove unused imports
        removeUnusedImports()

        // Trim trailing whitespace
        trimTrailingWhitespace()

        // Ensure file ends with newline
        endWithNewline()

        // Optional: Target specific files
        target 'src/**/*.java'
    }
}

tasks.named('test') {
    useJUnitPlatform()
}
```

now build the gradle again

```

> Task :spotlessJavaCheck FAILED

FAILURE: Build failed with an exception.

* What went wrong:
Execution failed for task ':spotlessJavaCheck'.
> The following files had format violations:
      src/main/java/com/example/spotless_demo/SpotlessDemoApplication.java
          @@ -6,8 +6,7 @@
           @SpringBootApplication
           public·class·SpotlessDemoApplication·{

```

You can fix it using 

```
# Check formatting (without changing files)
./gradlew spotlessCheck

# Apply formatting
./gradlew spotlessApply
```
```