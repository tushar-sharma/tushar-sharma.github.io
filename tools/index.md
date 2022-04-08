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
| [Chrome](https://www.google.com/chrome/)  | browser  | [Checkbot](https://chrome.google.com/webstore/detail/checkbot-seo-web-speed-se/dagohlmlhagincbfilmkadjgmdnkjinl) | SEO tool |
|         |         | [Grammarly](https://chrome.google.com/webstore/detail/grammarly-for-chrome/kbfnbcaeplbcioakkpcpgfkobkghlhen?hl=en) | |
|         |         | [Pop up blocker](https://chrome.google.com/webstore/detail/pop-up-blocker-for-chrome/bkkbcggnhapdmkeljlodobbkopceiche) | |
|         |         | [Screen Recorder](https://chrome.google.com/webstore/detail/screen-recorder/hniebljpgcogalllopnjokppmgbhaden) | |
|         |         | [HeadingsMap](https://chrome.google.com/webstore/detail/headingsmap/flbjommegcjonpdmenkdiocclhjacmbi) | Browse the headings structure of a websiteSS |
|         |         | [I dont care about cookies](https://chrome.google.com/webstore/detail/i-dont-care-about-cookies/fihnjjcciajhdojfnbdddfaoknhalnja) | Browse the headings structure of a websiteSS |
| [Ubuntu](https://ubuntu.com/)  | Operating System  |  | Details<sup><href='#fn:3' rel='footnote'>3</sup> |
| [VS Code](https://code.visualstudio.com/)  | editor  | Gitpod | Development environment |
|                                           |          | Github Copilot |  |
|                                           |          | Git Graph      |  |
| [Neovim](https://github.com/neovim/neovim)  | editor  |  | Details<sup><a href='#fn:2' rel='footnote'>2</a></sup> for Windows  |
| [Winmerge](https://winmerge.org/)  | Diff  |  [Dotfiles](https://github.com/tushar-sharma/dotfiles)   |  |
| [Notepad++](https://notepad-plus-plus.org/downloads/) | Editor | | |
| [Vim](https://www.vim.org/)     | editor  | [Dotfiles](https://github.com/tushar-sharma/dotfiles) |
| [Cygwin](https://www.cygwin.com/)  | Terminal | Details<sup><a href='#fn:1' rel='footnote'>1</a></sup> | |
| [qBittorrent](https://www.qbittorrent.org/)  | BitTorrent | | |

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
