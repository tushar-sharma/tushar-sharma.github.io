---
layout: post
title: Reading - Agent Tools & Interoperability with MCP
image: https://unsplash.com/photos/hgFY1mZY-Y0/download?w=437
thumb: https://unsplash.com/photos/hgFY1mZY-Y0/download?w=437
author: tushar sharma
category: blog
tags:
 - reading
 - mcp
---

Reading - Agent Tools & Interoperability with MCP.<!-- truncate_here -->

Reading - Agent Tools & Interoperability with MCP[^1].


## What's a tool

A **tool** is an external function or service that a language model can invoke at runtime to perform actions beyond its static training data.

OpenAI introduced **function calling** (circa mid-2023), which allows models to invoke external code. Modern **tools** are built on top of this function-calling capability.

## Tool definition

A tool definition is a **contract** between the model and the client. This contract must include:

1. a **clear, unambiguous function name**
2. a **descriptive docstring** explaining what the tool does and when it should be used
3. a **strictly typed schema** for input arguments

Example:

{% template  customCode.html %}
---
id: e2b6e04b2d04d37de6ce6014be357177
file: example.py
---
{% endtemplate %}

## N × M Integration Problem

Consider a system with **N** AI models and **M** tools. Without standardization, each model requires a custom integration for each tool—resulting in **N × M** point-to-point connectors.

This quickly becomes unmanageable as both models and tools scale.

### LSP

Before LSP, each code editor needed a separate plugin for each programming language. With 10 editors and 10 languages, that meant 100 plugins.

Microsoft introduced the **Language Server Protocol (LSP)**. It provided:

- a client–server architecture with a JSON-RPC–based message interface
- a language server that implements language-specific logic (parsing, diagnostics, completions)
- servers advertising the capabilities they support
- clients connecting to servers and consuming those capabilities

### MCP

MCP follows a similar architectural pattern to LSP. It provides:

- an **MCP host**, which advertises the tools it exposes
- communication via **JSON-RPC 2.0**
- a standardized way for clients to discover and invoke tools

Tool discovery example:

@startmermaid
sequenceDiagram
    participant Client
    participant MCP_Server as MCP Server

    Client->>MCP_Server: tools/list
    MCP_Server-->>Client: Tool schemas

    Client->>Client: LLM selects appropriate tool

    Client->>MCP_Server: tools/call(name, arguments)
    MCP_Server-->>Client: Tool result
@endmermaid

### Tool Invocation

User query: “What’s the weather in New York?”
The LLM decides to call `get_weather(city="NY")`.

{% template  customCode.html %}
---
id: e2b6e04b2d04d37de6ce6014be357177
file: json-rpc.json
---
{% endtemplate %}

The server executes the function and returns the result, which the client feeds back into the model’s context.

## Sampling

Sometimes a tool needs LLM assistance to complete its task—for example, summarizing a large document before returning a result.

Flow:

- MCP server receives a request (e.g., `fetch_and_summarize_pdf`)
- it retrieves the raw PDF
- instead of processing it locally, it issues a **sampling request** back to the client:
  “Please summarize this 50-page document using your LLM.”
- the client runs the summarization and returns the result to the server

This keeps the server lightweight while still leveraging model intelligence.

## Elicitation (Tool → Human)

When a tool lacks critical information—such as confirmation for a destructive action—it can **elicit input from a human operator**.

Example:

- a tool attempts to delete a file
- deletion requires a 2FA code or explicit confirmation
- the tool pauses execution and requests human input

## Best Practices for Designing Agent Tools

**Describe intent, not implementation**
Prefer: “Create a high-priority bug ticket in Jira”
Avoid: “POST to /rest/api/3/issue with JSON payload…”

**Granularity matters**
Each tool should perform one atomic action. Compose complex workflows by chaining simple tools.

**Minimize output payloads**
Never return megabytes of raw data to the LLM. If output is large:
- store it externally (object storage, cache)
- return a reference instead (URL, ID, hash)

**Validate inputs strictly**
Enforce type and domain constraints (e.g., brightness ∈ [0,100]) to prevent runtime errors.

**Idempotency & safety**
Design tools to be safe on retries (e.g., idempotency keys for financial or destructive operations).

## References

[^1]: [Agent Tools & Interoperability with MCP](https://www.kaggle.com/whitepaper-agent-tools-and-interoperability-with-mcp)
