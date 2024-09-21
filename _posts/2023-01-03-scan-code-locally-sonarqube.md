---
layout: post
date: 2022-12-23
title: Scan Code locally using SonarQube
image: https://unsplash.com/photos/3yzE1SUfbwY/download?w=437
thumb: https://unsplash.com/photos/3yzE1SUfbwY/download?w=437
tags:
- docker
- sonarqube
author: Tushar Sharma
category: blog
---


SonarQube is an open-source platform used to manage code quality. It provides static code analysis, which means it can automatically analyze code to detect bugs, vulnerabilities, and code smells (design issues that could lead to problems in the future).<!-- truncate_here -->

SonarQube is an open-source platform used to manage code quality. It provides static code analysis, which means it can automatically analyze code to detect bugs, vulnerabilities, and code smells (design issues that could lead to problems in the future).

You can use Docker to run SonarQube in a container. This can be useful if you don't want to install SonarQube directly on your machine, or if you want to easily set up a test environment.

Go to the [Docker website](https://www.docker.com/) and download and install Docker for your operating system.
Follow the installation instructions to set up Docker on your machine.


Next we will pull up the docker image. 

```bash
$ export imageName=sonarqube
$ docker pull $imageName
```

If you are using ARM based Mac, you might get following error

```bash
no matching manifest for linux/arm64/v8 in the manifest list entries
```

Instead use a different docker image on Mac

```bash
$ export imageName=davealdon/sonarqube-with-docker-and-m1-macs
```

Run the SonarQube container:

```
$ docker run -d --name sonarqube -e SONAR_ES_BOOTSTRAP_CHECKS_DISABLE=true -p 9000:9000 $imageName
```


Login to sonarqube server locally at http://localhost:9000 using following credentials

```bash
Username : admin
Password : admin
```

For token go to `My Profile -> Security -> Generate token`.


Install the sonar-scanner. For Mac you can use

```bash
$ brew install sonar-scanner
```


Lastly go to the folder where you want to scan


```bash
$ sonar-scanner -X  \
  -Dsonar.projectKey=Test \
  -Dsonar.sources=. \
  -Dsonar.host.url=http://localhost:9000 \
  -Dsonar.login=<token>
```