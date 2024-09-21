---
layout: post
title: Set up markdown editor locally using docker
image: 'https://unsplash.com/photos/_KaMTEmJnxY/download?w=437'
thumb: 'https://unsplash.com/photos/_KaMTEmJnxY/download?w=437'
author: Tushar Sharma
tags:
  - docker
  - mardkown
published: true
category: blog
---

If you're a writer or a developer who frequently deals with text formatting, you're probably familiar with Markdown. Markdown is a lightweight markup language that allows you to easily format text using simple syntax. While you can write Markdown in any text editor, using a dedicated Markdown editor can make the process much easier and more efficient.<!-- truncate_here -->

If you're a writer or a developer who frequently deals with text formatting, you're probably familiar with Markdown. Markdown is a lightweight markup language that allows you to easily format text using simple syntax. While you can write Markdown in any text editor, using a dedicated Markdown editor can make the process much easier and more efficient.

### Install Docker

### Pull the Markdown image Docker Image

We can use markdown editor like `dillinger` or `stackedit`. 

Once you have Docker installed, open up a terminal window and run the following command to pull the Dillinger Docker image from Docker Hub:


```bash
# use dillinger
$ export imageDocker="linuxserver/dillinger"
# or use stackedit
$ export imageDocker="benweet/stackedit"
$ docker pull $imageDocker
```

### Run the Docker Container

After pulling the Docker image, run the following command to start a new Docker container:

```bash
$ docker run -p 8087:8080 -d $imageDocker
```

#### Access the editor in Your Browser

Open up your web browser and navigate to `http://localhost:8087` to access the Markdown editor interface.
