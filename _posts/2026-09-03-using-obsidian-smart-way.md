---
layout: post
title: Using Obsidian Smart Way
image: https://unsplash.com/photos/lRcMK6ooaQg/download?w=437
thumb: https://unsplash.com/photos/lRcMK6ooaQg/download?w=437
author: tushar sharma
category: blog
tags:
 - obsidian
published: false
---

<!-- truncate_here -->


Obisian is a markdown editor.  You can write text and images and everything is stored local.  You can use git to version control it. We an make it more better : 

## Default Template Plugin

Install it using Community Plugins. Go to plugin settings and click Select template and create a file `Templates/Default Note.md` file as 

```yaml
---
type: notes
date: ""
project: "<placeholder>"
status: "<placeholder>"
severity: critical
tags: []
---
```

So everytime you open a file it always has this.


## Searching Using Git 

We can use existing search in git . Create this file

```
mkdir -p ~/.local/bin
nano ~/.local/bin/git-obsi
```
