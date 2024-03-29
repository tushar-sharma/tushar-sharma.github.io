---
published: false
---

##  Use git alias for productivity

tags: git

You can create shortcuts in git using `alias`. Git looks for `.gitconfig` file in $HOME directory. You can view location of the file 

```bash
$ git config --list --show-origin
```

Now edit this file, `.gitconfig` and add the following section


```bash
[alias]
    co = checkout
    ci = commit 
    st = status
    br = branch
    a = add
    au = add -u 
    p = pus
    lg = log --graph --pretty=format:\"%Cred%h%Creset -%C(yellow)%d%Creset %s %Cgreen(%ad) %C(bold blue)<%an>%Creset\" --abbrev-commit --date=relative
    d = diff
    dc = diff --cached
    ds = diff --stat
    
```

So you both the commands are equivalent.

```bash
$ git status
$ git st
$ git co newBranch
```

Sometimes its good to be lazy. You can further add aliases in your terminal. For bash, you can edit `$HOME/.bashrc`

```bash
alias g='git'
ci() { git commit -m "$1"; }

```

So now you can type like

```bash
g st
g add file.txt
ci "added new file"
```

Feel free to downlaod my [DotFile](https://github.com/tushar-sharma/dotfiles)

https://blog.webdevsimplified.com/2021-10/advanced-git-commands/
https://tekloon.dev/setup-git-alias-improve-productivity
