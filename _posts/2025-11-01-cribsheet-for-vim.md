---
layout: post
title: "Cribsheet for Vim"
date: 2025-11-01 12:00:00 -0500
categories: blog
tags:
 - vim
author: tushar sharma
image: https://unsplash.com/photos/V9mZ4jUcukw/download?w=437
thumb: https://unsplash.com/photos/V9mZ4jUcukw/download?w=437
---

vim is a text editor that is a clone of the vi editor.<!-- truncate_here -->

vim is a text editor that is a clone of the vi editor.

### Overview

vim has two "modes": COMMAND mode and INSERT mode. In COMMAND mode, you execute commands (like undo, redo, find and replace, quit, etc.). In INSERT mode, you type text. There is a third mode, VISUAL mode, that is used to highlight and edit text in bulk. To go into INSERT mode from COMMAND mode, you type i. To go back to COMMAND mode, you type the esc key. vim starts out in COMMAND mode.

### Reloading a file

If a file has been changed on disk, you can reload it in Vim without closing and reopening it.

```
:e
```

### Useful `set` commands

*   `:set wrap` - This will wrap long lines of text.
*   `:set ai` - This stands for "autoindent" and will automatically indent new lines.
