---
layout: post
title: Create Abstraction for Key-Value store in Local, S3, and Azure
image: https://unsplash.com/photos//download?w=437
thumb: https://unsplash.com/photos//download?w=437
author: tushar sharma
category: blog
tags:
  - s3
  - azure
  - local
---

Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.<!-- truncate_here -->

Write about key-value store? We are going to create abstraction cloud based key-value store like s3 and Azure. We would also involve fall back to local file system. Anothing more to add with regard to architecture..


### Contract

An interface is like a contract that we will expose to the client. 

<!-- TODO fix it later-->
<img loading="lazy" src="{{ root_url }}/imgs/code/Storage_Provider_Design.png" alt="Storage_Provider_Design" />

Here is the java code

```java
import java.io.IOException;

public interface StorageProvider {

    void write(@Nonnull Path path, @Nonnull byte[] data) throws IOException;

    @NonNull
    byte[] read(@NonNull Path path) throws IOException;

    boolean delete(@NonNull Path path) throws IOException;

    boolean exists(@NonNull Path path) throws IOException;
}
```

### File System Storage

This is the easiest one to implement. Before Java 7, we relied on `io.file` for file procesisng. However, with Java 7, we have `nio.file` which is more efficient and faster. 

```java
public class LocalStorage implements StorageProvider {
}
```