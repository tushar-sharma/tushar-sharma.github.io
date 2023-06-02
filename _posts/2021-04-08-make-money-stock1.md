---
layout: post
title: How to Make(Or Lose) Money in Stocks Part1
category: blog
tags:
- stocks
- python
- finance
- money
- google
- selenium
name: url-name
thumb: https://specials-images.forbesimg.com/imageserve/5fb540dd14833bd77ea925b8/960x0.jpg
---

Recently I finished watching web-series <a href="https://en.wikipedia.org/wiki/Scam_1992" target="_blank">Scam 1992</a>. It's based on story of Harshad Mehta, a famous Indian stockbrocker who made fortunes in stocks. Despite his iconic success & <a href="https://en.wikipedia.org/wiki/1992_Indian_stock_market_scam" target="_blank">failure</a>, the series rekindled my interest in world of "stocks". I guess the famous dialogue "Risk Hai Toh Ishq Hai" has stuck with me.<!-- truncate_here -->

<p>Tags: {% for tag in page.tags %} <a class="mytag" href="/tag/{{ tag }}" title="View posts tagged with &quot;{{ tag }}&quot;">{{ tag }}</a>  {% if forloop.last != true %} {% endif %} {% endfor %} </p>

Recently I finished watching web-series <a href="https://en.wikipedia.org/wiki/Scam_1992" target="_blank">Scam 1992</a>. It's based on story of Harshad Mehta, a famous Indian stockbrocker who made fortunes in stocks. Despite his iconic success & <a href="https://en.wikipedia.org/wiki/1992_Indian_stock_market_scam" target="_blank">failure</a>, the series rekindled my interest in world of "stocks". I guess the famous dialogue "Risk Hai Toh Ishq Hai" has stuck with me.

I still consider myself a novice when it comes to stocks. There's a no magic bullet to make money in stocks. However you can leverage scripts to reduce time to accumulate information. I'll share one such approach in helping you to buy or sell stocks.


Lets say you want to buy or sell some stocks. You can use some website to track them everyday (too tedious). Or you can use some API (like yahoofinance) to get this information. However free API usually have some time lag. We will using python in getting our current stock prices directly from google.

# Setup before you begin


Open your favourite terminal to create directory

```bash
$ mkdir $stocks
$ cd $_
```

We will be using `poetry` to manage our library depedencies. Create a default `pyproject.toml` file like this

```bash
$ poetry init
```

Keep pressing enter to keep the defualt configuration



Next we will create a text file,  `stocks.csv`. This will list all the stocks that we need to track. For this example I am using aaple and microsoft.

```bash
ticker,sell,sell,buy
aapl,0,125,0,0
msft,0,0,230,0
```


Here let me briefly expalin the columns:

1. ticker : stock ticker symbol

2. sell: the price at which you want to sell stock

3. buy: the price at which you want to buy stock


<blockquote>
"Investing should be more like watching paint dry or watching grass grow. If you want excitement, take $800 and go to Las Vegas."
<b>- Paul Samuelson</b><br>
</blockquote><br>

Next create python file, `stocks/main.py`

```python
import pandas as pd
from io import BytesIO
from reportlab.platypus import SimpleDocTemplate, Paragraph, PageBreak
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import mm
from reportlab.lib.pagesizes import letter
from reportlab.platypus.tables import Table, TableStyle
from reportlab.lib import colors
from reportlab import platypus
from  reportlab.lib.styles import ParagraphStyle as PS
from selenium import webdriver
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.action_chains import ActionChains
from reportlab.platypus import Image as Image2
import logging

```


Next we will open our favourite Web browser to type `aapl stocks`

| <img align="center" src="{{ root_url }}/img/st1.png" alt="" /> |


We will then right click and use inspect the web page


| <img align="center" src="{{ root_url }}/img/st2.png" alt="" /> |


Here we are looking for jsname with value `vWLAgc`

So our algorithm is like this for every stock

1. get current price of stock

2. Prints if the current price is greater than my desired selling price

3. Prints if the current price is smaller then my desired buying prices

I'll be using `reportlab` library to generate `pdf` for my output.

Run this command using

```bash
$ poetry run python stock/main.py
```

<script src="https://gist.github.com/tushar-sharma/7e84b10f862999d6a2c802cd6e1cc036.js"></script>

The output looks like this

| <img align="center" src="{{ root_url }}/img/st3.png" alt="" /> |

Of course predicting the buying and selling prices is an uphill task. May be you can call up Warren Buffett for tips. But I can't since he doesn't pick up my call 😢. So in next tutorial we'll do some technical analysis on stocks.
