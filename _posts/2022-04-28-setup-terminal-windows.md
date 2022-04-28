---
published: false
---
1. First install WSL 2 

2. Install Ubuntu

```bash
$ wsl --install -d Ubuntu
```

3. Using Windows Terminal, go to `settings` and change default to `Ubuntu`.

4. Install `exas` 

```bash
# from the installation page https://the.exa.website/#installation
$ wget -c https://github.com/ogham/exa/releases/download/v0.10.0/exa-linux-x86_64-v0.10.0.zip
$ unzip exa-linux-x86_64-v0.10.0.zip
$ sudo mv bin/exa /usr/local/bin/exa
```