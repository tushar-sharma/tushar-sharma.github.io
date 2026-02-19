---
published: false
tags:
  - tmux
---


## Install the config


```bash
cd 
curl -O https://raw.githubusercontent.com/tushar-sharma/dotfiles/refs/heads/master/.tmux.conf
```

## Run commands

Use `Ctrl + a` as the tmux prefix, then run these commands:

- **Rename terminal** : prefix + ',' (comma)

- **Rename the pane**: Type `select-pane -T <your name>`

- **View all panes**: prefix + `w`

- **Reset pane size**: prefix + '+'

- **Move/resize the current pane**: prefix Use H, J, K, L to move left, down, up, and right.

- **Split horizontally:** prefix + `"`

- **Split vertically:** prefix + `%`

- **Copy mode:**: prefix + `[` then use arrows/vi keys

- **Detach session:** prefix + d

- **List sessions:**: `tmux ls`

- **Reattach:** `tmux attach -t <name>`

- **Rename session:** prefix + $

- **Swap pane positions:** prefix + { or }

- **Zoom/unzoom pane:** prefix + z


