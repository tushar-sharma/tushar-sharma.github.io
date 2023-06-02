---
layout: post
date: 2022-11-14
title: Setup a development environment on Windows using wsl2
tags:
 - wsl
 - windows
image: https://unsplash.com/photos/flha0KwRrRc/download?w=800
thumb: https://unsplash.com/photos/flha0KwRrRc/download?w=800
author: Tushar Sharma
---

Most of the terminal I have used in Windows were at best lackluster. However wsl2 is a game changer which makes your Windows OS Unixy.<!-- truncate_here -->
<p>Tags: {% for tag in page.tags %} <a class="mytag" href="/tag/{{ tag }}" title="View posts tagged with &quot;{{ tag }}&quot;">{{ tag }}</a>  {% if forloop.last != true %} {% endif %} {% endfor %} </p>

Most of the terminal I have used in Windows were at best lackluster. However wsl2 is a game changer which makes your Windows OS Unixy.

First download the Windows terminal form here. By default, it will open Windows Powershell.

| <img align="center"  loading="lazy" src="{{ root_url }}/img/wsl1.png" alt="" />|

Next we need to install `Ubuntu` virtual machine. Open Windows `Powershell` and type

```bash
> wsl --install -d Ubuntu
```

You might need to reboot for the changes to be updated.

You can select Ubuntu from the setting as default

| <img align="center"  loading="lazy" src="{{ root_url }}/img/wsl2.png" alt="" />|

Next, we'll make the `terminal` more usable.

First install `oh-my-zsh`.

```bash
$ sudo apt-get update -y
$ sudo apt-get install git zsh -y
$ sh -c "$(curl -fsSL https://raw.github.com/ohmyzsh/ohmyzsh/master/tools/install.sh)"
```

Install `nerd` font

* Download [Nerd Font](http://nerdfonts.com/). I downloaded [Mononoki](https://madmalik.github.io/mononoki/) font.
* Unzip and install it on Windows.
* In Settings -> Ubuntu -> Additional Settings -> Appearance -> Font face -> mononoki NF 

Open Command Palette -> settings.json

```json
profiles: {
    list: [
            {
                "colorScheme": "One Half Dark",
                "font": 
                {
                    "face": "mononoki NF",
                    "size": 14
                },
                "guid": "",
                "hidden": false,
                "name": "Ubuntu",
                "source": "Windows.Terminal.Wsl"
            }
    ]
}
```

Install `Powerlevel10k` theme

```bash
$ git clone --depth=1 https://github.com/romkatv/powerlevel10k.git ~/powerlevel10k

# Add following in ~/.zshrc
ZSH_THEME="powerlevel10k/powerlevel10k"
source ~/powerlevel10k/powerlevel10k.zsh-theme
$ zsh 
```

It will prompt powerlevel font setup. If not type

```bash
$ p10k configure
```

Edit `~/.p10k.zsh` to only show current directory

```bash
# change 
typeset -g POWERLEVEL9K_SHORTEN_STRATEGY=truncate_to_unique
# change it to 
typeset -g POWERLEVEL9K_SHORTEN_STRATEGY=truncate_to_last
```

Install `tmux` for multi-pane environment.

```bash
$ sudo apt-get install tmux
$ cd 
$ wget https://raw.githubusercontent.com/tushar-sharma/dotfiles/master/.tmux.conf
$ tmux -u 
```

Install lunarvim from [here](https://randomwits.com/blog/neovim-setup-with-lunarvim).