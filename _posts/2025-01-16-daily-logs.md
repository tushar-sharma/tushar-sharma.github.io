

## Git worktree

If you forcefully delete a Git worktree using:

rm -rf somefolder/worktree

and then attempt to re-add the same worktree:

git worktree add somefolder/worktree mybranch

you'll encounter the error:

fatal: 'mybranch' is already checked out at 'somefolder/worktree'

Solution: Prune Worktree References

To resolve this, prune the stale worktree references using:

git worktree prune

This command cleans up the metadata for removed worktrees, allowing you to re-add the worktree:

git worktree add somefolder/worktree mybranch



