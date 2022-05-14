---
published: false
---


# Neovim Setup with Lunarvim 

**NOTE** : As of today (May 14, 2022), Lunarvim requires Neovim v0.7 or higher. So we will install `neovim` from the source to get the latest version.

```bash
$ sudo apt-get install libtool libtool-bin m4 automake cmake gettext
$ cd 
$ git clone https://github.com/neovim/neovim
$ cd neovim
$ git checkout stable
$ make CMAKE_BUILD_TYPE=Release
$ sudo make install
```



# To install `Lunar Vim`

