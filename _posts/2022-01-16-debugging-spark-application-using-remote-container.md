---
layout: post
title: Debugging Spark Application Locally using remote container
date: 2022-01-16 19:28 -0500
tags:
- spark
- pyspark
- docker
- vscode
name: spark-remote-debug
thumb: https://unsplash.com/photos/6k6N8HTrXyE/download?w=437
summary: Debugging Spark Application using remote container Using Visual Studio Code
image: https://unsplash.com/photos/6k6N8HTrXyE/download?w=437
author: Tushar Sharma
---

One of the nifty feature in any code development is the ability to debug your application using break points. Submitting a Spark job while waiting for it to complete will waste a lot of time debugging. Spark jobs can be debugging with `break points` and `step over` and `step into` and `step out` commands.<!-- truncate_here -->

<p>Tags: {% for tag in page.tags %} <a class="mytag" href="/tag/{{ tag }}" title="View posts tagged with &quot;{{ tag }}&quot;">{{ tag }}</a>  {% if forloop.last != true %} {% endif %} {% endfor %}</p>

One of the nifty feature in any code development is the ability to debug your application using break points. Submitting a Spark job while waiting for it to complete will waste a lot of time debugging. Spark jobs can be debugging with `break points` and `step over` and `step into` and `step out` commands.


# Requirements

1. [VS Code](https://code.visualstudio.com/)

2. [Docker](https://www.docker.com/)

# Setup

Lets create our project.


```bash
$ mkdir SparkDemo && cd SparkDemo
```


 We will create a file `.devcontainer/devcontainer.json`. [VS Code](https://code.visualstudio.com/) will use this file to access (or create) a development container with a well-defined tool and runtime stack.

```
$ mkdir .devcontainer
$ touch .devcontainer/devcontainer.json
```

`devconainter.json` will look like this:<br>

<script src="https://gist.github.com/tushar-sharma/318bf60d15f03b0afe154f63589c2b84.js?file=devcontainer.json"></script><br>

We will need to add a `Dockerfile` to our project. This file will be used to build the container.<br><br>

<script src="https://gist.github.com/tushar-sharma/318bf60d15f03b0afe154f63589c2b84.js?file=Dockerfile"></script><br>


Lastly, we need to create a simple `Pyspark` script. <br><br>

<script src="https://gist.github.com/tushar-sharma/318bf60d15f03b0afe154f63589c2b84.js?file=spark_demo.py"></script><br>

# Running the container

Currently your project structure should look like this:

```
SparkDemo
___ .devcontainer
___ ___ devcontainer.json
___ Dockerfile
___ spark_demo.py

```

Next, we need to open the `SparkDemo` in VS Code.

```bash
$ cd SparkDemo
$ code .
```

To run the remote-container, you can click on the green button in the bottom left corner of the VS Code window.

<img src="{{ root_url }}/img/remote-dev-status-bar.png">

# Demo

<iframe height="500" src="https://www.youtube.com/embed/hQNbEGFpbOI"  scrolling="no" frameborder="0" style="position: relative;  width: 100%;" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

