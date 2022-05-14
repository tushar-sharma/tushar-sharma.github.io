---
layout: post
title: Neovim Setup with LunarVim
category: blog
tags:
- vim
- neovim
- lunarvim
name: neovim-setup-lunarvim
thumb: https://unsplash.com/photos/8IJ5xNTv1QM/download?w=800
summary: Neovim Setup with LunarVim
image: https://unsplash.com/photos/8IJ5xNTv1QM/download?w=800
author: Tushar Sharma
---


I am an ardent `vim` user. A forked version of vim called `neovim` recently caught my attention. It has more features like support for `language server protocol` that provides `auto-complete`, etc. `LunarVim` provides neovim configuration files so that it behaves as an IDE.<!-- truncate_here -->
<p>Tags: {% for tag in page.tags %} <a class="mytag" href="/tag/{{ tag }}" title="View posts tagged with &quot;{{ tag }}&quot;">{{ tag }}</a>  {% if forloop.last != true %} {% endif %} {% endfor %}</p>

I am an ardent `vim` user. A forked version of vim called `neovim` recently caught my attention. It has more features like support for `language server protocol` that provides `auto-complete`, etc. `LunarVim` provides neovim configuration files so that it behaves as an IDE.

<blockquote class="attention">
As of today (May 14, 2022), Lunarvim requires Neovim v0.7 or higher. So we will install neovim from the source to get the latest version.
</blockquote>


## Install `neovim`


```bash
$ sudo apt-get install libtool libtool-bin m4 automake cmake gettext ninja-build autoconf g++ pkg-config unzip curl
$ git clone https://github.com/neovim/neovim
$ cd neovim
$ git checkout stable
$ make CMAKE_BUILD_TYPE=Release
$ sudo make install
```

You can start using `neovim` using 

```bash
$ nvim
```


### Install `tree-sitter` features like `syntax highlight`

```bash
$ git clone https://gitlab.com/jirgn/tree-sitter-fusion.git
$ cd tree-sitter-fusion
$ yarn install
```

### Install `packer.nvim`

```bash
$ git clone --depth 1 https://github.com/wbthomason/packer.nvim\
 ~/.config/nvim/site/pack/packer/start/packer.nvim
```

### Install `LunarVim`

```bash
$ curl -s https://raw.githubusercontent.com/ChristianChiarulli/lunarvim/rolling/utils/installer/install.sh | LVBRANCH=rolling bash -s -- --overwrite
```

To fetch the latest changes for `lunarvim`


```bash
$ cd ~/.local/share/lunarvim/lvim
$ git pull
```

Or by commandline

```bash
$ lvim +LvimUpdate +q
```

You can start using `Lunarvim` using 

```bash
$ lvim
```

<nav class="pagination clear" style="padding-bottom:20px;">
{% if page.previous.url %} <a class="prev-item" href="{{page.previous.url}}" title="Previous Post: {{page.previous.title}}">&larr;Previous</a>   {% endif %}  {% if page.next.url %}<a class="next-item" href="{{page.next.url}}" title="Next Post: {{page.next.title}}">Next&rarr;</a>         {% endif %}
</nav>