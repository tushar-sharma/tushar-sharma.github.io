---
layout: post
title: Extract tweets from Twitter using Python
tags:
  - python
thumb: https://unsplash.com/photos/RlPgKA95Xs0/download?w=437"
summary: Extract data from Twitter using Python
image: https://unsplash.com/photos/RlPgKA95Xs0/download?w=437"
author: Tushar Sharma
category: blog
---

In this tutorial, we will extract tweets from Twitter using python.<!-- truncate_here -->
In this tutorial, we will extract tweets from Twitter using python.

First lets create a project- 


{% template  customCode.html %}
---
id: ac2739f5e0282add422a1430988a4a3d
file: start.sh
---
{% endtemplate %}

We will use [poetry](https://python-poetry.org/) for managing our dependencies. 

{% template  customCode.html %}
---
id: ac2739f5e0282add422a1430988a4a3d
file: poetry.sh
---
{% endtemplate %}

We haven't implemented anything, so it will just ouput `Get tweets for the tshrocks` to the console. `tshrocks` is my twitter profile username

{% template  customCode.html %}
---
id: ac2739f5e0282add422a1430988a4a3d
file: get-tweets1.py
---
{% endtemplate %}


Next we need to authenticate with twitter, where we need access and consumer keys from twitter. You can go to [developer page](https://developer.twitter.com/en/apps) and create an app to get your keys.

{% template  customCode.html %}
---
id: ac2739f5e0282add422a1430988a4a3d
file: get-tweets2.py
---
{% endtemplate %}

Lastly, here's the full code. 

{% template  customCode.html %}
---
id: ac2739f5e0282add422a1430988a4a3d
file: get-tweets.py
---
{% endtemplate %}

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