---
layout: post
title: Monkey Patching Claude commit for AWS Bedrock
image: https://unsplash.com/photos/bLiuV2CKJcA/download?w=437
thumb: https://unsplash.com/photos/bLiuV2CKJcA/download?w=437
author: tushar sharma
tags:
 - claude code
 - ai
 - monkey-patching
category: blog
---

When AI is writing code, there's no reason not to have AI write the commit message too. I tried the handy tool [claude-commit](https://github.com/JohannLai/claude-commit), but ran into two issues when using Claude via AWS Bedrock on Python 3.14: a compatibility error with Rich's `Console.print()` and missing Bedrock credentials.<!-- truncate_here -->


When AI is writing code, there's no reason not to have AI write the commit message too. I tried the handy tool [claude-commit](https://github.com/JohannLai/claude-commit), but ran into two issues when using Claude via AWS Bedrock on Python 3.14: a compatibility error with Rich's `Console.print()` and missing Bedrock credentials.


## Initial Installation

First, install `claude-commit` using `pipx`:

```bash
pipx install claude-commit
```

## Problems Encountered

### 1. TypeError with Console.print()

When running `claude-commit` you may see this error:

```python
TypeError: Console.print() got an unexpected keyword argument 'file'
```

**Root cause**: Python 3.14 compatibility issue with the `rich` library's `Console.print()` method. The `file` parameter is no longer supported in newer versions.

### 2. Authentication Issues

Even after fixing the TypeError, authentication fails because `claude-commit` doesn't automatically pick up AWS Bedrock credentials from Claude Code's configuration file (`~/.claude/settings.json`).

## The Solution: Creating a Patched Wrapper

Create a a monkey-patched wrapper script that fixes both issues.

### Step 1: Create the Wrapper Script

Create a file at `~/.local/bin/claude-commit-patch` with the following content.
The script does two things: load environment variables from your Claude Code settings and monkey-patch `rich.Console.print` to drop the unsupported `file` argument.

{% template  customCode.html %}
---
id: 7ef971334d27308e5299add3bd74d9ab
file: monkey-patch.py
---
{% endtemplate %}

Shebang notes

- If you want the wrapper to use the exact `pipx` virtualenv Python, use the absolute path to that Python as the shebang (example below). This is the most reliable way to ensure the wrapper runs with the same environment that installed `claude-commit`.
- For portability, you can use `#!/usr/bin/env python3` — it will pick the first `python3` on `PATH`. Make sure that `python3` is the one that has access to `claude-commit` and its dependencies.

Find the pipx venv python with:
```bash
ls -la ~/.local/pipx/venvs/claude-commit/bin/python
```

Example shebang options:

Absolute (reliable):
```python
#!/Users/youruser/.local/pipx/venvs/claude-commit/bin/python
```

Portable (uses PATH):
```python
#!/usr/bin/env python3
```
```bash
ls -la ~/.local/pipx/venvs/claude-commit/bin/python
```

### Step 2: Make It Executable

```bash
chmod +x ~/.local/bin/claude-commit-patch
```

### Step 3: Update Git Configuration

Add convenient aliases to your `~/.gitconfig` (adjust paths for your home):

```ini
[alias]
    claude = "!/Users/tushar/.local/bin/claude-commit-patch"
    claude-auto = "!/Users/tushar/.local/bin/claude-commit-patch --commit"
    claude-all = "!/Users/tushar/.local/bin/claude-commit-patch --all"
    claude-copy = "!/Users/tushar/.local/bin/claude-commit-patch --copy"
    cc = "!/Users/tushar/.local/bin/claude-commit-patch --commit"
```

**Note**: Update the path to match your home directory.

## How It Works

What the wrapper does

- Loads AWS Bedrock credentials from `~/.claude/settings.json` and sets them in `os.environ` so `claude-commit` can authenticate with Bedrock.
- Monkey-patches `rich.Console.print()` to remove the unsupported `file` kwarg that causes a TypeError on Python 3.14.
- Imports and runs `claude-commit` from the environment the script is executed in.

## Usage

With `alias g='git'` in your shell (`.zshrc` or `.bashrc`):

```bash
# Preview commit message
g claude

# Auto-commit with AI-generated message
g cc

# Include all untracked files
g claude-all

# Copy message to clipboard (no commit)
g claude-copy
```

Or run directly:

```bash
claude-commit-patch
claude-commit-patch --commit
```

## Verification

Test that it works:

```bash
cd /path/to/your/repo
claude-commit-patch
```

Expected output (example):
```
Claude is analyzing your changes...
✨ Analysis complete!

╭─── 📝 Generated Commit Message ───╮
│                                   │
│  your commit message here         │
│                                   │
╰───────────────────────────────────╯
```


## Troubleshooting

### Troubleshooting

- Script location: ensure `~/.local/bin` (or wherever you put it) is in your `PATH`:
```bash
which claude-commit-patch
```

- Shebang: confirm the first line of the script is the interpreter you expect:
```bash
head -1 ~/.local/bin/claude-commit-patch
```

- AWS/BEDROCK env: ensure `~/.claude/settings.json` includes an `env` object, for example:
```json
{
    "env": {
        "CLAUDE_CODE_USE_BEDROCK": "1",
        "AWS_REGION": "us-east-1",
        "AWS_PROFILE": "default"
    }
}
```