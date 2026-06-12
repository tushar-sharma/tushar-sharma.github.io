---
layout: post
date: 2026-06-12
title: Logging Codex Sessions Without Spending Context
author: tushar sharma
category: blog
published: false
tags:
- codex
- ai
- shell
- obsidian
- runbook
---

If you use Codex inside a terminal or tmux, copying old answers from scrollback gets annoying quickly. The better pattern is to let Codex finish a turn, then let a local hook append the latest question and answer to a Markdown file. No Obsidian MCP call. No extra model turn. No context window spent on note taking.<!-- truncate_here -->

If you use Codex inside a terminal or tmux, copying old answers from scrollback gets annoying quickly. The better pattern is to let Codex finish a turn, then let a local hook append the latest question and answer to a Markdown file. No Obsidian MCP call. No extra model turn. No context window spent on note taking.

This is a small runbook for setting up automatic Codex session logging. The examples use placeholder paths. Replace them with your own local notes folder.

## The Problem

I want a running record of my questions and Codex answers.

The first obvious solution is to ask Codex to write notes to Obsidian after every useful answer. That works, but it has two problems:

1. Codex has to spend tokens deciding what to write.
2. The note-writing action becomes part of the active conversation.

That is fine when I explicitly ask for a summary. It is wasteful when I only want a raw log.

The simpler solution is:

1. Let Codex answer normally.
2. Use a local Stop hook after the turn.
3. Read the latest prompt and response from the hook payload and transcript file.
4. Append them to a Markdown file on disk.

Obsidian can still read the Markdown file because it is just a file in a local folder.

## The Mental Model

A Codex session already has a local transcript file. In my setup, a Stop hook receives a small JSON payload on standard input. The important fields are:

```json
{
  "last_assistant_message": "The answer Codex just produced",
  "transcript_path": "/path/to/codex/session/transcript.jsonl"
}
```

The hook can use `transcript_path` to find the latest user message, pair it with `last_assistant_message`, and write both to a Markdown file.

The flow looks like this:

```text
User prompt
   |
   v
Codex response
   |
   v
Stop hook runs locally
   |
   v
Append Q/A to Markdown file
   |
   v
Open/search in Obsidian later
```

The important part: the Markdown append happens in a shell script. The model is not asked to summarize, format, or call an MCP tool.

## What We Are Building

We will create:

```text
~/.codex/hooks/
├── log-session-to-markdown.sh
└── test-log-session-to-markdown.sh
```

Then we will register the logger in:

```text
~/.codex/hooks.json
```

The logger will create one Markdown file per Codex session:

```text
<local-notes-folder>/Codex Sessions/
└── 2026-06-12T10-00-00-019example-session.md
```

Each file starts with editable YAML front matter:

```yaml
---
type: codex-session
date: 2026-06-12
tags:
  - codex-session
  - ai-log
---
```

If the same Codex session continues, the hook appends more Q/A blocks to the same file.

## Prerequisites

You need:

- Codex running locally
- `jq`
- Bash
- a local folder where Markdown files can be written

For the notes folder, use any local path:

```bash
mkdir -p "$HOME/Notes/Codex Sessions"
```

If that folder is inside an Obsidian vault, Obsidian will pick up the files automatically.

## Step 1: Create the Hook Script

Create the hooks directory:

```bash
mkdir -p "$HOME/.codex/hooks"
```

Create:

```text
~/.codex/hooks/log-session-to-markdown.sh
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

## Why This Script Is Written This Way

The hook reads JSON from standard input because Codex passes hook data that way.

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

## Step 3: Test Without Touching Your Real Notes

Before writing into your real notes folder, test with a temporary directory.

Create:

```text
~/.codex/hooks/test-log-session-to-markdown.sh
```

```bash
#!/bin/bash
set -euo pipefail

hook="$HOME/.codex/hooks/log-session-to-markdown.sh"
tmp_dir=$(mktemp -d)
trap 'rm -rf "$tmp_dir"' EXIT

transcript="$tmp_dir/rollout-2026-06-12T10-00-00-019example-session.jsonl"
log_dir="$tmp_dir/logs"
log_file="$log_dir/2026-06-12T10-00-00-019example-session.md"

invoke_hook() {
  local response="$1"
  local stderr_file="$tmp_dir/hook.stderr"
  jq -n --arg response "$response" --arg transcript "$transcript" \
    '{last_assistant_message: $response, transcript_path: $transcript}' |
    CODEX_SESSION_LOG_DIR="$log_dir" "$hook" 2>"$stderr_file"
  if [ -s "$stderr_file" ]; then
    cat "$stderr_file" >&2
    exit 1
  fi
}

assert_contains() {
  local file="$1"
  local text="$2"
  if ! grep -Fq -- "$text" "$file"; then
    echo "Expected $file to contain: $text" >&2
    exit 1
  fi
}

cat > "$transcript" <<'JSONL'
{"type":"session_meta","payload":{"id":"019example-session","cwd":"/tmp/project"}}
{"type":"response_item","payload":{"type":"message","role":"user","content":[{"type":"input_text","text":"First question?"}]}}
JSONL

invoke_hook "First answer."

test -f "$log_file"
assert_contains "$log_file" "type: codex-session"
assert_contains "$log_file" "  - needs-review"
assert_contains "$log_file" "# Codex Session: 2026-06-12T10-00-00-019example-session"
assert_contains "$log_file" "First question?"
assert_contains "$log_file" "First answer."

cat >> "$transcript" <<'JSONL'
{"type":"response_item","payload":{"type":"message","role":"assistant","content":[{"type":"output_text","text":"First answer."}]}}
{"type":"response_item","payload":{"type":"message","role":"user","content":[{"type":"input_text","text":"Second question?"}]}}
JSONL

invoke_hook "Second answer."

assert_contains "$log_file" "Second question?"
assert_contains "$log_file" "Second answer."

file_count=$(find "$log_dir" -type f -name '*.md' | wc -l | tr -d ' ')
if [ "$file_count" != "1" ]; then
  echo "Expected one session log file, found $file_count" >&2
  exit 1
fi
```

Run it:

```bash
chmod +x "$HOME/.codex/hooks/test-log-session-to-markdown.sh"
"$HOME/.codex/hooks/test-log-session-to-markdown.sh"
```

If the script exits with code `0`, the basic behavior works:

- the hook creates a Markdown file
- it writes editable YAML front matter once
- it writes the first Q/A
- it appends the second Q/A
- it keeps both entries in the same session file

## Step 4: Point It at Your Notes Folder

The hook defaults to:

```text
~/Notes/Codex Sessions
```

If you want a different local folder, edit this line:

```bash
default_log_dir="$HOME/Notes/Codex Sessions"
```

For example:

```bash
default_log_dir="$HOME/Documents/Obsidian/Codex Sessions"
```

Do not hardcode anything sensitive in the script. A local folder path is usually fine, but avoid company names, customer names, project names, or private URLs if you plan to publish the script.

## What the Output Looks Like

The generated Markdown file looks like this:

```markdown
---
type: codex-session
date: 2026-06-12
tags:
  - codex-session
  - ai-log
  - needs-review
---

# Codex Session: 2026-06-12T10-00-00-019example-session

- Transcript: `/tmp/rollout-2026-06-12T10-00-00-019example-session.jsonl`

---

## 2026-06-12 10:15:30 EDT

### Question

First question?

### Answer

First answer.
```

That format is intentionally boring. It is easy to search, easy to diff, and easy for Obsidian to render.

The `needs-review` tag is a useful default. It tells me the file is raw machine-generated history. Later I can remove it or replace it with better tags after reading the session.

## Optional: Skip Automated Maintenance Turns

If you have other Stop hooks that trigger automatic maintenance prompts, you may not want those entries in your Q/A log.

Add a small filter after the prompt is extracted:

```bash
case "$prompt" in
  "Maintenance sweep:"*) exit 0 ;;
esac
```

You can also skip a specific automatic response:

```bash
case "$response" in
  "Maintenance: no update needed"*) exit 0 ;;
esac
```

Keep this list small. The logger should be a raw transcript aid, not a second summarization system.

## Why This Does Not Spend Context

This setup does not ask Codex to write the note.

The shell hook appends to disk after the assistant has already produced the answer. The Markdown file only enters the model context later if you explicitly ask Codex to read it.

That distinction matters:

| Approach | Uses model context every turn? | Uses Obsidian MCP every turn? |
|---|---:|---:|
| Ask Codex to summarize to notes | Yes | Maybe |
| Call Obsidian MCP in every turn | Yes | Yes |
| Local Stop hook appends Markdown | No | No |

Use MCP when you want the model to reason about notes. Use a hook when you only want logging.

## Troubleshooting

### The hook does not run

Check that it is registered:

```bash
jq . "$HOME/.codex/hooks.json"
```

Check that the script is executable:

```bash
ls -l "$HOME/.codex/hooks/log-session-to-markdown.sh"
```

If Codex asks you to approve the hook, review and approve it.

### The file is not created

Run the test script first. If the test passes, check your real notes directory:

```bash
ls -la "$HOME/Notes/Codex Sessions"
```

If you changed `default_log_dir`, make sure the parent folder exists and your user can write to it.

### `jq` errors

Install `jq`:

```bash
brew install jq
```

On Linux:

```bash
sudo apt-get update
sudo apt-get install jq
```

### The Markdown file has only answers, not questions

That usually means the transcript shape is different from what the script expects. Inspect a small sample:

```bash
head -20 /path/to/transcript.jsonl
```

Look for entries where the role is `user`, then adjust the `jq` filter in the script.

## The Rule I Use

If I need raw history, I use the Stop hook.

If I need a polished summary, I explicitly ask Codex to write one.

If I need to query existing notes, I explicitly use Obsidian or another search tool.

Keeping those paths separate makes the system predictable. Logging stays cheap. Summaries stay intentional.
