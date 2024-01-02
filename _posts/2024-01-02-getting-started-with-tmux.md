---
published: false
---

## Setup

```
$ cd
$ wget https://raw.githubusercontent.com/tushar-sharma/dotfiles/master/.tmux.conf
$ tmux -u
```

Replaced '`Cltr+B` with `Cltr+A`.

## Detach a session

`Cltr + A` and then `D`

## Reattach a session

```bash
$ tmux ls
$ tmux attach -d -t 0
```
