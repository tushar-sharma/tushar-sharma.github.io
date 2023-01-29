---
published: false
---
## Git

When you do `git status` sometimes, you dont want to ignore some files. For example if you dont want to see `deleted` files.

```bash
$ git status | grep -v deleted
```

Hre -v is for invert-search. You can type `man grep` for more detail. 

