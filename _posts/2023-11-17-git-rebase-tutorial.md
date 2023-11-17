---
published: false
---
Git, a powerful version control system, is essential for managing and organizing files, especially in team environments. When working collaboratively, developers often create multiple branches to isolate their work. The git rebase command becomes crucial when you need to integrate changes from the master(sometimes can also be main) branch into your feature branch.

## Basic Rebase Command:


To perform a rebase, you'll first switch to your feature branch and then rebase it onto the master branch. This operation rewrites the project history by applying the changes made in the feature branch on top of the latest changes in the master branch.


```bash
$ git checkout myBranch
$ git rebase origin/master
```

Rebasing is instrumental in maintaining a linear project history, which simplifies many aspects of version control. By avoiding the creation of unnecessary merge commits, it offers a cleaner alternative to the `git merge` command in certain workflows.

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

## Best Practices

While using -X ours or -X theirs can be quick, it's often better to manually resolve conflicts using a merge tool. This approach ensures that you're making conscious decisions about the changes and maintaining the integrity of your codebase.

