---
layout: post
date: 2023-06-10
title: Bookmark Anything using ChatGPT
image: https://unsplash.com/photos/-0xMiYQmk8g/download?w=800
thumb: https://unsplash.com/photos/-0xMiYQmk8g/download?w=800
author: Tushar Sharma
tag:
- chatgpt
published: true
---

.<!-- truncate_here -->
<p>Tags: {% for tag in page.tags %} <a class="mytag" href="/tag/{{ tag }}" title="View posts tagged with &quot;{{ tag }}&quot;">{{ tag }}</a>  {% if forloop.last != true %} {% endif %} {% endfor %} </p>

### Create a [Notion](https://www.notion.so/) page. 

*  Add a new page called `Bookmark`

*  Insert a database

* Add a new property called "Bookmark"


### Set up [Zapier](https://zapier.com/app/login) plugin

* Install Zapier plugin in ChatGPT

* Go to [nla.zapier.com/openai/actions](https://nla.zapier.com/openai/actions)

* Set up the "Notion: Create Database" action

###  Create shortcut in Text Blaze

* Go to [textblaze.me/moritz](https://textblaze.me/moritz)

* Create a new snippet and enter this prompt

```
# Save to notion
Name: [2-word summary of last response]
Bookmark: [insert text from last response]
Tags:
```
### Save bookmark 

Type `/save` in chatgpt to save bookmark.

