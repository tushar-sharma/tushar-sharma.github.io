---
layout: post
title: Scan Code locally using SonarQube
image: 'https://unsplash.com/photos/3yzE1SUfbwY/download?w=437'
thumb: 'https://unsplash.com/photos/3yzE1SUfbwY/download?w=437'
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

<div style="display:none;" markdown="1">
export imageName=sonarqube
docker pull $imageName
</div>

{% template  customCode.html %}
---
id: d32f5c55302cadd0e7fa8255fb1f5f3b
file: ex2.sh
---
{% endtemplate %}

If you are using ARM based Mac, you might get following error

```bash
no matching manifest for linux/arm64/v8 in the manifest list entries
```
Instead use a different docker image on Mac

<div style="display:none;" markdown="1">
export imageName=davealdon/sonarqube-with-docker-and-m1-macs
</div>

{% template  customCode.html %}
---
id: d32f5c55302cadd0e7fa8255fb1f5f3b
file: ex4.sh
---
{% endtemplate %}


Run the SonarQube container:


<div style="display:none;" markdown="1">
docker run -d --name sonarqube -e SONAR_ES_BOOTSTRAP_CHECKS_DISABLE=true -p 9000:9000 $imageName
</div>

{% template  customCode.html %}
---
id: d32f5c55302cadd0e7fa8255fb1f5f3b
file: ex5.sh
---
{% endtemplate %}

Login to sonarqube server locally at http://localhost:9000 using following credentials

```bash
Username : admin
Password : admin
```

For token go to `My Profile -> Security -> Generate token`.


Install the sonar-scanner. For Mac you can use

<div style="display:none;" markdown="1">
brew install sonar-scanner
</div>

{% template  customCode.html %}
---
id: d32f5c55302cadd0e7fa8255fb1f5f3b
file: ex3.sh
---
{% endtemplate %}

Lastly go to the folder where you want to scan

<div style="display:none;" markdown="1">
$ sonar-scanner -X  \
  -Dsonar.projectKey=Test \
  -Dsonar.sources=. \
  -Dsonar.java.binaries=build/classes \
  -Dsonar.host.url=http://localhost:9000 \
  -Dsonar.login=<token>
</div>


{% template  customCode.html %}
---
id: d32f5c55302cadd0e7fa8255fb1f5f3b
file: ex1.sh
---
{% endtemplate %}