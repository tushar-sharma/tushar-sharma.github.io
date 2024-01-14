---
published: false
---
Gradle build cache is a build cache that works by storing (locally or remotely) build outputs and thus saving build time. (?add something more)

First download the [jar](https://docs.gradle.com/build-cache-node/jar/build-cache-node-18.0.jar). We can run it locally by using 

```bash
java -jar build-cache-node-18.0.jar start
WARNING: Using default data dir location '/tmp/build-cache-node' which is in temp space and could be deleted at any time (use '--data-dir=<dir>' to specify a persistent location).
WARNING: This build cache is unusable as a build cache due to its access control settings - anonymous access is disabled and no users are defined.
Starting Develocity build cache node (18.0) ...
UI access is protected by generated username and password: user691 jjtsg4homjaq315zc5u6hkblla
Build cache node started (port: 5071).
```
It's started on port 5071 but we could also see the warnings: 

1. Since we haven't defined a `data dir location`, so a temp space is used. It many not be useful if we want to keep persistent cache
2. By default, access to the build cache is disabled. Only UI access is allowed which is also protected by username and password generated randomly. So we need to create `config`file to grant access to our application.

For our use case, we need our java application to be able to access this cache. So we will start by creating our `dockerfile` which is easy to deploy to any container environment. 

```yaml
FROM amazoncorretto:17-alpine-jdk

WORKDIR /app

# Add the Gradle build cache node jar
ADD https://docs.gradle.com/build-cache-node/jar/build-cache-node-18.0.jar /app/build-cache-node.jar

# Create directories for storing the cache data and config
RUN mkdir -p /app/cache /app/config

# create the config.yaml file
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
If you are using `podman`, you might need to give full path of the `dockerfile`. For example an image from `DockerHub` would look like : 

```yaml
FROM docker.io/library/amazoncorretto:17-alpine-jdk
```

Next we will build our application 

```bash
# Choose your build agent
export agent="docker"
# or export agent="podman"
$agent build -t gradle-cache .
$agent run -p 8080:5071 gradle-cache
```
For the password, it expects a hashed salt password. You can generate it using the same jar

```bash
java -jar build-cache-node-18.0.jar hash
```
## Verify the Gradle Cache

Go to [start.initializr](https://start.spring.io/) and create a simple application. Put `org.gradle.caching=true` in your `gradle.properties`

Update `settings.gradle` : 

```groovy
buildCache {
    remote(HttpBuildCache) {
        url = 'http://localhost:8080/cache/'
        push = true  // push to the cache
        enabled = true
        credentials {
            username = 'tsharma' 
            password = 'simpleComplicated@1' 
        }
    }
}
```

```bash
./gradlew clean build
```