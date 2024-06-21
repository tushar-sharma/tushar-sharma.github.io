---
layout: post
title: Publish your Java Library to Maven Local Using Gradle
image: 'https://unsplash.com/photos/0HAIE_uZ5-0/download?w=800'
thumb: 'https://unsplash.com/photos/0HAIE_uZ5-0/download?w=800'
author: Tushar Sharma
category: blog
tags:
  - maven
  - gradle
---

You can publish your Java libraries to the Maven Local repository, enabling developers to easily test and share their work within their local environment. Maven Local is a local repository on your machine that cache downloaded dependencies and stores your own project's artifacts (e.g. JAR files). This allows for faster builds and provide an easy way to share artifact across different projects without the need to publish them to a remote repository.<!-- truncate_here -->

You can publish your Java libraries to the Maven Local repository, enabling developers to easily test and share their work within their local environment. Maven Local is a local repository on your machine that cache downloaded dependencies and stores your own project's artifacts (e.g. JAR files). This allows for faster builds and provide an easy way to share artifact across different projects without the need to publish them to a remote repository.

Gradle, on the other hand, is an open-source build automation tool designed to be flexible enough to build almost any type of software. It uses a domain-specific language based on Groovy or Kotlin, making it more expressive and concise compared to XML-based build scripts used in Maven.

## Configuration

To begin, open your project's build.gradle file and ensure that the maven-publish plugin is applied. This plugin provides the capability to publish artifacts to Maven repositories. You can apply the plugin by adding the following line to your script:

```groovy
plugins {
       id 'maven-publish'
}
```

Next, you need to specify where you want to publish your artifacts. In this case, we'll be publishing to Maven Local. Add the following configuration to your build.gradle:

```groovy
publishing {
    repositories {
        mavenLocal()
    }
}
```

Within the publishing block, you must also define the details of what you are publishing. This typically involves specifying the groupId, artifactId, and version of your library, along with the components to publish. Here's an example configuration:

```groovy
publishing {
    publications {
        mavenJava(MavenPublication) {
            from components.java
        }
    }
}
```

## Publishing

With the configuration in place, you're now ready to publish your Java library to Maven Local. Open IntelliJ IDEA and navigate to the Gradle tool window on the right. Expand your project's tasks, and under the "publishing" category, you'll find the publishToMavenLocal task. Double-click this task to execute it.

Or you can publish using command line 

```
$ ./gradlew publishToMavenLocal
```

## Verification

After the task completes, navigate to your local Maven repository to verify that your library has been published successfully. The default location on UNIX-based systems like macOS and Linux is `/Users/<YourUsername>/.m2/repository`. On Windows, it's typically located at `C:\Users\<YourUsername>\.m2\repository`.
