---
layout: post
title: Neovim Setup with LunarVim
category: blog
tags:
  - vim
  - neovim
  - lunarvim
name: neovim-setup-lunarvim
thumb: 'https://unsplash.com/photos/8IJ5xNTv1QM/download?w=437'
summary: Neovim Setup with LunarVim
image: 'https://unsplash.com/photos/8IJ5xNTv1QM/download?w=437'
author: Tushar Sharma
published: true
---


I am an ardent `vim` user. A forked version of vim called `neovim` recently caught my attention. It has more features like support for `language server protocol` that provides `auto-complete`, etc. `LunarVim` provides neovim configuration files so that it behaves as an IDE.<!-- truncate_here -->

I am an ardent `vim` user. A forked version of vim called `neovim` recently caught my attention. It has more features like support for `language server protocol` that provides `auto-complete`, etc. `LunarVim` provides neovim configuration files so that it behaves as an IDE.

> As of today (May 14, 2022), Lunarvim requires Neovim v0.7 or higher. So we will install neovim from the source to get the latest version.

## Install `neovim`


```bash
$ sudo apt-get install libtool libtool-bin m4 automake cmake gettext ninja-build autoconf g++ pkg-config unzip curl
$ git clone https://github.com/neovim/neovim
$ cd neovim
$ git checkout stable
$ make CMAKE_BUILD_TYPE=Release
$ sudo make install
# If  error on previous command
$ sudo make distclean; make
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

If you get error as Yarn install command error No such file or directory: 'install' then

```bash
$ sudo apt remove cmdtest

$ npm -g install yarn

```

### Install `packer.nvim`

```bash
$ git clone --depth 1 https://github.com/wbthomason/packer.nvim\
 ~/.config/nvim/site/pack/packer/start/packer.nvim
```

### Install `LunarVim`

```bash
$ LV_BRANCH='release-1.2/neovim-0.8' bash <(curl -s https://raw.githubusercontent.com/lunarvim/lunarvim/fc6873809934917b470bff1b072171879899a36b/utils/installer/install.sh)
```

Or go to the [website](https://www.lunarvim.org/) to get latest installation command.

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
vim.cmd("set foldmethod=indent")
vim.cmd("set foldlevel=0")
vim.cmd("set ai")
vim.cmd("set listchars=eol:$,tab:>-,trail:~,extends:>,precedes:<")
-- show list will show all characters

--stop auto indent
vim.cmd("set indentexpr=")

--zoom in and out
vim.cmd("noremap z2 <c-w>_ \\| <c-w>\\|")
vim.cmd("noremap z1 <c-w>=")

vim.cmd [[
    set tabstop=4
    set shiftwidth=4
    set softtabstop=4
    set backspace=indent,eol,start
    set expandtab
    set autoindent
    set smarttab
    set encoding=utf-8
    set incsearch
    set hlsearch
]]

-- remove trailing whitespace --
function stripTrailing()
    local l = vim.fn.line(".")
    local c = vim.fn.col(".")
    vim.api.nvim_command("%s/\\s\\+$//e")
    vim.api.nvim_command("call cursor(" .. l .. ", " .. c .. ")")
end

vim.api.nvim_command("autocmd BufWritePre * lua stripTrailing()")
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

### Errors

```
Error detected while processing VimEnter Autocommands for "*":
Error executing lua callback: .../.local/share/lunarvim/lvim/lua/lvim/core/treesitter.lua:185: VimEnter Autocommands for "*":
 Vim(lua):Installation not possible: ...er/start/nvim-treesitter/lua/nvim-treesitter/install.lua:52: Parser not available for
 language "vimdoc"
```

#### Solution 

```
cd ~/.local/share/lunarvim/site/pack/packer/start/nvim-treesitter/
git pull origin master
```

```
Error executing lua: ...im/0.9.0/share/nvim/runtime/lua/vim/treesitter/query.lua:259
```

#### Solution

```
:TSInstall all
```
