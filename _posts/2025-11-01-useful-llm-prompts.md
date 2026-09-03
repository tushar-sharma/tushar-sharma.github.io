---
layout: post
title: Useful LLM Prompts
image: 'https://unsplash.com/photos/WCFxKepY9Gg/download?w=437'
thumb: 'https://unsplash.com/photos/WCFxKepY9Gg/download?w=437'
tags:
  - llm
  - prompt
author: tushar sharma
---

List of LLM prompts that I have found useful. I will be updating this list over time.<!-- truncate_here -->

Last updated: September 3, 2026.

The current OpenAI pattern is to use the [Responses API](https://platform.openai.com/docs/quickstart/make-your-first-api-request), put durable behavior in `developer` or `system` instructions, and choose the model and reasoning level deliberately. OpenAI's model guide currently recommends GPT-5.6 Sol for complex reasoning and coding, GPT-5.6 Terra for a balance of quality and cost, and GPT-5.6 Luna for cost-sensitive high-volume work: [OpenAI models](https://platform.openai.com/docs/models). For production prompts, pin model versions when you need repeatable behavior and add evals because prompting behavior can change between model snapshots: [backward compatibility](https://platform.openai.com/docs/api-reference/backward-compatibility).

## Prompting patterns

- Put stable rules in a `developer` or `system` message. Put the task-specific request, files, logs, diffs, and acceptance criteria in the `user` message.
- Ask for missing information only when it would materially change the answer. Otherwise ask the model to state assumptions and proceed.
- Prefer explicit output contracts: sections, checklist items, JSON schema, patch format, test plan, or review rubric.
- Set reasoning effort based on task difficulty. Use low or none for extraction and simple rewrites, medium for normal engineering tasks, and high or xhigh for deep debugging, architecture, or security review.
- Give the model tools when the answer depends on current external data, repository state, files, tests, or command output. Do not ask it to guess.
- For production workflows, save good and bad examples, run evals, and compare output quality before changing models or prompts.

## Useful prompts

### Improve a prompt

```text
You are a prompt engineer. Rewrite the prompt below so it is clearer, more testable, and less ambiguous.

Goals:
- Preserve my intent.
- Separate durable instructions from task-specific input.
- Add an explicit output format.
- Identify missing context only if it would change the result.

Return:
1. Improved prompt
2. Why the changes help
3. Questions I should answer before using it, if any

Draft prompt:
<paste prompt>
```

### Dry-run code

```text
Review this code by mentally executing it with realistic sample inputs.

Focus on:
- Bugs and edge cases
- Incorrect assumptions
- Unnecessary complexity
- Places where the code is harder to read than it needs to be
- Missing validation or error handling

Constraints:
- Keep the implementation simple and legible.
- Do not suggest broad refactors unless they reduce real risk.

Return:
1. Findings ordered by severity
2. A short dry run with sample data
3. Minimal changes recommended

Code:
<paste code or point to files>
```

### PR review

```text
Review this branch against `main` as a senior engineer.

First inspect the diff for:
- Correctness bugs
- Code smells
- Anti-patterns
- Deviations from the project's existing style
- Missing or weak tests

Then dry-run the main user flow with sample data and check:
- Logic errors
- Race conditions
- Scalability bottlenecks
- Error handling
- Backward compatibility

Return findings first, ordered by severity. For each finding include:
- File and line
- Why it matters
- A concrete fix

Branch:
<branch name>
```

### Debug failing tests

```text
Investigate this test failure.

Use this process:
1. Summarize what the failure says.
2. Identify the smallest behavior that is broken.
3. Trace the relevant code path.
4. Propose the smallest fix.
5. Explain what test should prove the fix.

Avoid guessing. If the logs are insufficient, tell me exactly which command or file would provide the missing evidence.

Failure output:
<paste logs>
```

### Mutation and hardening review

```text
Perform a hardening review of this branch.

Use separate passes for:
- Mutation testing opportunities
- Edge cases and negative tests
- Cyclomatic complexity and CRAP score hotspots
- Security and input validation
- Concurrency or race-condition risks
- QA scenarios a human tester should run

For each pass, return:
- What you checked
- Findings ordered by risk
- Tests or code changes needed
- Anything that is probably fine and does not need work

Stop when the remaining suggestions are low-value or speculative.
```

### Turn notes into a task plan

```text
Turn these rough notes into an implementation plan.

Return:
1. Goal
2. Non-goals
3. Assumptions
4. Files or components likely involved
5. Step-by-step implementation plan
6. Tests and verification
7. Risks or open questions

Rough notes:
<paste notes>
```
