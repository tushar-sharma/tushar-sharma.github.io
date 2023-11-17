---
published: false
---
## Git rebase tutorial

Git, a powerful version control system, is essential for managing and organizing files, especially in team environments. When working collaboratively, developers often create multiple branches to isolate their work. The git rebase command becomes crucial when you need to integrate changes from the master(sometimes can also be main) branch into your feature branch.

## Basic Rebase Command:


To perform a rebase, you'll first switch to your feature branch and then rebase it onto the master branch. This operation rewrites the project history by applying the changes made in the feature branch on top of the latest changes in the master branch.


```bash
$ git checkout myBranch
$ git rebase origin/master
```

## Handling Conflicts

Rebasing can sometimes lead to conflicts, especially if changes in the feature branch overlap with those in the master branch. To resolve these conflicts, you can use a merge tool, but in some scenarios, you might prefer a simpler solution.


```bash
$ git checkout myBranch
$ git rebase --strategy-option ours origin/master
$ git rebase --strategy-option theirs origin/master
```

The --strategy-option (or -X for short) flag allows you to specify how conflicts should be resolved:

* **-X ours:** In case of a conflict, keep the changes from the master branch.

* **-X theirs:** In case of a conflict, keep the changes from your feature branch (myBranch).

