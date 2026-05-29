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

The model generates the next output token with different probabilities. Sampling is a process of choosing which token to pick from all possible options. Example 

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


So a model with low temperature might pick up **mat**, whereas with **high temperature** it might pick up **roof**. Low temperature makes the distribution sharper (more deterministic), so the model tends to choose high-probability tokens more often. High temperature flattens the distribution, increasing randomness and diversity.

So an input to a LLM is broken into tokens. These tokens are then mapped to index numbers using a vocabulary lookup table. It's just a basic array lookup. Now those values are then converted to vectors, which are points in a high-dimensional space (a long list of numbers).

In a 2D space, (x,y) are needed to describe a point. In 3D, we have (x,y,z). In model, we have 1024D like (x1, x2, x3, ..., x1024). This means it has more features that it can encode. This is called **embedding dimension** which represnet what's the representation capacity of a model.

---

Common source of training data is **common crawl**. Google's **Med-PalM2** combines the power of LLM with medical data.

---

### Transformer Architecture and Attention

A **transformer** is the neural-network architecture behind most modern LLMs. Its key idea is **attention**: each token can look at other tokens and decide which ones matter for understanding the current token.

Suppose the input is:

```text
The cat sat on the mat
```

When the model processes the token `"sat"`, it should pay attention to `"cat"` because `"cat"` tells us who performed the action. It may pay less attention to `"the"` because that token carries less meaning for this decision.

Attention is often explained with three terms: **query**, **key**, and **value**.

- **Query (Q)**: what the current token is trying to find.
- **Key (K)**: what each token advertises about itself.
- **Value (V)**: the information each token can contribute.

An analogy: if you search a library catalog, your search phrase is the **query**, the book titles and metadata are the **keys**, and the book contents are the **values**. The search first finds matching books, then returns useful content from those books.

In a transformer, Q, K, and V are not human-written labels. They are vectors learned from data. Starting from token embeddings, the model creates Q, K, and V with learned weight matrices:

$$
Q = XW_Q,\quad K = XW_K,\quad V = XW_V
$$

Here, \(X\) is the matrix of token embeddings. Each row is one token. \(W_Q\), \(W_K\), and \(W_V\) are learned weights.

The attention calculation is:

$$
\text{Attention}(Q, K, V) = \text{softmax}\left(\frac{QK^T}{\sqrt{d_k}}\right)V
$$

Read this formula from left to right:

1. **Compare queries with keys**: \(QK^T\) gives a score for how much each token should pay attention to every other token.
2. **Scale the scores**: divide by \(\sqrt{d_k}\), where \(d_k\) is the key-vector dimension. This keeps large vectors from producing extremely large scores.
3. **Normalize with softmax**: softmax turns raw scores into attention weights. For each token, the weights across all tokens sum to 1.
4. **Mix values**: multiply the attention weights by \(V\). The result is a new representation for each token that includes information from relevant context tokens.

This is called **self-attention** when the tokens attend to other tokens in the same sequence.

#### Why Transformers Replaced RNN Seq2Seq Models

Before transformers, many sequence-to-sequence models used **RNNs (Recurrent Neural Networks)**. An RNN reads tokens one at a time:

```text
token 1 -> hidden state 1
token 2 -> hidden state 2
token 3 -> hidden state 3
```

A **hidden state** is the model's internal summary of what it has read so far. It is called hidden because it is not the final visible output.

The problem is that RNNs are sequential. Token 3 cannot be processed until token 2 is done. Token 100 cannot be processed until token 99 is done. This makes training slower and makes long-range dependencies harder to preserve.

Attention improved RNN-based seq2seq models because the decoder could look back at earlier encoder states. But the recurrent structure still remained.

Transformers removed the recurrent loop. Instead of updating one hidden state step by step, a transformer represents the whole sequence as matrices and uses matrix multiplication to compare many tokens at once. This makes transformers much more GPU-friendly during training.

Important nuance: autoregressive transformers still **generate** one token at a time during inference. They can process the input prompt efficiently, but when producing output, the next token depends on the tokens already generated.

```text
RNN seq2seq:
  - Processes tokens sequentially.
  - Maintains a hidden state.
  - Uses attention as an add-on to look back at encoder states.

Transformer:
  - Represents tokens as matrices.
  - Uses self-attention as the central operation.
  - Processes sequence positions in parallel during training.
```

#### A Small Self-Attention Example

This is a simplified example. A real transformer has multiple layers, multiple attention heads, residual connections, normalization, and feed-forward networks. But this code shows the core attention idea.

```python
import numpy as np

def softmax(x, axis=-1):
    # Subtract max for numerical stability.
    shifted = x - np.max(x, axis=axis, keepdims=True)
    exp = np.exp(shifted)
    return exp / np.sum(exp, axis=axis, keepdims=True)

# Three token embeddings, each with two dimensions.
# Imagine these are embeddings for: "The", "cat", "sat"
X = np.array([
    [0.1, 0.8],
    [0.9, 0.2],
    [0.2, 0.1],
])

# In a real transformer, these are learned matrices.
W_Q = np.array([
    [1.0, 0.0],
    [0.0, 1.0],
])

W_K = np.array([
    [1.0, 0.0],
    [0.0, 1.0],
])

W_V = np.array([
    [1.0, 0.0],
    [0.0, 1.0],
])

Q = X @ W_Q
K = X @ W_K
V = X @ W_V

dk = K.shape[-1]
scores = (Q @ K.T) / np.sqrt(dk)
weights = softmax(scores, axis=-1)
output = weights @ V

print("Attention scores:")
print(scores)

print("\nAttention weights:")
print(weights)

print("\nOutput after mixing value vectors:")
print(output)
```

The shape is important:

- `scores` is a 3 x 3 matrix. Each row asks: "For this token, how much should I look at every token?"
- `weights` is also 3 x 3, but each row sums to 1 after softmax.
- `output` is a new representation for each token after it has gathered information from other tokens.

---

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
