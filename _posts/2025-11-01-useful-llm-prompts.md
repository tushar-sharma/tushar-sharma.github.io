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
Act as a Principal/Staff-level software engineer reviewing this branch against `main`.

Your goal is to provide a rigorous, actionable, and constructive code review. Review the complete diff from the merge base with `main`, then inspect relevant surrounding code, tests, documentation, and repository instructions to understand the intended behavior, architecture, conventions, and affected user flows.

Treat this as a read-only review. Do not modify the code unless explicitly asked.

## Phase 1: Understand the Change

Before reporting findings:

* Read applicable repository instructions, such as `AGENTS.md`, `README.md`, contribution guidelines, and architecture documentation.
* Determine the purpose and intended behavior of the branch from the diff, commit history, tests, and surrounding code.
* Identify the primary user or system flows affected by the changes.
* Focus on problems introduced or materially worsened by this branch. Do not report unrelated pre-existing issues.

## Phase 2: Static Analysis

Inspect the changes for:

* Correctness bugs and unhandled edge cases
* Security, authorization, privacy, or data-integrity risks
* Code smells and harmful anti-patterns
* Deviations from established project architecture, style, and conventions
* Missing, weak, misleading, or brittle tests
* Incorrect error handling, retry behavior, logging, or observability
* Resource leaks or lifecycle-management problems
* Backward-compatibility, schema, configuration, and migration risks

Evaluate the design against Kent Beck’s Four Rules of Simple Design:

1. Passes the tests
2. Reveals intention
3. Contains no unnecessary duplication
4. Uses the fewest necessary elements

Treat these as design heuristics, not rigid rules. Report a violation only when it creates a concrete correctness, maintainability, or change-safety problem.

If the branch adds or changes an HTTP API, evaluate it against the project’s existing API conventions and the Zalando RESTful API Guidelines, including:

* Resource and URL design
* HTTP methods and status codes
* Request and response schemas
* Validation and error responses
* Idempotency
* Pagination and filtering
* Versioning and backward compatibility
* Security and sensitive-data exposure

Prefer explicit repository conventions when they intentionally differ from Zalando’s recommendations. Explain any material deviation instead of mechanically flagging it.

## Phase 3: Behavioral Validation

Run the most relevant available validation, such as:

* Compilation or build
* Unit tests
* Integration tests
* Static analysis
* Linting or type checking
* Focused tests covering the changed behavior

Trace the primary affected flows using representative sample data. Execute the flow when the repository provides a safe and practical way to do so. Otherwise, perform a code-path walkthrough and clearly state that it was reasoned about rather than executed.

Check:

* Happy paths
* Invalid, empty, null, boundary, and unusually large inputs
* State transitions
* Partial and dependency failures
* Duplicate or concurrent requests
* Race conditions and unsafe shared state
* N+1 queries, unbounded operations, memory growth, and other credible scalability problems
* Backward compatibility with existing callers, configuration, schemas, and stored data

Do not claim that a command, test, or flow succeeded unless you actually ran it.

## Finding Requirements

Report only actionable issues with:

* Evidence in the changed code or validation output
* A plausible triggering scenario
* A concrete impact
* A practical fix

Avoid:

* Purely subjective style preferences
* Generic best-practice advice
* Speculative problems without a credible failure scenario
* Issues already prevented by the language, framework, or existing validation
* Unrelated pre-existing problems
* Large refactoring proposals unless necessary for correctness
* Inventing findings to fill the report

## Output Format

Return findings first, ordered by severity:

* **Critical:** Security compromise, data loss, severe outage, or fundamentally broken behavior
* **Major:** Likely production failure, significant regression, or serious compatibility problem
* **Minor:** A real defect with limited impact or a maintainability problem likely to cause future errors
* **Nitpick:** Small, objective improvement; omit subjective preferences

Use this exact structure for every finding:

### [Severity] Brief title

* **Location:** `path/to/file.ext:line`
* **Trigger:** The specific input, state, or sequence that exposes the issue
* **Why it matters:** The concrete effect on users, the system, or future changes
* **Evidence:** Relevant behavior from the code or validation output
* **Concrete fix:** A minimal implementation change or focused code snippet
* **Regression test:** A test that would fail before the fix and pass afterward

After the findings, include:

## Validation Performed

List the commands and scenarios actually executed, their results, and anything that could not be run.

## Residual Risks

List relevant behavior that could not be verified. Omit this section if nothing material remains unverified.

## What’s Done Well

Highlight one or two specific, meaningful strengths in the implementation. Do not include generic praise.

If no actionable issues are found, explicitly state:

**No actionable findings.**

Do not invent findings merely to produce a populated review.
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
