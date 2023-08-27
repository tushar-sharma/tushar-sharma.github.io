---
layout: post
title: Resolving Netty's DNS Resolution Error on MacOS M1 Systems
image: https://unsplash.com/photos/XWar9MbNGUY/download?w=800
thumb: https://unsplash.com/photos/XWar9MbNGUY/download?w=800
author: Tushar Sharma
category: blog
published: true
tags:
  - macos
---

In the evolving landscape of software development, the Apple M1 chip has introduced a paradigm shift in performance and efficiency. However, like any new technology, it comes with its own set of challenges. One such challenge is the DNS resolution error encountered when using the Netty library. In this article, we will delve deep into the root cause of this issue and provide a solution for both Gradle and Maven users.<!-- truncate_here -->


In the evolving landscape of software development, the Apple M1 chip has introduced a paradigm shift in performance and efficiency. However, like any new technology, it comes with its own set of challenges. One such challenge is the DNS resolution error encountered when using the Netty library. In this article, we will delve deep into the root cause of this issue and provide a solution for both Gradle and Maven users.

### Error

Developers utilizing the Netty library on MacOS M1 systems might encounter the following error:


```
Unable to load io.netty.resolver.dns.macos.MacOSDnsServerAddressStreamProvider, fallback to system defaults. This may result in incorrect DNS resolutions on MacOS. Check whether you have a dependency on 'io.netty:netty-resolver-dns-native-macos'.
```

This error stems from Netty's inability to access the native MacOS DNS resolver. The consequence of this is potential incorrect DNS resolutions, which can lead to a myriad of network-related issues in your application.


### The Underlying Cause

Netty uses native code to interface with the system's DNS resolver for optimal performance. On MacOS systems, especially those with the M1 chip, the required native library might be missing, leading to the aforementioned error. The solution is to explicitly provide this native library.


### Solution

For projects managed with Gradle, you need to include the following dependency in your build.gradle file:


```gradle
runtimeOnly("io.netty:netty-resolver-dns-native-macos:4.1.76.Final:osx-aarch_64")
```

For Maven Users:

```xml
<dependency>
    <groupId>io.netty</groupId>
    <artifactId>netty-resolver-dns-native-macos</artifactId>
    <version>4.1.76.Final</version>
    <classifier>osx-aarch_64</classifier>
    <scope>runtime</scope>
</dependency>
```

After adding this, it's advisable to run mvn clean install to ensure all dependencies are correctly updated.