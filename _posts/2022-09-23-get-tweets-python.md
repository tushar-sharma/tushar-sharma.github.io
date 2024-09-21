---
layout: post
title: Extract tweets from Twitter using Python
tags:
  - python
thumb: https://unsplash.com/photos/DGyL_hXFPV4/download?w=437"
summary: Extract data from Twitter using Python
image: https://unsplash.com/photos/DGyL_hXFPV4/download?w=437"
author: Tushar Sharma
category: blog
---

In this tutorial, we will extract tweets from Twitter using python.<!-- truncate_here -->
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

We can get tweets by running

```bash
$ poetry run python get-tweets tshrocks
Get tweets for the tshrocks
getting tweets before 1284662084169596930
...389 tweets downloaded so far
getting tweets before 1030303523794288639
...571 tweets downloaded so far
getting tweets before 909242746770247681
...771 tweets downloaded so far
getting tweets before 312978397368291328
...963 tweets downloaded so far
getting tweets before 153814759517585407
...1157 tweets downloaded so far
getting tweets before 99546946154409983
...1177 tweets downloaded so far
getting tweets before 83587008219447295
...1177 tweets downloaded so far
```

We can open our `csv` file with any editor or excel. 
