---
layout: post
date: 2026-06-12
title: Logging Codex Sessions Without Spending Context
thumb: https://unsplash.com/photos/aK44jx-B8Mg/download?w=437
image: https://unsplash.com/photos/aK44jx-B8Mg/download?w=437
author: tushar sharma
category: blog
tags:
- codex
- ai
- obsidian
- tmux
---


<!-- truncate_here -->

## Problem 

1. I use codex inside tmux


2. Scrolling up is problematic. 

3. Also copying the text using mouse is annoying

4. No automatic history record in Obsidian

## Codex

Lets first understand how codex saves the file for each session. Each codex session has a local transcript **jsonl** file. 


> What's a jsonl file ? It's just a text file with json logging


You can see these files at : `~/.codex/session`

## First Solution 

Use obsdian mcp server. Make this changes in `~/.codex/config.toml`

```toml
[mcp_servers.obsidian]
command = "node"
args = ["$User/.nvm/versions/node/v25.4.0/lib/node_modules/@iflow-mcp/kynolos-obsidian-mcp-server/index.js"]

[mcp_servers.obsidian.env]
OBSIDIAN_VAULT_PATH = "~/Documents/obsidian"

[mcp_servers.obsidian.tools.read_note]
approval_mode = "approve"

[mcp_servers.obsidian.tools.append_to_note]
approval_mode = "approve"
```

### Cons: 

1. It will use tokens by codex 

## Second solution

Use a stop hook. It will receives a small JSON paylaod on a standard input : 

```json
{
  "last_assistant_message": "The answer Codex just produced",
  "transcript_path": "/path/to/codex/session/transcript.jsonl"
}
```
Hook can use `transcript_path` to find the latest user message, pari with the `last_assistant_message` and wirte both to a mardkwon file at obisidan vault locations

Flow look like this 

```mermiad

User prompt  -> Codex response -> Stop hook runs locally -> Append Q/A to makrdown file -> Open / search in Obsidian later Stop hook runs locally -> Append Q/A to makrdown file -> Open / search in Obsidian later Stop hook runs locally -> Append Q/A to makrdown file -> Open / search in Obsidian later Stop hook runs locally -> Append Q/A to makrdown file -> Open / search in Obsidian later
```

Importnat: Append happens in a ahsell script. the modes is not asked to summarize, format or call an MCP toolng, thus saving tokens

> Does stop hook cost token?

## What are we building ? 

We will create

```text
~/.codex/hooks/
├── log-session-to-markdown.sh
└── test-log-session-to-markdown.sh
```
then we will regsiter the logger in 

```text
~/.codex/hooks.json
```

the logger will create on markdown file per codex sesiosn: 

```text
<local-notest-ofder>codex session/
└── 2026-06-12T10-00-00-019example-session.md
```

Each file start with a editable YAML front matter

```yaml
---
type: codex-session
date: ? 
tags:
 - codex-session
```

if the same codex session continuse, the hook appens more Q/A blocks to same file


For the notes folder, we will use obsidian vault

```bash
mkdir -p "$HOME/myFiles/obsidain/codex-session"
```

next create a hook direcotry 

```bash 
mkdir -p $HOME/.codex/hooks
```

create 

```text
~/.codex/hooks/log-sesion-to-markdown.sh
```

```bash 
#!/bin/bash 

input=$(cat)
response=$(printf '%s' "$input" | jq -r '.last_assistant_message // empty' 2>/dev/null)
transcript=$(printf '%s' "$input" | jq -r '.transcript_path // empty' 2>/dev/null)

if [ -z "$response" ] || [ -z "$transcript" ] || [ ! -f "$transcript" ]; then
  exit 0
fi

prompt=$(jq -r '
  def text_content:
    if type == "string" then .
    elif type == "array" then
      [ .[] | if (.text? | type) == "string" then .text else empty end ] | join("\n")
    else empty end;

  (
    if .type == "response_item" and .payload.type == "message" and .payload.role == "user" then
      .payload.content | text_content
    elif .type == "user" then
      .message.content | text_content
    else empty end
  ) | select(length > 0)
' "$transcript" 2>/dev/null | tail -n 1)

if [ -z "$prompt" ]; then
  exit 0
fi

default_log_dir="$HOME/Notes/Codex Sessions"
log_dir="${CODEX_SESSION_LOG_DIR:-$default_log_dir}"

session_date=$(date '+%Y-%m-%d')
session_base=$(basename "$transcript")
session_name="${session_base%.jsonl}"
session_name="${session_name#rollout-}"
session_file=$(printf '%s' "$session_name" | tr '/:' '__')
log_file="$log_dir/$session_file.md"

mkdir -p "$log_dir" || exit 0

if [ ! -f "$log_file" ]; then
  {
    printf -- '---\n'
    printf 'type: codex-session\n'
    printf 'date: %s\n' "$session_date"
    printf 'tags:\n'
    printf '  - codex-session\n'
    printf '  - ai-log\n'
    printf '  - needs-review\n'
    printf -- '---\n\n'
    printf '# Codex Session: %s\n\n' "$session_name"
    printf -- '- Transcript: `%s`\n\n' "$transcript"
  } > "$log_file"
fi

{
  printf '\n---\n\n'
  printf '## %s\n\n' "$(date '+%Y-%m-%d %H:%M:%S %Z')"
  printf '### Question\n\n%s\n\n' "$prompt"
  printf '### Answer\n\n%s\n' "$response"
} >> "$log_file"

exit 0
```


Make it executable:

```bash
chmod +x "$HOME/.codex/hooks/log-session-to-markdown.sh"
```

The hook reads JSON from standanrd input becuase codex passes hook adata that way



This line gets the assistant answer:

```bash
response=$(printf '%s' "$input" | jq -r '.last_assistant_message // empty' 2>/dev/null)
```

This line gets the transcript path:

```bash
transcript=$(printf '%s' "$input" | jq -r '.transcript_path // empty' 2>/dev/null)
```

The latest user prompt is extracted from the transcript, not from terminal scrollback. That is the key improvement. It avoids tmux copy mode entirely.

The file name is derived from the transcript file name:

```bash
session_date=$(date '+%Y-%m-%d')
session_base=$(basename "$transcript")
session_name="${session_base%.jsonl}"
session_name="${session_name#rollout-}"
```

That gives one stable Markdown file for the session. If the hook runs again in the same session, it appends to the same file.

The YAML front matter is written only when the file is created:

```bash
if [ ! -f "$log_file" ]; then
  {
    printf -- '---\n'
    printf 'type: codex-session\n'
    printf 'date: %s\n' "$session_date"
    printf 'tags:\n'
    printf '  - codex-session\n'
    printf '  - ai-log\n'
    printf '  - needs-review\n'
    printf -- '---\n\n'
    ...
  } > "$log_file"
fi
```

That is deliberate. The hook should not keep rewriting metadata after you edit it by hand. If you later decide the session belongs to a specific project, edit the top of the Markdown file:

```yaml
tags:
  - codex-session
  - ai-log
  - my-service
  - pr-review
```

You can make tags more automatic, but be careful. Deriving project tags from the current directory is convenient until a path leaks private information or produces inconsistent names. I prefer a few generic automatic tags and manual project tags after review.

One small shell detail matters:

```bash
printf -- '- Transcript: `%s`\n\n' "$transcript"
```

The `--` is intentional. Without it, some shells treat a format string beginning with `-` as an option.

## Step 2: Register the Hook

Create or update:

```text
~/.codex/hooks.json
```

Minimal version:

```json
{
  "hooks": {
    "Stop": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "/Users/YOUR_USER/.codex/hooks/log-session-to-markdown.sh"
          }
        ]
      }
    ]
  }
}
```

Replace `/Users/YOUR_USER` with your home directory.

If you already have Stop hooks, add this as another command instead of replacing the whole file:

```json
{
  "type": "command",
  "command": "/Users/YOUR_USER/.codex/hooks/log-session-to-markdown.sh"
}
```

After changing hooks, Codex may ask you to review or approve the hook. That is expected. Review the command and approve it if it points to the script you created.

