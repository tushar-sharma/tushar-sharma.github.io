---
published: flase
---

# Fixing claude-commit with Python 3.14 and AWS Bedrock

A guide to resolving compatibility issues with `claude-commit` when using Python 3.14 and AWS Bedrock authentication.

## Background

`claude-commit` is a tool that uses Claude AI to automatically generate meaningful git commit messages based on your code changes. However, when using Python 3.14 and AWS Bedrock for authentication, you might encounter several issues.

## Initial Installation

First, install `claude-commit` using pipx:

```bash
pipx install claude-commit
```

## Problems Encountered

### 1. TypeError with Console.print()

When running `claude-commit`, you'll encounter this error:

```python
TypeError: Console.print() got an unexpected keyword argument 'file'
```

**Root cause**: Python 3.14 compatibility issue with the `rich` library's `Console.print()` method. The `file` parameter is no longer supported in newer versions.

### 2. Authentication Issues

Even after fixing the TypeError, authentication fails because `claude-commit` doesn't automatically pick up AWS Bedrock credentials from Claude Code's configuration file (`~/.claude/settings.json`).

## The Solution: Creating a Patched Wrapper

We created a monkey-patched wrapper script that fixes both issues.

### Step 1: Create the Wrapper Script

Create a file at `~/.local/bin/claude-commit-patch` with the following content:

```python
#!/Users/SharmaT1/.local/pipx/venvs/claude-commit/bin/python
"""
Monkey-patched wrapper for claude-commit that fixes Python 3.14 compatibility issues
with rich Console.print() file argument and ensures AWS Bedrock env vars are loaded.
"""
import sys
import os
import json

# Load Claude Code settings and set environment variables
settings_path = os.path.expanduser("~/.claude/settings.json")
if os.path.exists(settings_path):
    with open(settings_path, 'r') as f:
        settings = json.load(f)
        # Set environment variables from settings
        if 'env' in settings:
            for key, value in settings['env'].items():
                os.environ[key] = str(value)

# Monkey patch before importing anything from claude_commit
from rich.console import Console

# Save the original print method
_original_print = Console.print

# Create a wrapper that strips the 'file' argument
def patched_print(self, *args, **kwargs):
    # Remove 'file' argument if present (not supported in newer rich versions)
    kwargs.pop('file', None)
    return _original_print(self, *args, **kwargs)

# Apply the monkey patch
Console.print = patched_print

# Now import and run claude-commit
from claude_commit.main import main

if __name__ == '__main__':
    sys.exit(main())
```

**Important**: Update the shebang line (first line) to match your pipx installation path. Find it with:
```bash
ls -la ~/.local/pipx/venvs/claude-commit/bin/python
```

### Step 2: Make It Executable

```bash
chmod +x ~/.local/bin/claude-commit-patch
```

### Step 3: Update Git Configuration

Add convenient aliases to your `~/.gitconfig`:

```ini
[alias]
    claude = "!/Users/SharmaT1/.local/bin/claude-commit-patch"
    claude-auto = "!/Users/SharmaT1/.local/bin/claude-commit-patch --commit"
    claude-all = "!/Users/SharmaT1/.local/bin/claude-commit-patch --all"
    claude-copy = "!/Users/SharmaT1/.local/bin/claude-commit-patch --copy"
    cc = "!/Users/SharmaT1/.local/bin/claude-commit-patch --commit"
```

**Note**: Update the path to match your home directory.

## How It Works

The wrapper script does three things:

1. **Loads AWS Bedrock credentials**: Reads `~/.claude/settings.json` and sets all environment variables (including `CLAUDE_CODE_USE_BEDROCK`, `AWS_REGION`, `AWS_PROFILE`, etc.)

2. **Monkey patches Console.print()**: Intercepts calls to `Console.print()` and removes the unsupported `file` argument before calling the original method

3. **Runs claude-commit**: Imports and executes the actual `claude-commit` tool with the fixes applied

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

You should see:
```
Claude is analyzing your changes...
✨ Analysis complete!

╭─── 📝 Generated Commit Message ───╮
│                                   │
│  your commit message here         │
│                                   │
╰───────────────────────────────────╯
```

## Why This Approach?

Alternative approaches we considered:

1. **Reinstall with older Python**: `pipx install claude-commit --python python3.13`
   - Doesn't solve the AWS Bedrock authentication issue

2. **Update claude-commit**: `pipx upgrade claude-commit`
   - Package maintainers haven't fixed Python 3.14 compatibility yet

3. **Manual commits**: Use `claude-commit --copy` and paste
   - Less convenient for frequent commits

The monkey patch approach solves both issues without waiting for upstream fixes.

## Environment Requirements

- Python 3.14 (the issue occurs with this version)
- Claude Code CLI installed and configured with AWS Bedrock
- `~/.claude/settings.json` with AWS Bedrock environment variables
- `pipx` for managing Python CLI tools

## Troubleshooting

### Script location
The wrapper must be in your PATH. Verify with:
```bash
which claude-commit-patch
```

### Shebang path
The shebang must point to the correct Python in the pipx venv. Check with:
```bash
head -1 ~/.local/bin/claude-commit-patch
```

### AWS credentials
Ensure your `~/.claude/settings.json` contains:
```json
{
  "env": {
    "CLAUDE_CODE_USE_BEDROCK": "1",
    "AWS_REGION": "us-east-1",
    "AWS_PROFILE": "default"
  }
}
```

## Conclusion

This monkey-patch solution provides a clean workaround for Python 3.14 compatibility and AWS Bedrock authentication issues with `claude-commit`. The wrapper script can be easily maintained and updated as needed, and the git aliases provide a seamless workflow integration.

---

**File Locations Summary:**
- Wrapper script: `~/.local/bin/claude-commit-patch`
- Git configuration: `~/.gitconfig`
- Claude settings: `~/.claude/settings.json`

**Commands Used:**
```bash
# Installation
pipx install claude-commit

# Create wrapper
touch ~/.local/bin/claude-commit-patch
chmod +x ~/.local/bin/claude-commit-patch

# Update git config
git config --global alias.cc "!/Users/SharmaT1/.local/bin/claude-commit-patch --commit"
```
