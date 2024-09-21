---
layout: post
title: Navigating Buffers in LunarVim
category: blog
tags:
  - neovim
  - vim
  - lunarvim
thumb: https://unsplash.com/photos/tSJc5U6f1M4/download?w=437
image: https://unsplash.com/photos/tSJc5U6f1M4/download?w=437
author: Tushar Sharma
published: true
---

Lunarvim is a powerful tool that can enhance productivity for advanced software engineers. One feature that is particularly useful for working with multiple files is `vsplit` and `telescope`. However, it can become cumbersome to navigate between files using a mouse. <!-- truncate_here -->

Lunarvim is a powerful tool that can enhance productivity for advanced software engineers. One feature that is particularly useful for working with multiple files is `vsplit` and `telescope`. However, it can become cumbersome to navigate between files using a mouse. 

Easiest way is to use `:bp` command. However it jumps files sequentially.

First get the buffer number by typing `:ls` which will display buffer number corresponding to the filename.

Now to make a jump to a specific file

```
:buffer 2
```

This allows you to quickly switch to a specific buffer, without having to cycle through all open buffers using the `:bn` and `:bp` commands.

I mostly avoid using mouse and love to do most of my work using `keyboard`.