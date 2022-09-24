---
layout: post
title: Extract tweets from Twitter using Python
tags:
  - python
thumb: https://unsplash.com/photos/DGyL_hXFPV4/download?w=800"
summary: Extract data from Twitter using Python
image: https://unsplash.com/photos/DGyL_hXFPV4/download?w=800"
author: Tushar Sharma
---

In this tutorial, we will extract tweets from Twitter using python.<!-- truncate_here -->
<p>Tags: {% for tag in page.tags %} <a class="mytag" href="/tag/{{ tag }}" title="View posts tagged with &quot;{{ tag }}&quot;">{{ tag }}</a>  {% if forloop.last != true %} {% endif %} {% endfor %} </p>
In this tutorial, we will extract tweets from Twitter using python.

First lets create a project- 

```bash
$ mkdir get-tweets
$ cd get-tweets
$ touch tweets.py
```

We will use [poetry](https://python-poetry.org/) for managing our dependencies. 

```bash
$ poetry init
$ poetry add tweepy
```

We haven't implemented anything, so it will just ouput `Get tweets for the tshrocks` to the console. `tshrocks` is my twitter profile username

<script src="https://gist.github.com/tushar-sharma/ac2739f5e0282add422a1430988a4a3d.js?file=get-tweets1.py"></script>

Next we need to authenticate with twitter, where we need access and consumer keys from twitter. You can go to [developer page](https://developer.twitter.com/en/apps) and create an app to get your keys.

<script src="https://gist.github.com/tushar-sharma/ac2739f5e0282add422a1430988a4a3d.js?file=get-tweets2.py"></script>

Lastly, here's the full code. 

<script src="https://gist.github.com/tushar-sharma/ac2739f5e0282add422a1430988a4a3d.js?file=get-tweets.py"></script>

We can open our `csv` file with any editor or excel. 
