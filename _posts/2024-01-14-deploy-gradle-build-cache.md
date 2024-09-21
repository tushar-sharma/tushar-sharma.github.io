---
layout: post
title: Optimizing Builds with Gradle Build Cache
image: 'https://unsplash.com/photos/5UNYknY0MTA/download?w=437'
thumb: 'https://unsplash.com/photos/5UNYknY0MTA/download?w=437'
author: Tushar Sharma
category: blog
published: true
tags:
  - gradle
  - java
---

Gradle build cache is an essential tool for optimizing build times in software development. By storing build outputs either locally or remotely, it significantly reduces the time and resources required for rebuilding similar tasks. This cache mechanism is especially beneficial in continuous integration environments where builds occur frequently.<!-- truncate_here -->

Gradle build cache is an essential tool for optimizing build times in software development. By storing build outputs either locally or remotely, it significantly reduces the time and resources required for rebuilding similar tasks. This cache mechanism is especially beneficial in continuous integration environments where builds occur frequently.


> Note : Tested with gradle 8.5

## Setting Up the Build Cache Node

### Running the Build Cache Node Locally

After downloading the  [jar](https://docs.gradle.com/build-cache-node/jar/build-cache-node-18.0.jar) file, you can start the build cache node locally:

```bash
java -jar build-cache-node-18.0.jar start
WARNING: Using default data dir location '/tmp/build-cache-node' which is in temp space and could be deleted at any time (use '--data-dir=<dir>' to specify a persistent location).
WARNING: This build cache is unusable as a build cache due to its access control settings - anonymous access is disabled and no users are defined.
Starting Develocity build cache node (18.0) ...
UI access is protected by generated username and password:
Build cache node started (port: 5071).
```
This command will output several messages, including warnings and information about the default settings:

1. **Default Data Directory:** It warns about using the default data directory located in temporary space (/tmp/build-cache-node). For persistent caching, it's recommended to specify a directory using --data-dir=`<dir>`.

2. **Access Control Settings:** By default, anonymous access to the build cache is disabled. To enable your application to access the cache, you need to configure access control settings.

## Configuring Access for a Java Application

### Generating a Hashed Salt Password

For enhanced security, the Gradle build cache requires a hashed salt password. You can generate this using the build-cache-node jar. 

```bash
$ java -jar build-cache-node-18.0.jar hash
```
### Dockerfile

Let's set up a Docker container to deploy the cache node easily in any environment. Below is the Dockerfile for creating such a container:

{% template  customCode.html %}
---
id: a7a291a9e4a5d16c8a2f298ec508bd05
file: Dockerfile
---
{% endtemplate %}

Replace `<hashed_password>` with the hashed password generated earlier.

> Note: If you're using podman, ensure to specify the full path of the Dockerfile like

```bash
FROM docker.io/library/amazoncorretto:17-alpine-jdk
```

Build and run your Docker container:

```bash
# Build the Docker container
$ docker build -t gradle-cache .

# Run the container
$ docker run -p 5071:5071 gradle-cache  
```


## Verify the Gradle Cache

### Using Curl


```bash
$ curl -sw \\n --fail-with-body --show-error http://localhost:5071/ping
SUCCESS
```

### Creating a Simple Application

Go to [start.initializr](https://start.spring.io/) and create a simple application. Ensure `gradle.properties` contains: 

```
org.gradle.caching=true
```

Update your `settings.gradle` to configure the remote build cache:

{% template customCode.html %}
---
id: a7a291a9e4a5d16c8a2f298ec508bd05
file: settings.gradle
---
{% endtemplate %}

### Building the Application

Finally, build your application:

```bash
$ ./gradlew clean build
```

By setting up and utilizing the Gradle build cache, you significantly reduce build times and enhance the efficiency of your development workflow. It's a powerful feature that, when configured correctly, can provide substantial benefits in both local and CI/CD environments.
