---
layout: post
title: "Add Fugitive Git Blame to LunarVim with a 50 Percent Blame Window"
category: blog
tags:
  - vim
  - neovim
  - lunarvim
  - git
  - tutorial
name: fugitive-blame-lunarvim-window-width
thumb: 'https://unsplash.com/photos/8IJ5xNTv1QM/download?w=437'
summary: Install vim-fugitive in LunarVim and keep Git blame readable by resizing the blame split to half the editor.
image: 'https://unsplash.com/photos/8IJ5xNTv1QM/download?w=437'
author: Tushar Sharma
published: false
---

[`vim-fugitive`](https://github.com/tpope/vim-fugitive) gives you a proper `:Git blame` view inside LunarVim. The annoying part is that the blame window can become too wide when author names, dates, or commit metadata are long. On a laptop screen that means you can see the committers, but not enough of the code.<!-- truncate_here -->

[`vim-fugitive`](https://github.com/tpope/vim-fugitive) gives you a proper `:Git blame` view inside LunarVim. The annoying part is that the blame window can become too wide when author names, dates, or commit metadata are long. On a laptop screen that means you can see the committers, but not enough of the code.

This post shows the full setup from a fresh laptop:

1. Install the basic tools.
2. Install LunarVim.
3. Add `vim-fugitive` to `~/.config/lvim/config.lua`.
4. Force Fugitive's blame split to stay at 50 percent of the editor width.
5. Verify the setup with a tiny Git repository.

## What We Want

The final workflow should be simple:

```vim
:Git blame
```

After running that command, LunarVim should open a scroll-bound vertical blame window. The blame pane should use half the editor width, leaving the other half for code.

## Install the Base Tools

On macOS, install the common dependencies with Homebrew:

```bash
$ brew install git neovim ripgrep fd node python
```

If you do not have Homebrew yet, install it first from the [official Homebrew website](https://brew.sh/).

On Ubuntu or Debian:

```bash
$ sudo apt update
$ sudo apt install -y git curl neovim ripgrep fd-find nodejs npm python3 python3-pip
```

Verify the important commands:

```bash
$ git --version
$ nvim --version
```

LunarVim requires Neovim. If your operating system ships an old Neovim version, install a newer Neovim release before installing LunarVim.

## Install LunarVim

Install LunarVim using the official installer command for the release you want. Check the [official LunarVim installation guide](https://www.lunarvim.org/docs/installation) if a newer release exists. For LunarVim release `1.4` with Neovim `0.9`, the command is:

```bash
$ LV_BRANCH='release-1.4/neovim-0.9' bash <(curl -s https://raw.githubusercontent.com/LunarVim/LunarVim/release-1.4/neovim-0.9/utils/installer/install.sh)
```

Open LunarVim once so it can finish installing plugins:

```bash
$ lvim
```

Then quit:

```vim
:q
```

Create the LunarVim config directory if it does not exist:

```bash
$ mkdir -p ~/.config/lvim
```

Open the config file:

```bash
$ lvim ~/.config/lvim/config.lua
```

If this is a new laptop, the file may be empty or small. That is fine.

## Add vim-fugitive

LunarVim lets you add user plugins through `lvim.plugins`. The official plugin configuration docs are at [LunarVim user plugins](https://www.lunarvim.org/docs/configuration/plugins/user-plugins).

If you do not already have a plugin list, add this to `~/.config/lvim/config.lua`:

```lua
lvim.plugins = {
  { "tpope/vim-fugitive" },
}
```

If you already have a plugin list, add only the Fugitive line inside the existing table:

```lua
lvim.plugins = {
  -- keep your existing plugins here
  { "tpope/vim-fugitive" },
}
```

Save the file and restart LunarVim:

```vim
:w
:q
```

Then start LunarVim again:

```bash
$ lvim
```

Open the plugin manager and sync plugins:

```vim
:Lazy sync
```

Restart LunarVim after the sync completes.

## Keep the Blame Window at 50 Percent

Fugitive already creates a nice `:Git blame` split. The problem is the width. Fugitive sizes the blame split based on the blame annotation text. Long author names or metadata can push the blame pane too far across the screen.

Add this after your `lvim.plugins` block in `~/.config/lvim/config.lua`:

```lua
vim.api.nvim_create_autocmd("FileType", {
  group = vim.api.nvim_create_augroup("lvim_fugitive_blame_width", { clear = true }),
  pattern = "fugitiveblame",
  callback = function()
    local win = vim.api.nvim_get_current_win()

    -- Fugitive resizes blame by annotation length; keep it to half the editor.
    vim.schedule(function()
      if vim.api.nvim_win_is_valid(win) and vim.bo[vim.api.nvim_win_get_buf(win)].filetype == "fugitiveblame" then
        pcall(vim.api.nvim_win_set_width, win, math.floor(vim.o.columns * 0.5))
      end
    end)
  end,
})
```

The important pieces are:

1. `pattern = "fugitiveblame"` runs this only for Fugitive blame buffers.
2. `vim.schedule(...)` lets Fugitive finish opening and resizing its own window first.
3. `vim.api.nvim_win_set_width(...)` resizes the blame window to half the current editor width.
4. `pcall(...)` prevents the config from crashing if Neovim cannot resize the window in a very narrow terminal.

Your minimal `config.lua` now looks like this:

```lua
lvim.plugins = {
  { "tpope/vim-fugitive" },
}

vim.api.nvim_create_autocmd("FileType", {
  group = vim.api.nvim_create_augroup("lvim_fugitive_blame_width", { clear = true }),
  pattern = "fugitiveblame",
  callback = function()
    local win = vim.api.nvim_get_current_win()

    vim.schedule(function()
      if vim.api.nvim_win_is_valid(win) and vim.bo[vim.api.nvim_win_get_buf(win)].filetype == "fugitiveblame" then
        pcall(vim.api.nvim_win_set_width, win, math.floor(vim.o.columns * 0.5))
      end
    end)
  end,
})
```

## Dry Run with a Sample Repository

Before trying this on a real project, create a tiny Git repository:

```bash
$ mkdir -p /tmp/lvim-blame-demo
$ cd /tmp/lvim-blame-demo
$ git init
$ git config user.name "Ada Lovelace"
$ git config user.email "ada@example.com"
$ printf 'one\ntwo\nthree\n' > notes.txt
$ git add notes.txt
$ git commit -m "Add notes"
```

Now change one line as a different author:

```bash
$ git config user.name "Grace Hopper"
$ git config user.email "grace@example.com"
$ printf 'one\ntwo changed\nthree\n' > notes.txt
$ git add notes.txt
$ git commit -m "Update second line"
```

Open the file:

```bash
$ lvim notes.txt
```

Run:

```vim
:Git blame
```

You should now see:

1. A blame pane on the left.
2. Your source file on the right.
3. The blame pane using roughly 50 percent of the editor width.
4. Both windows scrolling together.

## Useful Fugitive Blame Keys

Inside the blame window:

| Key | What it does |
| --- | --- |
| `g?` | Show Fugitive blame help |
| `gq` | Close the blame window |
| `<CR>` | Open the commit for the current blamed line |
| `o` | Open the commit in a horizontal split |
| `O` | Open the commit in a new tab |
| `p` | Open the commit in a preview window |
| `A` | Resize to the end of the author column |
| `C` | Resize to the end of the commit column |
| `D` | Resize to the end of the date column |

The `A`, `C`, and `D` keys are still useful when you want Fugitive's original column-based sizing temporarily. The autocmd only runs when the blame buffer is created, so manual resizing still works after the window opens.

## Troubleshooting

### `:Git blame` is not a command

Fugitive did not load. Check that this line exists in `~/.config/lvim/config.lua`:

```lua
{ "tpope/vim-fugitive" },
```

Then run:

```vim
:Lazy sync
```

Restart LunarVim after the sync finishes.

### The blame window is still too wide

Check that the autocmd is outside the `lvim.plugins` table. This is correct:

```lua
lvim.plugins = {
  { "tpope/vim-fugitive" },
}

vim.api.nvim_create_autocmd("FileType", {
  -- autocmd config here
})
```

This is wrong:

```lua
lvim.plugins = {
  { "tpope/vim-fugitive" },

  vim.api.nvim_create_autocmd("FileType", {
    -- do not put autocmds inside lvim.plugins
  })
}
```

### The split is close to 50 percent but not exact

That is normal. Neovim window borders, minimum widths, sidebars, and line number columns can make the final split a column or two off. The goal is not pixel-perfect sizing. The goal is to keep enough room for both blame metadata and code.

### You want a different size

Change `0.5` to another ratio:

```lua
math.floor(vim.o.columns * 0.4)
```

That makes the blame pane 40 percent of the editor width.

For a fixed width, use a number:

```lua
pcall(vim.api.nvim_win_set_width, win, 72)
```

## Final Config

Here is the complete focused setup:

```lua
-- Git integration
lvim.plugins = {
  { "tpope/vim-fugitive" },
}

vim.api.nvim_create_autocmd("FileType", {
  group = vim.api.nvim_create_augroup("lvim_fugitive_blame_width", { clear = true }),
  pattern = "fugitiveblame",
  callback = function()
    local win = vim.api.nvim_get_current_win()

    -- Fugitive resizes blame by annotation length; keep it to half the editor.
    vim.schedule(function()
      if vim.api.nvim_win_is_valid(win) and vim.bo[vim.api.nvim_win_get_buf(win)].filetype == "fugitiveblame" then
        pcall(vim.api.nvim_win_set_width, win, math.floor(vim.o.columns * 0.5))
      end
    end)
  end,
})
```

Now `:Git blame` is usable on a laptop screen: commit information on one side, readable code on the other.
