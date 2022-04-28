---
published: false
---
1. First install WSL 2 

2. Install Ubuntu

```bash
$ wsl --install -d Ubuntu
```

3. Using Windows Terminal, go to `settings` and change default to `Ubuntu`.

4. Install `Oh-my-zsh`

```bash
$ sudo apt-get install git zsh -y
$ sh -c "$(curl -fsSL https://raw.github.com/ohmyzsh/ohmyzsh/master/tools/install.sh)"

```
5. Install `Powerlevel10k` theme

```bash
$ git clone --depth=1 https://github.com/romkatv/powerlevel10k.git ~/powerlevel10k
$ Set ZSH_THEME="powerlevel10k/powerlevel10k" in ~/.zshrc.
$ echo 'source ~/powerlevel10k/powerlevel10k.zsh-theme' >>~/.zshrc
$ zsh 
```

It will prompt powerlevel font setup. If not type

```bash
$ p10k configure
```

Next I choose following options for the prompt

```bash

    To the first questions I choose yes, as all the icons appeared correctly.
    Then I choose Rainbow style 
    I then choose Unicode
    And then 24-hour format
    Angled Separator
    Sharp separator to head
    Choose flat to the tail
    Two lines for prompt height
    Prompt Connection: Disconnected
    Prompt Frame: Left
    Frame color: Light
    Prompt space: Sparse
    Icons: Many icons 
    Prompt flow: Concise 
    Enable Transient Prompt: Yes 
    Instant Prompt: Verbose
    Applied changes to ./zshrc
```

Next Install `tmux`

```bash
$ sudo apt-get install tmux 
$ wget https://raw.githubusercontent.com/tushar-sharma/dotfiles/master/.tmux.conf
$ tmux -u
```

5. Next Install `exas` 

```bash
# from the installation page https://the.exa.website/#installation
$ wget -c https://github.com/ogham/exa/releases/download/v0.10.0/exa-linux-x86_64-v0.10.0.zip
$ unzip exa-linux-x86_64-v0.10.0.zip
$ sudo mv bin/exa /usr/local/bin/exa
```

Add following `alias` for exas in ~/.zshrc

```bash

```

