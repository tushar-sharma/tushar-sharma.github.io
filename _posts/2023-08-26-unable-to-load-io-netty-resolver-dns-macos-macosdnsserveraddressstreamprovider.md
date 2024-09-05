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
  - gradle
  - maven
---

Developers using Netty on MacOS M1 systems may encounter an error indicating a missing DNS resolver library. This error arises because Netty utilizes native code for optimal DNS resolution, and the necessary library might not be present on M1 systems.<!-- truncate_here -->

Developers using Netty on MacOS M1 systems may encounter an error indicating a missing DNS resolver library. This error arises because Netty utilizes native code for optimal DNS resolution, and the necessary library might not be present on M1 systems.


## Error

<div style="display:none;" markdown="1">
Unable to load io.netty.resolver.dns.macos.MacOSDnsServerAddressStreamProvider, fallback to system defaults. This may result in incorrect DNS resolutions on MacOS. Check whether you have a dependency on 'io.netty:netty-resolver-dns-native-macos'.
</div>

{% template  customCode.html %}
---
id: b25327b11fa0d1f42f9ccd2f05235817
file: Error.txt
---
{% endtemplate %}

## Cause

Netty uses native code to interface with the system's DNS resolver for optimal performance. On MacOS systems, especially those with the M1 chip, the required native library might be missing, leading to the aforementioned error. The solution is to explicitly provide this native library.

## Solution

For projects managed with Gradle, you need to include the following dependency in your build.gradle file:

### Gradle

<div style="display:none;" markdown="1">
runtimeOnly("io.netty:netty-resolver-dns-native-macos:4.1.76.Final:osx-aarch_64")
</div>

{% template  customCode.html %}
---
id: b25327b11fa0d1f42f9ccd2f05235817
file: build.gradle
---
{% endtemplate %}


### Maven

{% template  customCode.html %}
---
id: b25327b11fa0d1f42f9ccd2f05235817
file: pom.xml
---
{% endtemplate %}