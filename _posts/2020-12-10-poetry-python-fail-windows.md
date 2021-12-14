---
layout: post
title: EnvCommandError in Windows using Poetry
category: blog
tags:
- windows
- python
- poetry
- bug
name: poetry-windows-fail
thumb: https://i.imgur.com/ceIoDSn.jpeg
---

Poetry is a great dependency management tool in python. It's better than managing a flat file like `requirements.txt`. There are also other great tools like pipenv. However I found poetry much simpler in resolving dependencies.<!-- truncate_here -->

<p>Tags: {% for tag in page.tags %} <a class="mytag" href="/tag/{{ tag }}" title="View posts tagged with &quot;{{ tag }}&quot;">{{ tag }}</a>  {% if forloop.last != true %} {% endif %} {% endfor %} </p>

<p>Poetry is a great dependency management tool in python. It's better than managing a flat file like `requirements.txt`. There are also other great tools like pipenv. However I found poetry much simpler in resolving dependencies. </p>

 Recently poetry has been crashing on my Windows machine. However, I have not encountered this issue in other platform like Linux. Folks who are unfamiliar with poetry, below is a quick refresher.

In cygwin, install poetry

```bash
$ curl -sSL https://raw.githubusercontent.com/python-poetry/poetry/master/get-poetry.py | python
```

Check the curent version

```bash
$ poetry -version 
1.0.5
```

Initialize poetry by creating a `pyproject.toml` file. 

```bash
$ poetry init
```

Now add some library like `pandas`

```bash 
$ poetry add pandas
```

However this command is causing the poetry to crash

```bash
Creating virtualenv myproject-xkRwmYf0-py3.7 in .venv

[Env CommandError]
Command ['.venv\\myproject\\Scripts\\python.exe', '-'] errored with the follwiong return code 1, and output:
The system cannot find the path specified
input was : import sys

is hasattr(sys, "real_prefix"):
    print(sys.real_prefix)
elif hasattr(sys, "base_prefix"):
    print(sys.base_prefix)
else:
    print(sys.prefix)
```

Since poetry tries to create virtualenv under `.venv` folder, there's a quick workaround by removing `carriage return` from activate Scripts

```bash 
$ perl -pe 's/\r$//' < .venv/myproject-xkRwmYf0-py3.7/Scripts/activate > activate
$ mv activate .venv/myproject-xkRwmYf0-py3.7/Scripts/activate 

```

Then you can manually activate the virtualenv like this 

```bash
$ . .venv/myproject-xkRwmYf0-py3.7/Scripts/activate 
(myproject-xkRwmYf0-py3.7) $ 
```


Then you can simply install dependencies like 

```bash
(myproject-xkRwmYf0-py3.7) $  poetry add pandas
```

Lastly , you can deactive the virtualenv like 

```bash
(myproject-xkRwmYf0-py3.7) $ deactivate
$ 
```

This manual method may not be the best solution. May be future updates of poetry fixes this issue on Windows. 


<nav class="pagination clear" style="padding-bottom:20px;">
{% if page.previous.url %} <a class="prev-item" href="{{page.previous.url}}" title="Previous Post: {{page.previous.title}}">&larr;Previous</a>   {% endif %}  {% if page.next.url %}<a class="next-item" href="{{page.next.url}}" title="Next Post: {{page.next.title}}">Next&rarr;</a>         {% endif %}
</nav>