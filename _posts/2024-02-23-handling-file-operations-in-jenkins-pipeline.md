---
layout: post
title: Handling File Operations in Jenkins Pipeline
image: 'https://unsplash.com/photos/LNwIJHUtED4/download?w=437'
thumb: 'https://unsplash.com/photos/LNwIJHUtED4/download?w=437'
tags:
 - jenkins
author: Tushar Sharma
category: blog
---

Jenkins pipelines are a powerful tool for automating continuous integration and delivery workflows. However, when dealing with file operations in a Jenkins pipeline, developers often encounter a common pitfall related to file handling.<!-- truncate_here -->

Jenkins pipelines are a powerful tool for automating continuous integration and delivery workflows. However, when dealing with file operations in a Jenkins pipeline, developers often encounter a common pitfall related to file handling.

###  Understanding the Pitfall with java.io.File

In a Jenkins pipeline, the conventional way to handle file operations is to use java.io.File. However, this method operates on the file system of the JVM where the Groovy script is running, which is the master node in the case of a Jenkins pipeline. This means that when you use java.io.File, it refers to files on the master machine where Jenkins is running, not in the workspace of the slave machine where your job might be running. This discrepancy can lead to a FileNotFoundException.

For example, consider the following code snippet:

```groovy
def homeDir = "${steps.WORKSPACE}"
def settingsFile = new File(homeDir, 'settings.gradle')
```

In this example, if the job is running on a slave machine, the settings.gradle file will be looked for in the workspace of the master machine, not the slave machine, potentially resulting in a FileNotFoundException.


### Use readFile Instead

The Jenkins pipeline provides a global function called readFile. Unlike java.io.File, the readFile function operates on the file system of the agent node where the job is running. This means it can access files in the workspace irrespective of whether the job runs on the master or a slave node.

Here's how you can use readFile:

```groovy
def homeDir = "${steps.WORKSPACE}"
def settingsFilePath = "${homeDir}/settings.gradle"
def settingsFile = steps.readFile(settingsFilePath)
```

In this example, readFile will correctly locate the settings.gradle file in the workspace of the machine where the job is running, avoiding the FileNotFoundException.