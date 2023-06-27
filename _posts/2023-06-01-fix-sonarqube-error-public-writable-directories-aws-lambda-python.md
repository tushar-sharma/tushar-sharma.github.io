---
layout: post
date: 2023-06-01
title: Fix SonarQube Error of Public Writable Directories in AWS lambda python
thumb:  /img/error_wallpaper.jpg
image:  /img/error_wallpaper.jpg
author: Tushar Sharma
tags:
 - sonarqube
 - python
 - aws
category: blog
---

In AWS Lambda functions, it's common to use temporary directories for tasks like generating temporary files, storing intermediate data, or processing data securely. However, improperly managing publicly writable directories can lead to security vulnerabilities. In this article, we'll explore how to address this issue and ensure safe usage of temporary directories in AWS Lambda functions using Python's tempfile module.<!-- truncate_here -->
<p>Tags: {% for tag in page.tags %} <a class="mytag" href="/tag/{{ tag }}" title="View posts tagged with &quot;{{ tag }}&quot;">{{ tag }}</a>  {% if forloop.last != true %} {% endif %} {% endfor %} </p>

In AWS Lambda functions, it's common to use temporary directories for tasks like generating temporary files, storing intermediate data, or processing data securely. However, improperly managing publicly writable directories can lead to security vulnerabilities. In this article, we'll explore how to address this issue and ensure safe usage of temporary directories in AWS Lambda functions using Python's tempfile module.

### The Problem: Publicly Writable Directories

One common SonarQube warning is related to the usage of publicly writable directories. SonarQube raises this warning to highlight potential security risks when working with directories that have open write permissions. In the case of AWS Lambda functions, the `/tmp` directory is often used for temporary file operations.

{% template  customCode.html %}
---
id: 9832f3acbfaa468021d3c5cb44679242
file: wrong_example.py
---
{% endtemplate %}

In this code snippet, the /tmp directory is publicly writable, which can pose security risks if not managed properly.

### Solution: Use tempfile

To address the SonarQube warning and safely manage temporary directories in AWS Lambda functions, we can leverage Python's built-in tempfile module. The tempfile module provides a secure and convenient way to create temporary files and directories with proper permissions and unique names.

Here's an updated version of the code that uses the tempfile module:


{% template  customCode.html %}
---
id: 9832f3acbfaa468021d3c5cb44679242
file: correct_example.py
---
{% endtemplate %}

In the updated code, we make use of the tempfile.gettempdir() function to retrieve the system's default temporary directory, which is typically /tmp on Linux-based systems. By using the system's default temporary directory, we ensure consistent and secure behavior across different environments.

The tempfile module automatically handles the creation of secure and unique temporary file names. It ensures that the file names are unique to avoid naming collisions and potential security risks.

By utilizing Python's tempfile module, we gain several benefits:

1. Secure and unique file names: The tempfile module generates unique file names automatically, reducing the risk of naming collisions. This ensures the integrity and security of temporary files.

2. Platform independence: The module abstracts the underlying platform's temporary directory and provides a consistent API across different environments. This improves the portability of your code.

3. Proper permissions: The tempfile module creates temporary files and directories with secure permissions by default. This helps restrict access to the temporary directory and ensures that other users or processes don't have unintended write access.
