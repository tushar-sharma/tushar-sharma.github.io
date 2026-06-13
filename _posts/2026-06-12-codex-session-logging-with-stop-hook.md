---
layout: post
date: 2026-06-12
title: Logging Codex Sessions Without Spending Context
thumb: https://img.magnific.com/premium-photo/young-woman-using-laptop-while-sitting-against-yellow-background_1048944-365568.jpg?semt=ais_hybrid
image: https://img.magnific.com/premium-photo/young-woman-using-laptop-while-sitting-against-yellow-background_1048944-365568.jpg?semt=ais_hybrid
author: tushar sharma
category: blog
tags:
- codex
- ai
- obsidian
- tmux
---

Codex already writes a local JSONL transcript for every session. A stop hook can use that transcript to append each prompt and response to Markdown, giving you searchable Obsidian notes without asking the model to summarize anything.<!-- truncate_here -->

## The Problem

I often run Codex inside `tmux`. That works well for long-running terminal work, but it is a poor place to preserve useful Q/A history.

The failure mode is familiar:

1. Terminal scrollback is limited or awkward to navigate.
2. Copying a long answer from `tmux` copy mode is tedious.
3. Important debugging context disappears into a terminal session.
4. Sending everything through an MCP note-taking tool spends model context and tokens on a logging task.

The goal is simple: after every Codex answer, append the last user prompt and the assistant response to a local Markdown file. The implementation should be local, deterministic, and easy to test.

## Design

Codex stores session transcripts under `~/.codex/sessions`. The exact path is nested by date, but the file itself is a JSONL transcript. JSONL means newline-delimited JSON: one JSON object per line.

When a Codex stop hook runs, it receives a small JSON payload on standard input. The important fields are:

```json
{
  "last_assistant_message": "The answer Codex just produced",
  "transcript_path": "/Users/me/.codex/sessions/2026/06/12/rollout-2026-06-12T10-00-00-example.jsonl"
}
```

The hook does not need to ask Codex to do anything. It can:

1. Read `last_assistant_message` from the hook payload.
2. Read `transcript_path` from the hook payload.
3. Parse the transcript locally with `jq`.
4. Extract the latest user message.
5. Append a Q/A block to a stable Markdown file for that session.

That gives this flow:

```text
User prompt
  -> Codex response
  -> Stop hook receives payload on stdin
  -> Shell script reads transcript_path
  -> Shell script appends Q/A to Markdown
  -> Obsidian indexes the note later
```

The important property is that logging happens outside the model path. No MCP call, no summarization request, no extra prompt content.

## What We Will Build

We will create two files:

```text
~/.codex/hooks/
├── log-session-to-markdown.sh
└── test-log-session-to-markdown.sh
```

Then we will register the logger as a Codex `Stop` hook.

The logger creates one Markdown file per Codex session:

```text
~/myFiles/obsidian/codex-session/
└── 2026-06-12T10-00-00-example.md
```

If the same Codex session continues, the hook appends more Q/A blocks to the same file.

Each new note starts with YAML front matter:

```yaml
---
type: codex-session
date: 2026-06-12
tags:
  - codex-session
  - ai-log
  - needs-review
---
```

The front matter is written only when the note is created. That matters because you can later edit the tags manually without the hook overwriting your metadata.

## Prerequisites

Install `jq` if it is not already available:

```bash
brew install jq
```

Check that Codex is writing session transcripts:

```bash
find "$HOME/.codex/sessions" -name '*.jsonl' | tail -n 5
```

Create the destination directory. I use an Obsidian vault path here, but this can be any local directory:

```bash
mkdir -p "$HOME/myFiles/obsidian/codex-session"
mkdir -p "$HOME/.codex/hooks"
```

If your vault path is different, use it consistently in the commands below.

## Step 1: Create The Hook

Create `~/.codex/hooks/log-session-to-markdown.sh`:

```bash
#!/usr/bin/env bash
set -u

input=$(cat)

response=$(printf '%s' "$input" | jq -r '.last_assistant_message // empty' 2>/dev/null)
transcript=$(printf '%s' "$input" | jq -r '.transcript_path // empty' 2>/dev/null)

if [ -z "$response" ] || [ -z "$transcript" ] || [ ! -f "$transcript" ]; then
  exit 0
fi

prompt=$(jq -r '
  def text_content:
    if type == "string" then
      .
    elif type == "array" then
      [
        .[]
        | if (.text? | type) == "string" then
            .text
          elif (.content? | type) == "string" then
            .content
          else
            empty
          end
      ] | join("\n")
    else
      empty
    end;

  (
    if .type == "response_item"
       and .payload.type == "message"
       and .payload.role == "user" then
      .payload.content | text_content
    elif .type == "user" then
      .message.content | text_content
    else
      empty
    end
  ) | select(length > 0)
' "$transcript" 2>/dev/null | tail -n 1)

if [ -z "$prompt" ]; then
  exit 0
fi

default_log_dir="$HOME/myFiles/obsidian/codex-session"
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

The script exits with status `0` on missing data. A logging hook should not break the Codex session just because the transcript format changed, the destination directory is unavailable, or the payload is incomplete. Silent failure is usually the right default for a non-critical append-only logger.

## Step 2: Understand The Parsing

This line gets the assistant response directly from the hook payload:

```bash
response=$(printf '%s' "$input" | jq -r '.last_assistant_message // empty' 2>/dev/null)
```

This line gets the JSONL transcript path:

```bash
transcript=$(printf '%s' "$input" | jq -r '.transcript_path // empty' 2>/dev/null)
```

The latest user prompt is extracted from the transcript, not from terminal scrollback. That is the key part. It avoids `tmux` copy mode entirely and works even when the terminal UI has wrapped or truncated output.

The output file name is derived from the transcript file name:

```bash
session_base=$(basename "$transcript")
session_name="${session_base%.jsonl}"
session_name="${session_name#rollout-}"
session_file=$(printf '%s' "$session_name" | tr '/:' '__')
```

That produces one stable Markdown file per session. If the hook runs again for the same transcript, it appends to the same note.

The front matter is created once:

```bash
if [ ! -f "$log_file" ]; then
  ...
fi
```

That is intentional. After a session, I might edit the note:

```yaml
tags:
  - codex-session
  - ai-log
  - my-service
  - pr-review
```

The hook should not erase that manual classification on the next append.

One shell detail is worth keeping:

```bash
printf -- '- Transcript: `%s`\n\n' "$transcript"
```

The `--` prevents `printf` from treating a format string that starts with `-` as an option.

## Step 3: Add A Local Test Harness

Create `~/.codex/hooks/test-log-session-to-markdown.sh`:

```bash
#!/usr/bin/env bash
set -eu

tmp_dir=$(mktemp -d)
transcript="$tmp_dir/rollout-2026-06-12T10-00-00-test-session.jsonl"
output_dir="$tmp_dir/output"

cat > "$transcript" <<'JSONL'
{"type":"response_item","payload":{"type":"message","role":"user","content":[{"type":"input_text","text":"How do I reproduce the issue?"}]}}
{"type":"response_item","payload":{"type":"message","role":"assistant","content":[{"type":"output_text","text":"Run the failing test first."}]}}
JSONL

payload=$(jq -n \
  --arg answer "Run the failing test first." \
  --arg transcript "$transcript" \
  '{last_assistant_message: $answer, transcript_path: $transcript}')

CODEX_SESSION_LOG_DIR="$output_dir" \
  "$HOME/.codex/hooks/log-session-to-markdown.sh" <<< "$payload"

log_file=$(find "$output_dir" -name '*.md' | head -n 1)

test -f "$log_file"
grep -q 'How do I reproduce the issue?' "$log_file"
grep -q 'Run the failing test first.' "$log_file"
grep -q 'type: codex-session' "$log_file"

printf 'PASS: %s\n' "$log_file"
```

Make it executable and run it:

```bash
chmod +x "$HOME/.codex/hooks/test-log-session-to-markdown.sh"
"$HOME/.codex/hooks/test-log-session-to-markdown.sh"
```

Expected output:

```text
PASS: /var/folders/.../output/2026-06-12T10-00-00-test-session.md
```

This test does not require a live Codex session. It creates a fake transcript, sends a fake hook payload to the real logger, and verifies that the Markdown file contains the prompt, answer, and front matter.

## Step 4: Register The Stop Hook

Create or update `~/.codex/hooks.json`:

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

Replace `/Users/YOUR_USER` with your actual home directory.

If you already have `Stop` hooks, do not replace the whole file. Add this command to the existing `Stop` hook list:

```json
{
  "type": "command",
  "command": "/Users/YOUR_USER/.codex/hooks/log-session-to-markdown.sh"
}
```

Restart Codex after changing hook configuration. Codex may ask you to review or trust the hook command. Read the path carefully and approve it only if it points to the script you created.

## Step 5: Verify With A Real Session

Start a new Codex session and ask a small question. After Codex answers, check the output directory:

```bash
ls -lt "$HOME/myFiles/obsidian/codex-session" | head
```

Open the newest Markdown file:

```bash
latest=$(ls -t "$HOME/myFiles/obsidian/codex-session"/*.md | head -n 1)
sed -n '1,120p' "$latest"
```

You should see:

```markdown
---
type: codex-session
date: 2026-06-12
tags:
  - codex-session
  - ai-log
  - needs-review
---

# Codex Session: 2026-06-12T10-00-00-test-session

- Transcript: `/Users/me/.codex/sessions/.../rollout-....jsonl`

---

## 2026-06-12 10:05:12 EDT

### Question

...

### Answer

...
```

If you ask another question in the same Codex session, the same Markdown file should get another timestamped Q/A block.

## Operational Notes

Do not log secrets blindly. Codex transcripts can contain commands, file paths, error messages, and pasted configuration. If you routinely work with credentials or customer data, point `CODEX_SESSION_LOG_DIR` to a private local folder and review notes before syncing them.

Keep the hook append-only. Rewriting old session notes from a hook makes debugging harder and can destroy manual annotations. If you want cleanup, run a separate offline maintenance script.

Keep automatic tags generic. It is tempting to derive tags from the current directory, branch, or repository name. That can leak private project names and create noisy taxonomy. I prefer generic tags like `codex-session`, then manual project tags after review.

Do not route this through an MCP server unless you actually need model-mediated note operations. MCP is useful when Codex needs to read or reason over your notes. This use case is only logging, so a local shell hook is cheaper and more reproducible.

## Troubleshooting

If no Markdown file is created, check that the hook is executable:

```bash
ls -l "$HOME/.codex/hooks/log-session-to-markdown.sh"
```

If the test harness fails, check `jq`:

```bash
jq --version
```

If the real session does not log but the test passes, check hook registration and restart Codex. Also confirm that the path in `~/.codex/hooks.json` is absolute and points to the executable script.

If the note is created but the question is empty, inspect the latest transcript format:

```bash
latest_transcript=$(find "$HOME/.codex/sessions" -name '*.jsonl' | sort | tail -n 1)
tail -n 20 "$latest_transcript"
```

The script handles the common Codex transcript shapes I have seen:

```json
{"type":"response_item","payload":{"type":"message","role":"user","content":[{"text":"..."}]}}
```

and:

```json
{"type":"user","message":{"content":"..."}}
```

If Codex changes the transcript schema, update only the `jq` extraction block. The rest of the hook can stay the same.

## Result

This gives you a local, reproducible session log:

1. One Markdown file per Codex session.
2. Timestamped prompt/response blocks.
3. Editable YAML metadata.
4. No terminal scrollback dependency.
5. No MCP call and no extra model context spent on logging.

For my workflow, that is the right boundary: Codex does the engineering work, and the local machine records the audit trail.
