---
published: false
---

### Getting Started with ArgoCD

Lets start with a dockerfile

```yaml
FROM amazoncorretto:17-alpine-jdk

WORKDIR /app

ADD https://docs.gradle.com/build-cache-node/jar/build-cache-node-18.0.jar /app/build-cache-node.jar

EXPOSE 5071

CMD ["java", "-jar", "/app/build-cache-node.jar"]
```

This Dockerfile creates a container with the OpenJDK JRE installed. It downloads a .jar file using curl and runs it when the container starts. The .jar file is a build cache node from Gradle, which can help speed up build times by caching build outputs. The container exposes port 5071, which is the default port used by the build cache node.

We can build and run dockerfile locally like

```bash
$ docker build -t gradle-cache .
$ docker run -p 8080:5071 gradle-cache
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