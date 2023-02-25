---
layout: post
date: 2023-02-25
title: Set up Dillinger using docker for markdown files
image: https://unsplash.com/photos/_KaMTEmJnxY/download?w=800
thumb: https://unsplash.com/photos/_KaMTEmJnxY/download?w=800
author: Tushar Sharma
tags:
 - docker
 - mardkown
---

Dillinger is a popular open-source Markdown editor that allows users to create, edit, and preview Markdown files with advanced features. In this tutorial, we will show you how to use Docker to set up Dillinger and use its advanced features to create, edit, and preview Markdown files. We'll also cover collaboration and export features, making it easy to work with others and export your Markdown files in various formats.<!-- truncate_here -->
<p>Tags: {% for tag in page.tags %} <a class="mytag" href="/tag/{{ tag }}" title="View posts tagged with &quot;{{ tag }}&quot;">{{ tag }}</a>  {% if forloop.last != true %} {% endif %} {% endfor %} </p>


Dillinger is a popular open-source Markdown editor that allows users to create, edit, and preview Markdown files with advanced features. In this tutorial, we will show you how to use Docker to set up Dillinger and use its advanced features to create, edit, and preview Markdown files. We'll also cover collaboration and export features, making it easy to work with others and export your Markdown files in various formats.

### Install Docker

Before you can set up Dillinger, you need to have Docker installed on your system. If you don't have Docker installed, head over to the official Docker website and follow the instructions to download and install Docker for your operating system.

### Pull the Dillinger Docker Image

Once you have Docker installed, open up a terminal window and run the following command to pull the Dillinger Docker image from Docker Hub:

```bash
$ docker pull joedicastro/dillinger
```

### Run the Dillinger Docker Container

After pulling the Dillinger Docker image, run the following command to start a new Docker container:

```bash
docker run -p 8087:8080 -d joedicastro/dillinger
```

#### Access Dillinger in Your Browser

Open up your web browser and navigate to `http://localhost:8087` to access the Dillinger Markdown editor interface.

### Create a New Markdown File

In the Dillinger editor, click the "New" button in the top left corner of the screen to create a new Markdown file.

### Edit Your Markdown File

In the editor, you can use Markdown syntax to format your text. Use common Markdown syntax like # for headers, * or _ for italics, ** or __ for bold, and - or * for unordered lists. You can also use code blocks by surrounding your text with three backticks (`) or use inline code by surrounding your text with single backticks.

#### Preview Your Markdown File

To preview your Markdown file, click the "Preview" button in the top right corner of the screen. This will render your Markdown file and display it in the preview pane on the right side of the screen.

### Export Your Markdown File

When you're happy with your Markdown file, you can export it in a variety of formats by clicking the "Export" button in the top right corner of the screen. Dillinger supports exporting to HTML, PDF, Markdown, and other formats.

### Collaborate on Your Markdown File

Dillinger has excellent collaboration capabilities, allowing you to collaborate with others on your Markdown file. To share your file, click the "Share" button in the top right corner of the screen and copy the link that is generated. You can then share this link with others to collaborate on your file in real-time.