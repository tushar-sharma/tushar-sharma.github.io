---
published: false
---

##  Use git alias for productivity

tags: git

You can create shortcuts in git using `alias`. Git looks for `.gitconfig` file in $HOME directory. You can view location of the file 

```bash
$ git config --list --show-origin
```



Edit the `~/.gitconfig` file. 

```bash
[alias]
    co = checkout
    ci = commit 
    st = status
```


You can also create alias in shell, `vim ~/.bashrc`

```bash
alias g='git'

```
