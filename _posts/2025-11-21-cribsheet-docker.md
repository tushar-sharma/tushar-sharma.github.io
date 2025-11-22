---
layout: post
image: https://unsplash.com/photos//download?w=437
thumb: https://unsplash.com/photos//download?w=437
author: tushar sharma
category: blog
published: false
tags:
 - letters
---
# Cribsheet for Docker

## History

Previously we had hypervisor software. It installed guest OSes on host machine. This was bloated but provided isolation.

Docker came where you can host and guest can share operating system. This is possible due to following functionality in Linux.A Linux process + isolated kernel namespaces + cgroups

1. namespaces. 

2. etc.

In windows, docker runs a linux kernel separately which is shared by docker container. In mac and linux, existing kernel of the host is shared. 

## What the heck is container?

Dockerfile is blueprint to run the container. Container is the actual running image. It's A lightweight, isolated process. It follows OCI guidelines...

## OCI standard

It specifies how an image is specified. Also how a container runs. runc is the runtime that implements OCI (used by Docker and Kubernetes). OCI complaint means docker and kubernetes can run the same container. 

the image must be 

```
image/
  manifest.json
  config.json
  blobs/sha256/xxxx

```

Dockerifle is actual this ? 

container is 

```
```

## Docker Engine

consist of 
1. dockerd (daemon)

2. containerd (manages container)

3. runc

BUiltdkit is the new docker enginere that enables parallel and faster build.

## Linux namespaces isolate PID (process id), net, IPC (shared memory)

cggroup is kenrel interface for cpu quotas, memory limits, 

runc write during startup 

```
cpu.max
memory.max
```

inpsect llb 

```
buildctl debug dump-llb --local context=. --local dockerfile=.```
