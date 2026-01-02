---
layout: post
title: Claude-Mem - Long Term memory for Claude code
image: https://unsplash.com/photos/obMYFaWoZxM/download?w=437
thumb: https://unsplash.com/photos/obMYFaWoZxM/download?w=437
author: tushar sharma
tags:
 - claude code
 - ai
category: blog
---

Claude Code is my de facto AI coding tool. But it has one fundamental limitation: it forgets everything when you restart it. Every session starts fresh, forcing you to re-establish context, re-explain architectural decisions, and watch Claude re-analyze the same files repeatedly.<!-- truncate_here -->

Claude Code is my de facto AI coding tool. But it has one fundamental limitation: it forgets everything when you restart it. Every session starts fresh, forcing you to re-establish context, re-explain architectural decisions, and watch Claude re-analyze the same files repeatedly.

The traditional workaround is **CLAUDE.md**—a markdown file where you inject instructions and context. This helps, but it's manual and limited.

## The Native Solution: CLAUDE.md

You can create `~/CLAUDE.md` (or project-specific `.claude/CLAUDE.md`) with instructions like:

```markdown
# Project Guidelines

- Follow reactive functional paradigm in Java
- Use repository pattern for data access
- Write tests for all business logic
- API responses must follow RFC 7807 for error handling
```


Claude reads this at session start. It's useful for coding standards and preferences, but it misses the dynamic aspects of your project:

1. What files you edited yesterday and why

2. What files you edited yesterday and why

3. What bugs you already fixed and how

4. Architectural decisions you made during implementation

5. Context from previous conversations about specific features

6. Tool usage patterns and command outputs

`CLAUDE.md` is static. Your project evolves. You need memory that evolves with it.

## Claude-Mem Plugin

Claude-Mem is a plugin that automatically captures everything Claude does during your coding sessions and makes that knowledge available to future sessions.

### What It Captures

#### Prompts and Intent:

1. Your questions and requests

2. The problems you're trying to solve

#### Tool Usage:

1. File reads, writes, and edits

2. Shell command executions and their outputs

3. Search queries and results

4. API calls and responses

### Installation

Install directly from the Claude Code plugin marketplace:

```bash
/plugin marketplace add thedotmack/claude-mem
/plugin install claude-mem
```

Restart Claude Code.

Verify the worker service is running:

```bash
cd ~/.claude/plugins/marketplaces/thedotmack
npm run worker:status
```

If the worker isn't running, start it manually:

```bash
npm run worker:start
```

The worker service provides a web UI at `http://localhost:37777` where you can browse your session history, search observations, and view the timeline.

## Privacy and Data Storage

All data is stored in ` ~/.claude-mem/`

```markdown 
~/.claude-mem/
├── claude-mem.db          # SQLite database
├── logs/                  # Worker service logs
├── settings.json          # Configuration
└── chroma/                # Vector embeddings
```

Override the lcoation if you need 

```bash 
export CLAUDE_MEM_DATA_DIR=/custom/path
```

## Handling Sensitive Data


Wrap sensitive content in **<private>** tags:

```xml
<private>
API_KEY=sk-super-secret-key-12345
DATABASE_PASSWORD=P@ssw0rd!
</private>
```

## Clear command

When you run `/clear` in Claude Code, you might expect it to wipe memory. It doesn't.

What /clear does:

1. Clears the current conversation context

2. Re-injects fresh observations from Claude-Mem

3. Continues tracking the same session

You get a clean slate in the conversation without losing project memory. This is useful when context gets cluttered or you want to shift focus.


## Advanced: Direct Database Queries

Claude-Mem uses SQLite under the hood. You can query it directly:

```bash
sqlite3 ~/.claude-mem/claude-mem.db
```

example queries

```sql
-- List recent sessions
SELECT session_id, created_at, summary
FROM sdk_sessions
ORDER BY created_at DESC
LIMIT 10;

-- Find observations mentioning "authentication"
SELECT id, tool_name, created_at, content
FROM observations
WHERE content LIKE '%authentication%'
ORDER BY created_at DESC;

-- Token usage by session
SELECT session_id, SUM(tokens_used) as total_tokens
FROM observations
GROUP BY session_id
ORDER BY total_tokens DESC;
```

## Conclusion

This plugin feels like a  muscle memory for your claude code. Install it. Forget about it. Let Claude remember.