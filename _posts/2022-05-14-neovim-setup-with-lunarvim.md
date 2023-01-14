---
layout: post
title: Neovim Setup with LunarVim
category: blog
tags:
  - vim
  - neovim
  - lunarvim
name: neovim-setup-lunarvim
thumb: 'https://unsplash.com/photos/8IJ5xNTv1QM/download?w=800'
summary: Neovim Setup with LunarVim
image: 'https://unsplash.com/photos/8IJ5xNTv1QM/download?w=800'
author: Tushar Sharma
published: true
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
# If  error on previous command
$ make distclean; make
```

You can verify version of `neovim`

```bash
$ nvim --version
NVIM v0.7.0
Build type: Release
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

### Enable 'Copy to Clipboard'

If you are using `wsl` on Windows, copy to clipboard might not work automatically. To fix that -

1. Go to [https://github.com/equalsraf/win32yank]( Windows clipboard tool) and download the latest `Releases`, for example -

```bash
$ curl -sLo/tmp/win32yank.zip https://github.com/equalsraf/win32yank/releases/download/v0.0.4/win32yank-x64.zip
$ unzip -p /tmp/win32yank.zip win32yank.exe > /tmp/win32yank.exe
$ chmod +x /tmp/win32yank.exe
$ sudo mv /tmp/win32yank.exe /usr/local/bin/
```

2. Add the following line to the file `~/.local/share/lunarvim/lvim/init.lua`

```lua
vim.cmd("set clipboard=unnamedplus")
```

Now you can copy using the following command

```bash
"+y
```

### Additional tweeks

1. Add the following line to the file `~/.local/share/lunarvim/lvim/init.lua`

```lua
--stop auto indent
vim.cmd("set indentexpr=")

--zoom in and out
vim.cmd("noremap zz <c-w>_ \\| <c-w>\\|")
vim.cmd("noremap zo <c-w>=")

--folding
vim.cmd("set foldmethod=indent")
vim.cmd("set foldlevel=0")

-- zo - opens folds
-- zc - closes fold
-- zm - increases auto fold depth
-- zr - reduces auto fold depth
```

2. Supress `diagnostic warnings` by adding the following to `lua/lvim/lsp/handlers.lua`.

```lua
  local diagnostic_opts = {
    underline = true,
    virtual_text = false, -- this it what you're looking for
    signs = false,
    update_in_insert = true,
  }

    vim.lsp.handlers["textDocument/publishDiagnostics"] = vim.lsp.with(vim.lsp.diagnostic.on_publish_diagnostics, diagnostic_opts)
```
