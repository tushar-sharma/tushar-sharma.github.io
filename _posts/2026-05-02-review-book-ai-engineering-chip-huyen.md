---
layout: post
title: AI Engineering - Building Applications with Foundation Models by Chip Huyen
thumb: 'https://unsplash.com/photos/Ne2ANNXGW6M/download?w=437'
image: 'https://unsplash.com/photos/Ne2ANNXGW6M/download?w=437'
author: tushar sharma
category: blog
tags: 
 - books
 - ai
 - llm
mathjax: true
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

**Weights** are the learned numerical parameters inside a neural network. They store what the model learned during training. Initilaly, before training LLM's weight are set to random numbers.

$$
\text{Output} = \text{Input Vector} \times \text{Weights}
$$

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

## May 28, 2026

A LLM generates text one token a time. To choose a next token, the model uses its {% recall vocabulary %} The model's **vocabulary** is a fixed lookup table mapping every known token to a unique number (ID). The model never sees raw text — only sequences of these IDs.{% endrecall %} and calculates a probability score for each one. **Sampling** is actual process of selecting the **next token** from these ranked probablities.

Lets say, the user gave the following prompt to the model 

```
The cat sat on the 
```

The model consider all tokens in it's vocabulary. Example:

| Token     | Probability |
| --------- | ----------: |
| `"mat"`   |         45% |
| `"floor"` |         25% |
| `"bed"`   |         10% |
| `"roof"`  |          5% |
| others    |         15% |

A simple strategy called **greedy decoding** would always choose the highest probablity token.

However, model uses **sampling**, which introduces controlled randomness when choosing the next token.

**Temperature** influences the randomness during sampling. A low temperature (e.g. 0.2) makes the distribution sharper and deterministic, making "mat" more likely to be chosen.

In contrast, **higher temperature**, flattens the distribution, increasing the chances of less likely tokens such as "roof" being selected.

> use lower temperature for more deterministic output. Higher temperature for creative outputs

--- 

### Embeddings

In a 2D space, a point `(x, y)` represents two values. In a 3D space, a point `(x, y, z)` can represent three properties such as width, height, and length.

Similarly, machine learning models can use points in much higher-dimensional spaces, such as **1024 dimensions**. A point in this space looks like:

```text
(x1, x2, x3, ..., x1024)
```

Each coordinate captures some learned feature or characteristic. So, an **embedding** is essentially a coordinate (vector) in a high-dimensional space that represents information in a numerical form.

When text is given to an LLM, it first goes through **tokenization**, where the input is split into tokens. These tokens are then mapped to a unique ID. Later, the model converts these IDs into embedding vectors. 

#### Static embeddings

However, token IDs themselves do not carry meaning. Therefore, the model converts these IDs into **embedding vectors**.

Earlier NLP systems often used **static embeddings**, where each word always had the same vector regardless of context. A famous example is **Word2Vec**.

For example, the word `"bank"` would always receive the same embedding whether the sentence referred to:

- a river bank
- a financial bank

Static embeddings capture general meaning but cannot adapt to context.

#### contextual embedding

Modern LLMs use **contextual embeddings**.

The model may start with an initial embedding lookup, but these embeddings are then continuously updated based on surrounding words using a mechanism called **attention**.

This allows the same word to have different meanings depending on context.

For example:

```text
I deposited money in the bank
```

and

```text
The boat reached the river bank
```

The token `"bank"` begins with an initial embedding, but attention updates it differently in each sentence.

This contextual updating is one of the key differences between older NLP models and modern transformer-based LLMs.

> Note: embeddings are not exactly "1024 pieces of information." Each dimension is a learned numerical feature, and meaning is distributed across many dimensions rather than one dimension representing one explicit concept.

---

Common source of training data is **common crawl**. Google's **Med-PalM2** combines the power of LLM with medical data.

---

LLMs are based on **transformer** architecture. It relies on **attention mechanism**.

> TODO: what's attention mechanism? 

Before transformers, many sequence-to-sequence models used **RNNs (Recurrent Neural Networks)**. 

```text
seq2seq = RNN + Attention 

LLM = Attention
```

### Softmax

**Softmax** turns raw scores into probabilities.

The raw scores are called **logits**. A logit can be any real number: negative, zero, or positive. Softmax converts a list of logits into positive numbers that sum to 1.

Softmax appears in two important places:

- **Inside attention**: it converts token-to-token scores into attention weights.
- **At the model output**: it converts vocabulary logits into next-token probabilities.

For example, after the prompt:

```text
the cat sat on the
```

the model might produce logits for possible next tokens:

| Token     | Logit |
| --------- | ----: |
| `"mat"`   |   2.0 |
| `"floor"` |   0.0 |
| `"sky"`   |  -1.0 |

These are not probabilities yet. Softmax converts them into probabilities.

The formula is:

$$
\text{softmax}(x_i) = \frac{e^{x_i}}{\sum_j e^{x_j}}
$$

Step by step:

1. Apply \(e^x\) to every logit. This makes every value positive.
2. Add all exponentials together.
3. Divide each exponential by the total.

Let's write softmax from scratch:

```python
import math

tokens = ["mat", "floor", "sky"]
logits = [2.0, 0.0, -1.0]

exponentials = []
for logit in logits:
    exponentials.append(math.exp(logit))

total = sum(exponentials)

probabilities = []
for exp_value in exponentials:
    probabilities.append(exp_value / total)

for token, probability in zip(tokens, probabilities):
    print(f"{token}: {probability:.2%}")

print(f"Total: {sum(probabilities):.2f}")
```

Output:

```text
mat: 84.38%
floor: 11.42%
sky: 4.20%
Total: 1.00
```

In real code, we usually subtract the maximum logit before exponentiating. This does not change the final probabilities, but it prevents numerical overflow when logits are large.

```python
import numpy as np

def softmax(x, axis=-1):
    shifted = x - np.max(x, axis=axis, keepdims=True)
    exp = np.exp(shifted)
    return exp / np.sum(exp, axis=axis, keepdims=True)
```

---

## June 6, 2026: Architectures, Inference, and Implementation

In this session, I explored the evolution of model architectures, the mechanics of high-performance inference, and the practicalities of building AI applications.

### From Seq2Seq to Transformers

Historically, machine translation and sequence modeling relied heavily on the **Seq2Seq (Sequence-to-Sequence)** architecture. 

#### 1. Seq2Seq (The RNN Era)
Seq2Seq models typically use **Recurrent Neural Networks (RNNs)** for both the encoder and the decoder.
*   **What is an RNN?** A Recurrent Neural Network is a type of neural network designed for sequential data. It processes inputs one by one, maintaining a "hidden state" that carries information from previous steps to the current one.
*   **The Process:** 
    1.  The **Encoder** processes the input tokens sequentially and generates a final hidden state (a "context vector").
    2.  The **Decoder** takes this final hidden state and generates output tokens one by one.
*   **The Bottleneck:** Because RNNs process tokens sequentially, they are slow and struggle with long-range dependencies (the "vanishing gradient" problem).

#### 2. The Transformer Architecture
Introduced in the seminal paper *"Attention Is All You Need"* (2017), Transformers revolutionized the field by ditching RNNs entirely in favor of the **Attention Mechanism**.
*   **Parallelism:** Unlike RNNs, Transformers can process the entire input sequence in parallel during training.
*   **Current State:** Today, almost all state-of-the-art systems (like GPT-4, Llama 3) use Transformer-based architectures.

> **Note on Tokenization:** A larger vocabulary allows a model to represent complex words as single tokens (e.g., "extraordinary"). Smaller vocabularies might break the same word into multiple tokens ("extra", "ordinary"), increasing the sequence length the model has to process.

---

### The Mechanics of Inference and KV Caching

When we run an LLM, we use an **Inference Server** (like vLLM, Ollama, or TensorRT-LLM). There is a lot of nuance in how "Inference" works, particularly around the **KV Cache**.

#### 1. Prefill vs. Decode
Inference isn't just one step; it has two distinct phases:
*   **Prefill Phase:** The model processes your entire prompt in parallel. It computes the **Query (Q)**, **Key (K)**, and **Value (V)** vectors for every token in the prompt. The K and V vectors are then stored in the **KV Cache**.
*   **Decode Phase:** The model predicts the next token sequentially. For every *new* token, the model reuses the previously stored K and V vectors instead of recomputing them from scratch.

#### 2. What Exactly is the KV Cache?
It is a cache of vectors. Specifically, for every token and every transformer layer, the model stores the **Key (K)** and **Value (V)** vectors.
*   **Why not Query (Q)?** During generation, the model needs a *new* Query vector for the current state. However, it can attend to all previous tokens by reusing their *old* K and V vectors. Caching Q wouldn't help because Q changes at every decoding step.

#### 3. Context Window vs. KV Cache
*   **KV Cache:** The actual data stored (like cars parked in a lot).
*   **Context Window:** The limit on how much data can be kept (like the size of the parking lot).

#### 4. The Context Window Trade-off: Why "Bigger" isn't always "Better"
We use large context windows for **long-form tasks** (codebases, books), but they come with penalties:
*   **Efficiency (The "Quadratic Tax"):** Standard self-attention has **quadratic complexity** $O(n^2)$. Doubling tokens quadruples the computation.
*   **Quality (Why Models Get "Dumb"):** Models suffer from **"Lost in the Middle"**. Attention is diluted, and noise from irrelevant information can lead to hallucinations.

**Simplified Inference Flow:**
```text
User Prompt
     │
     ▼
  Prefill Phase
     │
     ├── Compute Q, K, V for all prompt tokens
     └── Store K, V in the KV Cache
     │
     ▼
  Decode Phase
     │
     ├── New token generated
     ├── Compute new Q, K, V
     ├── Append new K, V to cache
     └── Attend to all cached K, V
     │
     ▼
  Final Output
```

---

### Preparing for Implementation

To move from understanding these notes to an actual AI Engineering project, I need to focus on:

1.  **KV Caching:** Recomputing K and V vectors for every token is inefficient. KV caching stores these vectors in memory to speed up inference.
2.  **Quantization:** Reducing the precision of model weights (e.g., from FP16 to INT8 or INT4) to fit large models on smaller GPUs.
3.  **Evaluation Frameworks:** Setting up "LLM-as-a-judge" or using frameworks like **DeepEval** or **RAGAS** to measure model performance beyond "vibe checks."
4.  **Serving Infrastructure:** Exploring tools like **vLLM** or **TGI (Text Generation Inference)** for high-throughput model serving.

### Implementation Toolkit

To get started with an actual project, I should familiarize myself with these libraries:
*   **Hugging Face Transformers:** The industry standard for loading and using foundation models.
*   **LangChain / LlamaIndex:** Frameworks for building RAG pipelines and agentic workflows.
*   **PyTorch / JAX:** For more low-level model manipulation or fine-tuning.
*   **Pydantic:** Essential for structured output parsing (making LLM outputs usable in code).

### Deep Dive: The Attention Formula

The core of the transformer is the **Scaled Dot-Product Attention** formula:
$$Attention(Q, K, V) = \text{softmax}\left(\frac{QK^T}{\sqrt{d_k}}\right)V$$

*   **$QK^T$**: This dot product calculates the "similarity" between the Query (what we want) and the Keys (what is available).
*   **$\sqrt{d_k}$**: We scale by the square root of the dimension to prevent the dot products from getting too large, which would cause the softmax to have very small gradients.
*   **Softmax**: Turns these similarities into weights (probabilities).
*   **$V$**: We multiply the weights by the Values to get the final context-aware representation.

This calculation happens in **every layer** of the model.

---

### The Transformer Block

A Transformer model is essentially a stack of identical **Transformer Blocks**. Each block consists of two main components:

#### 1. The Attention Module
This is where the model "looks" at other tokens. It includes:
*   **Linear Layers** to project the input into Q, K, and V vectors.
*   **Multi-Head Attention** to capture different types of relationships.
*   **Output Projection Matrix:** After the multiple attention heads are concatenated, we apply a projection matrix. 
    *   **What is it?** It's a weight matrix that transforms the concatenated output back into the model's hidden dimension (e.g., 4096). This "mixes" the information from all heads.

#### 2. The MLP (Multi-Layer Perceptron) Module
Also known as the **Feed-Forward Network (FFN)**. It processes each token independently (in parallel). It consists of:
*   **Two Linear Layers** separated by a **Non-Linear Activation Function**.

---

### Why Non-Linear Activation (ReLU/GeLU)?

The most famous activation function is **ReLU (Rectified Linear Unit)**:
$$ReLU(x) = \max(0, x)$$

*   **What it does:** It keeps positive numbers as they are and converts all negative numbers to zero.
*   **Why convert negatives to zero?** 
    1.  **Non-linearity:** Without a non-linear function, multiple layers of a neural network would just collapse into a single linear transformation (simple matrix multiplication). Non-linearity allows the model to learn complex, non-linear patterns.
    2.  **Sparsity:** By setting negatives to zero, it "deactivates" certain neurons, making the network's representation sparse and efficient.
    3.  **Efficiency:** It is computationally very cheap to calculate.

Modern models like Llama often use **GeLU (Gaussian Error Linear Unit)** or **SiLU/SwiGLU**, which are smoother versions of ReLU that perform better in deep networks.

