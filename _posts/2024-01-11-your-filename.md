---
published: false
---

### Getting Started with ArgoCD

Lets start with a dockerfile

```yaml
FROM openjdk:8-jre-alpine

# Set the working directory in the container to /app
WORKDIR /app

RUN apk add --no-cache curl && \
    curl -k -o /app/build-cache-node.jar https://docs.gradle.com/build-cache-node/jar/build-cache-node-18.0.jar && \
    apk del curl

EXPOSE 5071

# Run build-cache-node.jar when the container launches
CMD ["java", "-jar", "/app/build-cache-node.jar"]
```

This Dockerfile creates a container with the OpenJDK JRE installed. It downloads a .jar file using curl and runs it when the container starts. The .jar file is a build cache node from Gradle, which can help speed up build times by caching build outputs. The container exposes port 5071, which is the default port used by the build cache node.

We can build and run dockerfile locally like

```bash
$ docker build -t gradle-cache .
$ docker run gradle-cache 8080:443
```