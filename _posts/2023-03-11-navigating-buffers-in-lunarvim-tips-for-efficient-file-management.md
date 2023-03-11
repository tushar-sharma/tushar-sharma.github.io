---
published: false
---
Navigating Buffers in LunarVim: Tips for Efficient File Management

I love `lunarvim`. It allows me open multiple files using `Telescope` or `vsploit`. 

However I found it cubersome to use mouse to change files. 

You can use `:bp` command to switch sequentially between files. 

However if you want to jump to a specific file, 

First get the buffer number by typing `ls`

Now type

```
:buffer 2

```

This allows you to quickly switch to a specific buffer, without having to cycle through all open buffers using the :bn and :bp commands.

In addition to switching to a specific buffer, you can also navigate the buffer list by a specific count using the `:bnext` and `:bprev` commands. These commands allow you to skip over certain buffers in the buffer list and navigate directly to the buffer you want.

In conclusion, LunarVim offers powerful features for navigating buffers, including the ability to switch to a specific buffer by its number, and the ability to navigate the buffer list by a specific count. These features can save you time and help you work more efficiently, whether you are working on a small project or a large codebase. So give them a try and see how they can improve your workflow in LunarVim!




