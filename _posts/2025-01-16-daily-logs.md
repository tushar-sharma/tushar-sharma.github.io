

## Git worktree

If you remove wokrtree forcefull like 

```bash
$ rm -fr somefolder/worktree
```

If you try to add the worktree again

```
$ git worktree add somefolder/worktree mybranch

the branch is already checked out
```

you can prune changes

```
$ git worktree prune
```



