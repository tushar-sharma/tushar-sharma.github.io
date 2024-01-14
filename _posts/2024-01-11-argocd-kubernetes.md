---
published: false
---

### Getting Started with ArgoCD

Lets start with a dockerfile

```yaml
FROM amazoncorretto:17-alpine-jdk

WORKDIR /app

# Add the Gradle build cache node jar
ADD https://docs.gradle.com/build-cache-node/jar/build-cache-node-18.0.jar /app/build-cache-node.jar

# Create directories for storing the cache data and config
RUN mkdir -p /app/cache /app/config

# Correctly format and create the config.yaml file
RUN printf "version: 5\n\
cache:\n\
  accessControl:\n\
    anonymousLevel: \"read\"\n\
    users:\n\
      tsharma:\n\
        password: \"8Fzqdkmw4g2LcKRcwez7+iMEQdzZ/PMFQDJhVmuUhy0=:Zxqw3oU1jRXj3YL00vtDkJw0TmTWtu8rs529KMKXmP8=\"\n\
        level: \"readwrite\"\n\
        note: \"testing...\"\n" > /app/config/temp-config.yaml

# Copy the temporary config file to the final location
RUN cp /app/config/temp-config.yaml /app/config/config.yaml

EXPOSE 5071

# Start the build cache node with a specified data directory and config directory
CMD ["java", "-jar", "/app/build-cache-node.jar", "start", "--data-dir", "/app/cache", "--config-dir", "/app/config"]
```

java -jar path/to/build-cache-node-18.0.jar hash
Enter password: passwordComplicated1
Confirm password: passwordComplicated1
"7a+lG8aaYRGJCgDtsSrYcufys67tW1I/augaLUiN8As=:+Zv1/r2oY0T2anrooV8XVe6ovlCqBfOf2ZwgfoLA6Ew="

This Dockerfile creates a container with the OpenJDK JRE installed. It downloads a .jar file using curl and runs it when the container starts. The .jar file is a build cache node from Gradle, which can help speed up build times by caching build outputs. The container exposes port 5071, which is the default port used by the build cache node.

We can build and run dockerfile locally like

```bash
$ docker build -t gradle-cache .
$ docker run -p 8080:5071 gradle-cache
```

If you are using podman, you need to give full path of the dockerimage like : 

```yaml
FROM docker.io/library/amazoncorretto:17-alpine-jdk
```

```bash
$ podman build --pull-always -t gradle-cache .
$ podman run -p 8080:5071 gradle-cache
```

You should see the output at : 

```
Build cache node started (port: 5071).
```

Next we will install the minikube. Minikube is kubernetes cluster that we can run locally.


```bash
curl -LO https://github.com/kubernetes/minikube/releases/download/v1.32.0/minikube-darwin-arm64
sudo install minikube-darwin-amd64 /usr/local/bin/minikube
```

Start minikube

```
minikube start
```

To see minkube locally in a browser

```
minikube dashboard
```

Minikube runs in a virtual machine, you wnat to use Docker images withing this VM, you should point your docker cli to Minikube's docker daemon. This way, the image you built will be available in minikube's environment. 

```bash
eval $(minikube docker-env)
```

Build the image : 

```
docker build -t gradle_cache . 
````
