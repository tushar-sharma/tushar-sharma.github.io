---
layout: comments
title: Tools
published: true
toc: true
toc_label: My Table of Contents
toc_icon: cog
---


<!-- dummy box begins -->
<div style="padding-bottom:60px; padding-top:20px; background : white;">
</div>

<h2 class="blue entry-title"><i class="fas fa-hammer"></i> Tools</h2>


|  Tools  | Type    | Customization | Description |
|---------+---------+--------------+--------------|
| [Firefox](https://www.mozilla.org/en-US/firefox/new/) | browser | [Vimimum](https://addons.mozilla.org/en-US/firefox/addon/vimium-ff/)| Vim like browser|
|         |         | [WooRank](https://addons.mozilla.org/en-US/firefox/addon/seo-website-analysis/) | SEO tool |
|         |         | [Adblock Plus](https://addons.mozilla.org/en-CA/firefox/addon/adblock-plus/) | Add blocker |
|         |         | [uBlock Origin](https://addons.mozilla.org/en-US/firefox/addon/ublock-origin/) | Add blocker  |
|         |         | [Soda Pdf Viewer](https://addons.mozilla.org/en-US/firefox/addon/soda-pdf-viewer/) | |
|         |         | [Unpaywall](https://addons.mozilla.org/en-US/firefox/addon/unpaywall/) | Read free research papers |
|         |         | [Wappalyzer](https://addons.mozilla.org/en-US/firefox/addon/wappalyzer/)  | Detect websitestack |
|         |         | [NoScript](https://addons.mozilla.org/en-US/firefox/addon/noscript/) | |
|         |         | [Ghostery](https://addons.mozilla.org/en-US/firefox/addon/ghostery/) | |
|         |         | [Decentraleyes](https://addons.mozilla.org/en-US/firefox/addon/decentraleyes/) | |
|         |         | [Cookie AutoDelete](https://addons.mozilla.org/en-US/firefox/addon/cookie-autodelete/) | |
|         |         | [HTTPS Everywhere](https://addons.mozilla.org/en-US/firefox/addon/https-everywhere/) | |
|         |         | [Textmarker](https://addons.mozilla.org/en-US/firefox/addon/textmarkerpro/) | |
|         |         | [OneTab](https://addons.mozilla.org/en-US/firefox/addon/onetab/) | |
|         |         | [Privacy Badger](https://addons.mozilla.org/en-US/firefox/addon/privacy-badger17/) | |
| [Ubuntu](https://ubuntu.com/)  | Operating System  |  | Details<sup><a href='#fn:3' rel='footnote'>3</a></sup> |
| [VS Code](https://code.visualstudio.com/)  | editor  | Gitpod | Type Shift+Command+P and select install `code` command in PATH. |
|                                            |          | [GitHub Copilot](https://code.visualstudio.com/docs/copilot/overview) |  |
|                                            |          | Git Graph      |  |
| Windows                                    |          | [qBittorrent](https://www.qbittorrent.org/)  |
|                                            |          | [Notepad++](https://notepad-plus-plus.org/downloads/) |
| [Neovim](https://github.com/neovim/neovim)  | editor  |  | Details<sup><a href='#fn:2' rel='footnote'>2</a></sup> for Windows  |
| [Winmerge](https://winmerge.org/)  | Diff  |  [Dotfiles](https://github.com/tushar-sharma/dotfiles)   |  |
| | Editor | | |
| [Vim](https://www.vim.org/)     | editor  | [Dotfiles](https://github.com/tushar-sharma/dotfiles) |
| [ConEmu ](https://conemu.github.io/)  | Terminal | Details<sup><a href='#fn:1' rel='footnote'>1</a></sup> | |
| [Cygwin](https://www.cygwin.com/)     | Terminal | Details<sup><a href='#fn:4' rel='footnote'>4</a></sup> | |
| [Warp](https://www.warp.dev/)              | Terminal | Currently supports only Mac |
| [Expressvpn](https://www.expressvpn.com/)  | VPN | | |
| [iMazing Converter](https://imazing.com/converter)  | Convert HEIC photos to JPG | Mac, Windows |


## Details

### <span id='fn:1'>Cygwin <a href='#fnref:1' rev='footnote'>&#8617;</a></span>

```bash
# Edit /etc/nsswitch.conf
db_shell: /bin/zsh
db_home: /%H
$ chere -i -t mintty
# Select following packages
bash-completion
fzf-zsh
fzf-zsh-completion
curl
tmux
vim
make
perl
tar
tig
unzip
wget
zip
zsh
git
chere
gcc-core
gdb
libboost-devel
gcc-g++
dconf
fontconfig
```


### <span id='fn:2'>Neovim on Windows <a href='#fnref:2' rev='footnote'>&#8617;</a></span>

```bash
# Open Powershell
# install scoop
> Invoke-Expression (New-Object System.Net.WebClient).DownloadString('https://get.scoop.sh')
# install neovim
> scoop install neovim
# install vim-plug
> iwr -useb https://raw.githubusercontent.com/junegunn/vim-plug/master/plug.vim |`
    ni $HOME/vimfiles/autoload/plug.vim -Force
# Open cygwin
$ cd $LOCALAPPDATA/nvim
$ wget https://raw.githubusercontent.com/tushar-sharma/dotfiles/master/nvim/init.vim
$ git clone https://github.com/neoclide/coc.nvim.git && cd coc.nvim
$ yarn install  && yarn build
$ cp -r build ~/.local/share/nvim/plugged
```

### <span id='fn:3'>Ubuntu <a href='#fnref:3' rev='footnote'>&#8617;</a></span>

```bash
# Allow close lid with laptops
$ sudo apt-get gnome-tweak-tool
```

### <span id='fn:4'>ConEmu<a href='#fnref:4' rev='footnote'>&#8617;</a></span>

```bash
# Install Fonts from here https://www.nerdfonts.com/font-downloads
# For Windows, install Windows Compatible otf/ttf files
# Fonts used
## 3270 Nerd Font
## Hack Nerd Font

# Change following
## Setting -> Fonts -> Hack NF
## Setting ->  Startup -> Tasks -> {Bash::Cygwin Bash} -> Default shell

# Install oh-my-zsh
$ sh -c "$(curl -fsSL https://raw.github.com/ohmyzsh/ohmyzsh/master/tools/install.sh)"

# Get Oh-my-zsh theme
$ git clone --depth=1 https://github.com/romkatv/powerlevel10k.git ${ZSH_CUSTOM:-$HOME/.oh-my-zsh/custom}/themes/powerlevel10k

# get .zshrc from my dotfiles repo
$ wget https://raw.githubusercontent.com/tushar-sharma/dotfiles/master/.zshrc

# configure it
$ p10k configure

# Change background image
$ Settings -> Background -> Path
```
