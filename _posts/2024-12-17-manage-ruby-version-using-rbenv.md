---
layout: post
title: Manage Ruby Version using rbenv
image: https://unsplash.com/photos/EUIALcbnQYI/download?w=437
thumb: https://unsplash.com/photos/EUIALcbnQYI/download?w=437
author: tushar sharma
tags:
 - ruby
 - jekyll
category: blog
---

I usually build my `jekyll` website using `bundle install`. However I started getting following build error.<!-- truncate_here -->


I usually build my `jekyll` website using `bundle install`. However I started getting following build error: 

```bash
public_suffix-6.0.1 requires ruby version >= 3.0, which is incompatible with the current version, ruby 2.7.0
```

## Solution: Using rbenv to Manage Ruby Versions

`rbenv` is a lightweight Ruby version manager that lets you switch between multiple Ruby versions seamlessly.

### Step 1: Check Current Ruby Version

Run:

```bash
ruby --version
```

You'll likely see:

```
ruby 2.7.0
```

### Step 2: Install Ruby 3.1.2 with rbenv

1. Install the desired Ruby version:

```bash
rbenv install 3.1.2
```

2. Set it as the global default version:

```bash
rbenv global 3.1.2
```

3. Verify the installed versions:

```bash
rbenv versions
```

The output should list `3.1.2` as the active version.

### Step 3: Update Shell Configuration

If `ruby --version` still shows `2.7.0`, ensure your shell is properly configured to use `rbenv`.

1. Add the following lines to your shell configuration file (e.g., `~/.bashrc`, `~/.zshrc`, or `~/.bash_profile`):

```bash
export PATH="$HOME/.rbenv/bin:$PATH"
eval "$(rbenv init -)"
```

2. Reload your shell configuration:

```bash
source ~/.bashrc   # Or source ~/.zshrc
```

3. Rehash `rbenv` to update the shims:

```bash
rbenv rehash
```

### Step 4: Verify the Ruby Version

Check again:

```bash
ruby --version
```

Now, it should display:

```
ruby 3.1.2
```