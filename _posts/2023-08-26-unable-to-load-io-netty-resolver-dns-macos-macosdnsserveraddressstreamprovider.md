---
layout: post
title: Resolving Netty's DNS Resolution Error on MacOS M1 Systems
image: https://unsplash.com/photos/XWar9MbNGUY/download?w=437
thumb: https://unsplash.com/photos/XWar9MbNGUY/download?w=437
author: Tushar Sharma
category: blog
published: true
tags:
  - macos
  - gradle
  - maven
mutipleTab: true
---

Developers using Netty on MacOS M1 systems may encounter an error indicating a missing DNS resolver library. This error arises because Netty utilizes native code for optimal DNS resolution, and the necessary library might not be present on M1 systems.<!-- truncate_here -->

Developers using Netty on MacOS M1 systems may encounter an error indicating a missing DNS resolver library. This error arises because Netty utilizes native code for optimal DNS resolution, and the necessary library might not be present on M1 systems.


## Error

> Unable to load io.netty.resolver.dns.macos.MacOSDnsServerAddressStreamProvider, fallback to system defaults. This may result in incorrect DNS resolutions on MacOS. Check whether you have a dependency on 'io.netty:netty-resolver-dns-native-macos'.


## Cause

Netty uses native code to interface with the system's DNS resolver for optimal performance. On MacOS systems, especially those with the M1 chip, the required native library might be missing, leading to the aforementioned error. The solution is to explicitly provide this native library.

## Solution

For projects managed with Gradle, you need to include the following dependency in your build.gradle file:


{% template  customTab.html %}
---
files:
  - language: Gradle
    code: |
      runtimeOnly("io.netty:netty-resolver-dns-native-macos:4.1.76.Final:osx-aarch_64")
  - language: Maven
    code: |
      <dependency>
          <groupId>io.netty</groupId>
          <artifactId>netty-resolver-dns-native-macos</artifactId>
          <version>4.1.76.Final</version>
          <classifier>osx-aarch_64</classifier>
          <scope>runtime</scope>
      </dependency>
---
{% endtemplate %}
