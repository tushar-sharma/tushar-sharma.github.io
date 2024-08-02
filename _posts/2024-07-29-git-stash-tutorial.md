---
layout: post
title: Git Stash Tutorial
image: 'https://unsplash.com/photos/FFaoc94hhKs/download?w=800'
thumb: 'https://unsplash.com/photos/FFaoc94hhKs/download?w=800'
author: tushar sharma
category: blog
tags:
 - git
---

git stash is a powerful and nifty feature in Git that allows you to temporarily set aside changes you've made to your working directory. This can be incredibly useful when you need to switch branches but aren't ready to commit your changes. Here’s a comprehensive guide on how to use git stash effectively.<!-- truncate_here -->

git stash is a powerful and nifty feature in Git that allows you to temporarily set aside changes you've made to your working directory. This can be incredibly useful when you need to switch branches but aren't ready to commit your changes. Here’s a comprehensive guide on how to use git stash effectively.

## The Basics of git stash

Imagine you are working on a branch and you need to check out another branch. However, you have uncommitted changes that you don't want to lose. This is where git stash comes into play.

To stash your changes, simply run:


```bash
$ git stash
```

This command will save your modified tracked files and staged changes in a new stash and revert your working directory to match the HEAD commit.


## Retrieving Your Changes

When you're ready to retrieve your stashed changes, you have a couple of options:


### git stash pop

This command will apply the most recent stash and then remove it from the stash list.


```bash
$ git stash pop
```

If there are conflicts, you’ll need to resolve them manually before proceeding.

### git stash apply

If you prefer to apply the stash but keep it in the stash list (perhaps you want to keep it for later use), use git stash apply:

```bash
$ git stash apply
```

After resolving any conflicts, you can remove the stash entry with:

```bash
$ git stash drop
```

## Stashing Specific Files

If you only want to stash changes to a specific file or set of files, you can use the push option with the file path:

```bash
$ git stash push path/to/your/file
```

This will stash only the specified file while leaving other changes in your working directory.

### Viewing and Managing Stashes

You can view a list of all stashes you have saved with:

```bash
$ git stash list
```

This will show you a list of all stash entries, each with an index and a description.

To apply a specific stash from the list, use its index:

```bash
$ git stash apply stash@{index}
```

For example:

```bash
$ git stash apply stash@{1}
```

To drop a specific stash from the list, again use its index:

```bash
$ git stash drop stash@{index}
```

## Applying Stash with Untracked Files

By default, git stash only stashes tracked files. If you want to stash untracked files as well, use the -u option:

```bash
$ git stash -u
```

## Creating a Stash with a Message

You can add a custom message to your stash entry to make it easier to identify later:

```bash
$ git stash save "Testing my stash"
```

## Examples and Scenarios

### Switching Branches with Uncommitted Changes


You're working on feature-branch and need to switch to main to review a pull request, but you have uncommitted changes:

```bash
$ git stash
$ git checkout main
```

After reviewing, you can return to your branch and reapply your changes:

```bash
$ git checkout feature-branch
$ git stash pop
```

### Stashing Part of Your Work

You're working on multiple files but only want to stash changes to file1.txt:

```bash
$ git stash push path/to/file1.txt
```

The rest of your working directory remains unchanged.

### Resolving Conflicts with git stash apply

To handle conflicts better, use `git stash`apply followed by `git stash drop`:

```bash
$ git stash apply
# Resolve conflicts
$ git stash drop

```

### Stashing Multiple Times and Applying a Specific Stash

Sometimes, you might need to stash changes multiple times and later apply a specific stash. Here’s how you can manage multiple stashes:

```bash
$ git stash save "WIP: Implementing feature A"
$ git stash save "WIP: Fixing bug B"
$ git stash save "WIP: Refactoring module C"
```

To list all your stashes:

```bash
$ git stash list
```

This might output something like:


```bash
stash@{0}: WIP: Refactoring module C
stash@{1}: WIP: Fixing bug B
stash@{2}: WIP: Implementing feature A
```

To apply a specific stash, for example, the one for fixing bug B:


```bash
$ git stash apply stash@{1}
```

After resolving any conflicts, you can drop the applied stash:

```bash
$ git stash drop stash@{1}
```

`git stash` is an essential tool for any developer using Git. It allows you to temporarily shelve your changes, giving you the flexibility to switch contexts without losing your progress.
