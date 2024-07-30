---
layout: post
title: Git Stash Tutorial
image: /img/
thumb: /img/
author: tushar sharma
category: blog
---

Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.<!-- truncate_here -->

Git stash is nifty feature. Lets say you are in a branch but need to checkout another but you have modified some files and you dont want to lose those changes.

```bash
$ git stash
```

To pull your changes back 

```bash
$ git stash pop
# handing conflict better
$ git stash apply
$ git stash drop
```

If you want to save only one file 

```
$ git stash push path/to/your/file
```
