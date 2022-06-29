---
published: false
---
## Tips and Tricks in Linux Bash 

### Search a keyword in all files and open only matching files in vim

``bash
 $ grep -irl "search" * | xargs -o vim
```