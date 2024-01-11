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

This give me this error : 

```
docker run -p 8080:5071 gradle-cache                                                                                ✔  3874  15:34:17
Error: A JNI error has occurred, please check your installation and try again
Exception in thread "main" java.lang.UnsupportedClassVersionError: com/gradle/buildcache/node/BuildCacheNodeMain has been compiled by a more recent version of the Java Runtime (class file version 61.0), this version of the Java Runtime only recognizes class file versions up to 52.0
```

How to fix?