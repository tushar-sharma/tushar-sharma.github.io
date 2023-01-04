---
layout: post
date: 2022-12-23
title: Scan Code locally using Sonarqube
image: https://unsplash.com/photos/XBxQZLNBM0Q/download?w=800
thumb: https://unsplash.com/photos/XBxQZLNBM0Q/download?w=800
tags:
- docker
- sonarqube
author: Tushar Sharma
---

```bash
$ docker pull sonarqube
```

On ARM based Macs you might get this error

```bash
no matching manifest for linux/arm64/v8 in the manifest list entries
```
Solution 

```bash
$ docker pull davealdon/sonarqube-with-docker-and-m1-macs
```

Start the sonarqube server

```
$ docker run -d --name sonarqube -e SONAR_ES_BOOTSTRAP_CHECKS_DISABLE=true -p 9000:9000 davealdon/sonarqube-with-docker-and-m1-macs
```

Login to sonarqube using following cred

```bash
Username : admin
Password : admin
```

next go to the folder where you want to scan


```bash
$ sonar-scanner -X  \
  -Dsonar.projectKey=Test \
  -Dsonar.sources=. \
  -Dsonar.host.url=http://localhost:9000 \
  -Dsonar.login=<token>
```

For token go to My Profile -> Security -> Generate token