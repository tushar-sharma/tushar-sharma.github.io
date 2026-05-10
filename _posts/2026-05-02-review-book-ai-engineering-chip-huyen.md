---
layout: post
title: AI Engineering - Building Applications with Foundation Models by Chip Huyen
thumb: 'https://unsplash.com/photos/Ne2ANNXGW6M/download?w=437'
image: 'https://unsplash.com/photos/Ne2ANNXGW6M/download?w=437'
author: tushar sharma
category: blog
tags: books ai llm
---

These are my learning notes and reflections while reading "AI Engineering: Building Applications with Foundation Models" by Chip Huyen. I plan to update this periodically as I progress through the book.<!-- truncate_here -->

<link rel="stylesheet" href="{{ root_url }}/css/books.css" />

<!-- disclaimer -->
<div style="margin: 0 auto" class="cl disclaimer">
<span style="color:black"> &nbsp;&nbsp;These are my rough notes while reading the book.
</span> 
</div> <br>

## Overview
This book focuses on the engineering aspects of building applications using foundation models (LLMs). It covers the full lifecycle from understanding models to deployment and monitoring.

---

## May 2, 2026

Previously, Software as a Service (SaaS) was popular — e.g. Cloudflare, Okta, etc. Now we have **Model as a Service**: companies like Google (Gemini), Anthropic, and OpenAI (ChatGPT) develop models which others build on top of.

**Language models** of the 1950s are precursors to modern **large language models**. A language model predicts how likely a word (or token) is to appear in a given context. e.g. "My favourite color is ___". "Blue" is more likely than "car".

The basic unit of a language model is called a **token**. A token can be a character, a word, or a part of a word. The process of breaking text into tokens is called **tokenization**.

The model's **vocabulary** is a fixed lookup table mapping every known token to a unique number (ID). The model never sees raw text — only sequences of these IDs. For example, `"what's the capital of north carolina?"` might become `[3493, 596, 279, 6864, 315, 4892, 15696, 30]`.

**Vocabulary size** is how many entries are in that table. GPT-4 has 100,256 entries; Mixtral 8x7B has 32,000.

This matters in two ways:
- **Output**: when generating the next token, the model scores *every* entry in the vocabulary and picks the most likely one. So vocabulary size defines the full range of things it can ever say.
- **Input splitting**: if a word isn't in the vocabulary as a single entry, the tokenizer breaks it into smaller pieces that are. A larger vocabulary stores more words whole, keeping sequences shorter and more efficient.

---

Two types of language models:

1. **Masked language model** — trained to predict a missing token *anywhere* in a sequence, using context from both before and after the gap. Example: BERT (Bidirectional Encoder Representations from Transformers).

2. **Autoregressive language model** — trained to predict the *next* token in a sequence, using only the preceding tokens.

The key difference: masked models are **bidirectional** (they see both sides of a gap), while autoregressive models are **unidirectional** (they only look backwards). This makes autoregressive models natural text generators — they produce output left to right, just like we write.

```
Masked LM:     "Why does the [?] cross the road?"
               ← context ←         → context →
               Predicts: "chicken" (using both sides)

Autoregressive LM:  "Why does the chicken" → predicts "cross"
                     ← only previous tokens used
```

Models can generate open-ended outputs — that's why they're called **generative**. The completions are predictions based on probabilities, not guaranteed to be correct.

---

**Self-supervision** is how language models are trained. Unlike supervised learning (e.g. a weather forecasting model trained on labelled historical data), self-supervision doesn't require human-labelled data. Instead, the model infers its own labels from the input: given a sequence of tokens, the model uses some tokens as context and treats the remaining token(s) as the label to predict. This sidesteps the expensive and slow process of manual data labelling.

---

**Model size** is measured by its number of **parameters** — values inside the model that are adjusted during training. More parameters generally means more capacity to learn patterns.

GPT stands for **Generative Pre-trained Transformer**.

A **foundation model** is a large model pre-trained on broad data that can be adapted (fine-tuned) for many downstream tasks.

A **multimodal model** is one that can work with more than one type of data (modality) — e.g. both text and images. A generative multimodal model is sometimes loosely called a large language model, though strictly LLMs are text-focused.

You can also **fine-tune** a foundation model on a specific dataset to specialise its behaviour.

Using an external database to supplement the model's knowledge at inference time is called **Retrieval-Augmented Generation (RAG)**.


## May 10, 2026

Foundation models are trained by companies like OpenAI, Anthropic, Google, and Meta. Training them is extremely expensive because it needs massive datasets, large GPU clusters, and long training runs. Most teams don't train a foundation model from scratch. Instead, they adapt existing models using **prompt engineering**, **fine-tuning**, or **RAG**.

**Model as a Service** means a company exposes a model through an API so other developers can build products on top of it without owning the model training stack.

Tools like AutoGPT, LangChain, Ollama, Stable Diffusion web UIs, GPT Engineer, screenshot-to-code, DB-GPT, PandasAI, and similar projects are part of the application layer around models. They are not foundation models themselves. They are developer tools, wrappers, agents, orchestration frameworks, or product demos built on top of models.

**TTFT** means *time to first token*.
**TPOT** means *time per output token*.
**Total latency** is the full time from sending a request to receiving the complete response.

Why does this matter for an engineer? These metrics help diagnose where an LLM application feels slow. If **TTFT** is high, the user waits too long before seeing anything, so the app feels unresponsive. If **TPOT** is high, the model starts responding but streams too slowly, which hurts long answers. If **total latency** is high, the entire workflow takes too long, even if the first token appears quickly. These metrics are useful in chat apps, copilots, RAG systems, and agent workflows because they help identify whether the bottleneck is prompt size, retrieval, model speed, output length, or the overall pipeline design.

Models with **open-ended output** are powerful because they can handle many kinds of tasks, but they are also harder to evaluate than systems with fixed answer choices.

**Prompt engineering** means adapting model behavior without changing the model's weights. You guide the model through instructions, examples, constraints, and context.

**Weights** are the learned numerical parameters inside a neural network. They store what the model learned during training.

**Fine-tuning** means updating those weights using additional training data so the model becomes better at a specific task, domain, or style. This changes the model itself, unlike prompting.

### Model development 

 - come up with model architecture
 - train it 
 - fine tune it

#### Training the model

1. Pretraining: training a model from scratch. Model weights are randomly initialized. For an LLM, pretraining usually means training for next-token prediction on a very large corpus. Pretraining is the most resource-intensive phase.

#### Fine-tuning

Fine-tuning starts with an already pretrained model. The weights come from the earlier training process and are then updated further for a narrower use case. In that sense, the weights are the main artifact produced by model development.

What do you mean by open-ended vs closed-ended tasks? In a closed-ended task, the output is restricted to predefined labels or values. For example: spam vs not spam, yes vs no, positive vs negative. In an open-ended task, the model can generate many valid outputs. That is why annotating open-ended queries is harder.

**Annotation** means creating labels or reference answers for training or evaluation. For a closed task, annotation can be simple. For an open-ended task, humans may disagree on what counts as the best answer.

### Inference optimization

Inference optimization means making a model cheaper and faster at serving time.

Foundation models are autoregressive, so tokens are generated sequentially. That is one reason latency matters so much in production systems.