---
layout: post
title: "Useful Agent Skills for Claude Code and Codex—Without Automatic Invocation"
author: tushar sharma
image: https://unsplash.com/photos/iAReN0zr8_U/download?w=437
thumb: https://unsplash.com/photos/iAReN0zr8_U/download?w=437
category: blog
tags: [ai, claude-code, codex, agent-skills]
---

Agent skills are reusable instructions that teach a coding agent how to perform a specific workflow. The best ones are not generic “write better code” prompts. They capture expertise I need occasionally: auditing a Daml contract, mentoring me without writing the answer, removing over-engineering, or running a disciplined development workflow.<!-- truncate_here -->

I do not want every installed skill affecting every request. My default is therefore simple: **install narrowly and disable automatic invocation**. I invoke a skill by name only when I need it.

This matters for both control and context. A skill can change how an agent plans, edits, tests, or uses tools. Repositories can also contain scripts and hooks, so I review those before installation rather than treating a skill as harmless Markdown.

## Make skills explicit-only

Claude Code and Codex use different settings for the same idea.

### Claude Code

Add this field to the skill's `SKILL.md` front matter:

~~~yaml
---
name: example-skill
description: Use this skill for a specific workflow.
disable-model-invocation: true
---
~~~

This keeps the skill available to me but prevents Claude from loading it automatically. I invoke it explicitly with:

~~~text
/example-skill
~~~

`user-invocable: false` is not the setting I want. That does the opposite: it hides the skill from the user while still allowing the model to invoke it.

### Codex

Create `agents/openai.yaml` inside the skill directory:

~~~yaml
interface:
  display_name: "Example Skill"
  short_description: "Run a specific workflow"
policy:
  allow_implicit_invocation: false
~~~

The policy prevents implicit selection while preserving explicit use. I invoke the skill in Codex by naming it in my prompt:

~~~text
Use $example-skill to review this change.
~~~

For a portable skill I control, I use **both** settings: `disable-model-invocation: true` in `SKILL.md` for Claude Code and `policy.allow_implicit_invocation: false` in `agents/openai.yaml` for Codex.

## 1. Canton Guard: a focused Daml security review

[Canton Guard by SCAS](https://github.com/SCAuditStudio/CantonGuard) reviews Daml code for authorization, privacy, contract-key, and workflow vulnerabilities. This is exactly the kind of skill I prefer: narrow domain, clear output, and useful only when the repository contains Daml.

I would invoke it explicitly:

~~~text
Use $canton-guard-by-scas to review the codebase.
~~~

For a smaller and usually better review:

~~~text
Use $canton-guard-by-scas on these Daml files: daml/Asset.daml and daml/Settlement.daml.
~~~

If workflow intent lives in Daml Script or tests:

~~~text
Use $canton-guard-by-scas --include-tests to review the codebase.
~~~

The skill produces audit hypotheses, not proof that a contract is secure. I still verify each finding against the party model and intended workflow. I also keep it explicit-only because there is no reason to run a Daml audit during unrelated feature work.

## 2. Socratic Code Mentor: learn by building the core

[Socratic Code Mentor](https://gist.github.com/ogzhanolguncu/274e9974dc02942109ad70200f6d7b25) changes the agent from an implementer into a teacher. The user writes the important algorithm or invariant; the agent handles setup, tests, tooling, and small non-core fixes.

Its most useful feature is the hint ladder. The agent begins with a question or narrows the problem, then explains and traces the idea, and only provides the core code when the user asks or remains stuck.

I would not let this trigger just because I use the word “learn.” I invoke it only when I deliberately want a learning session:

~~~text
Use $socratic-code-mentor. Teach me how a key-value store works by building one in Go. Use mentor mode and do not write the storage core for me.
~~~

In Claude Code, the equivalent explicit invocation is:

~~~text
/socratic-code-mentor Teach me how a key-value store works by building one in Go.
~~~

This skill is a poor fit when I need a production fix quickly. In that case I should ask the agent to implement the fix normally.

## 3. Superpowers: a complete development methodology

[Superpowers](https://github.com/obra/superpowers) is not one skill. It is a development system built from skills for brainstorming, worktrees, implementation plans, test-driven development, subagent execution, code review, and branch completion.

Its strength is consistency. A vague feature request becomes a reviewed design, a concrete plan, isolated implementation, tests, and a final review. That is useful for substantial work where skipping a stage would be expensive.

Its tradeoff is equally important: Superpowers is intentionally designed to activate automatically. Installing the full plugin conflicts with my explicit-only default.

I therefore have two choices:

1. Install the plugin only when I want its methodology to govern the whole coding session.
2. Copy only the individual skills I value, review their dependencies, and add the explicit-only settings above.

For example, I may keep only `brainstorming`, `writing-plans`, and `requesting-code-review`, then invoke one deliberately:

~~~text
Use $writing-plans to turn docs/design.md into an implementation plan. Do not implement it.
~~~

I would not install the complete suite and assume it behaves like an occasional command. Its automatic workflow is the product.

## 4. Ponytail: remove accidental complexity

[Ponytail](https://github.com/DietrichGebert/ponytail) asks the agent to choose the simplest adequate solution: reuse code already present, prefer the standard library or native platform, use an installed dependency before adding one, and write new code only when necessary.

It is useful after implementation because agents often create abstractions, wrappers, and dependencies that the task did not require. The focused commands are more valuable to me than making its rules permanent:

~~~text
Use $ponytail-review to review the current diff for over-engineering.
~~~

~~~text
Use $ponytail-audit to audit this repository for unnecessary complexity.
~~~

The full Ponytail plugin uses lifecycle hooks and supports always-on modes. If I install it, I set `PONYTAIL_DEFAULT_MODE=off` (or set the equivalent default in `~/.config/ponytail/config.json`) and enable it only for a deliberate review. Depending on the host/version, its native command may appear as `/ponytail-review` or `@ponytail-review` rather than the portable `$ponytail-review` form.

Ponytail should reduce accidental complexity, not eliminate validation, security controls, error handling, or accessibility work. Those are requirements, not over-engineering.

## Other niche skills worth keeping nearby

I prefer specialist collections over huge generic bundles. These are useful when their domain matches the work.

### Trail of Bits security skills

[Trail of Bits Skills](https://github.com/trailofbits/skills) is a collection of security workflows rather than a single “security review” prompt. Particularly useful examples include:

- `differential-review` for security-focused review of a Git diff;
- `insecure-defaults` for fail-open settings, default credentials, and unsafe configuration;
- `supply-chain-risk-auditor` for dependency risk;
- `sharp-edges` for dangerous APIs and configuration footguns;
- `semgrep-rule-creator` when a finding should become a repeatable static-analysis rule; and
- blockchain-specific contract analysis beyond Daml.

I would install only the skills relevant to my languages and invoke them against a bounded target. A focused review of changed authentication code is more useful than asking an agent to “audit everything.”

### Accessibility Agents

[Accessibility Agents](https://github.com/Community-Access/accessibility-agents) covers WCAG 2.2 AA concerns across web interfaces, documents, Markdown, and GitHub workflows. Its specialist coverage includes keyboard behavior, focus, forms, ARIA, contrast, live regions, data visualization, and screen-reader behavior.

This is valuable before releasing user-facing UI:

~~~text
Use $accessibility-lead to review the components changed in this branch. Report findings by severity and cite the relevant WCAG criterion.
~~~

The full package includes hooks that can block writes to user-facing files until review. That may be appropriate for a team policy, but it is broader than an on-demand skill. I would review and disable those hooks if I only want explicit audits.

### SwiftUI Pro

[SwiftUI Pro](https://github.com/twostraws/swiftui-agent-skill) is useful for SwiftUI-specific implementation and review. It captures framework conventions, modern APIs, performance guidance, and accessibility concerns that a general coding workflow may miss.

This is a good example of what belongs in a skill: knowledge that is narrow, changes with the framework, and needs to be applied consistently across related files.

### Incident response with Sleuth

[Sleuth](https://github.com/SignorMercurio/sleuth) provides a workflow for investigating security incidents. Incident response benefits from a checklist and evidence discipline, but it should never start casually or make containment changes without clear authorization. I would keep this explicit-only and state whether I want triage, evidence collection, or remediation.

## What I would not install as a skill

Not every preference deserves a skill.

- Repository facts and permanent conventions belong in `AGENTS.md` or `CLAUDE.md`.
- A formatter, linter, or deterministic security check belongs in a script or CI job.
- A one-time instruction belongs in the prompt.
- A workflow that can deploy, publish, delete, or send messages must be explicit and should retain normal permission checks.
- A giant skill that applies to every coding task is probably an always-on ruleset or methodology, not a niche skill.

The distinction helps keep agent context small. It also makes behavior predictable: rules are always present, while skills are loaded for a named task.

## My installation checklist

Before installing a third-party skill or plugin, I check:

1. Read `SKILL.md`, referenced scripts, hooks, and MCP configuration.
2. Check whether it runs shell commands, accesses the network, or sends repository content elsewhere.
3. Prefer a pinned commit or reviewed release instead of blindly tracking the default branch.
4. Install only the required skill rather than an entire collection.
5. Add `disable-model-invocation: true` for Claude Code.
6. Add `policy.allow_implicit_invocation: false` for Codex.
7. Test explicit invocation in a disposable repository.
8. Keep human review for security, financial, deployment, and destructive actions.

My short list is therefore not “skills that should always run.” It is a toolbox:

| Need | Skill |
|---|---|
| Review Daml/Canton contracts | Canton Guard |
| Learn by implementing the important part myself | Socratic Code Mentor |
| Apply a complete, disciplined development process | Selected Superpowers skills |
| Find and remove over-engineering | Ponytail review/audit |
| Perform specialist security analysis | Trail of Bits Skills |
| Review accessibility | Accessibility Agents |
| Write or review modern SwiftUI | SwiftUI Pro |
| Structure a security incident investigation | Sleuth |

The rule I want to preserve is simple: **skills should add expertise on demand, not silently redefine every interaction with my coding agent.**

## Sources

1. [OpenAI: Skills](https://developers.openai.com/plugins/concepts/skills)
2. [OpenAI: skill metadata and invocation policy](https://developers.openai.com/plugins/deploy/submission-errors)
3. [Canton Guard by SCAS](https://github.com/SCAuditStudio/CantonGuard)
4. [Socratic Code Mentor](https://gist.github.com/ogzhanolguncu/274e9974dc02942109ad70200f6d7b25)
5. [Superpowers](https://github.com/obra/superpowers)
6. [Ponytail](https://github.com/DietrichGebert/ponytail)
7. [Trail of Bits Skills](https://github.com/trailofbits/skills)
8. [Accessibility Agents](https://github.com/Community-Access/accessibility-agents)
9. [SwiftUI Pro](https://github.com/twostraws/swiftui-agent-skill)
10. [Sleuth](https://github.com/SignorMercurio/sleuth)
