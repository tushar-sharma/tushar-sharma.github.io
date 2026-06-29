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
book_notes: true
---

These are my learning notes and reflections while reading "AI Engineering: Building Applications with Foundation Models" by Chip Huyen. I plan to update this periodically as I progress through the book.<!-- truncate_here -->

<!-- disclaimer -->
<div class="book-notes-disclaimer">
  These are my rough notes while reading the book.
</div>

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

## June 7, 2026

### ReLU (Rectified Linear Unit)

- A **non-linear** activation function.
- Formula: ReLU(x) = max(x, 0)
- Clamps all negative numbers to zero. Positive numbers are unchanged.

### Epoch

An epoch is one complete pass through the entire dataset.

```bash
                  ┌─────────────────────────────────────┐
                  │ START OF EPOCH 1                    │
                  └─────────────────────────────────────┘
                                     │
Step 1: Row 1 ──► [Transformer Matrix Math] ──► Guess vs. "Raleigh" ──► Loss ──► Gradient Update
                                     │
Step 2: Row 2 ──► [Transformer Matrix Math] ──► Guess vs. "Madrid"  ──► Loss ──► Gradient Update
                                     │
Step 3: Row 3 ──► [Transformer Matrix Math] ──► Guess vs. "4"       ──► Loss ──► Gradient Update
                                     │
                  ┌─────────────────────────────────────┐
                  │ END OF EPOCH 1                      │
```

Once step 3 is over, the model switches back to **Row 1** and begins **Epoch 2**. The loop repeats hundreds of thousands of times since the weights in the first epoch were random. The goal of training is to find the correct weights. An epoch typically ends when the average loss is less than a **pre-set** threshold like 0.05, or after a fixed number of iterations.

For larger datasets, we use mini-batches. After each batch, gradient descent updates the weights.

### Training pipeline

```
[Input Text] ──► Tokenizer ──► Token IDs ──► Embedding + Positional Matrix
                                                      │
                                                      ▼
                                            ┌───────────────────┐
                                            │ Transformer Blk 1 │
                                            └─────────┬─────────┘
                                                      │
                                                      ▼
                                            ┌───────────────────┐
                                            │ Transformer Blk N │
                                            └─────────┬─────────┘
                                                      │
                                                      ▼
                                              Unembedding Layer
                                                      │
                                                      ▼
                                                Output Layer
                                                      │
                                                      ▼
                                                Loss Function
                                                      │
                       ◀── [Updates All Weights] ─────┴── Gradient Descent
```

### Inference pipeline

- Inference is when a model is generating text. Think of it like when a pod is ready to serve the user request.
- Loss function and Gradient Descent are completely stripped off since weights are frozen.
- The model predicts exactly one token at a time. It can store these intermediate Keys and Values in a slice of VRAM called the **KV cache**.

Let's do a dry run.

Prompt: "What's the capital of North Carolina?"

Tokens (Seq): 7
Hidden dimensions (d_model) = 10 (assumed)

Your 7 words are converted by the tokenizer into a 1D array of 7 token IDs.

$$\text{Token IDs} = [412, 18, 24, 1095, 13, 856, 3014]$$

Now we convert these into the hidden dimension of 10. The model will look up these IDs in the **embedding matrix**.

The embedding matrix is a static lookup table of size $[V \times d_{model}]$, where $V$ is the number of unique words (vocabulary size) the tokenizer knows. (e.g., [100 x 10]).

The positional matrix is a static table of shape $[c \times d_{model}]$, where $c$ is the limit of tokens (context window) that a model can handle.

$$\text{Input Matrix } (X) = \begin{bmatrix}
\text{"What"} \\ \text{"is"} \\ \text{"the"} \\ \text{"capital"} \\ \text{"of"} \\ \text{"North"} \\ \text{"Carolina"}
\end{bmatrix} =
\begin{bmatrix}
0.15 & -0.23 & 0.81 & \dots & 0.04 \\
0.91 & 0.02 & -0.45 & \dots & 0.12 \\
-0.03 & 0.67 & 0.12 & \dots & -0.89 \\
0.54 & -0.11 & 0.99 & \dots & 0.33 \\
0.22 & 0.44 & -0.01 & \dots & 0.76 \\
0.88 & -0.92 & 0.34 & \dots & -0.11 \\
-0.41 & 0.15 & 0.62 & \dots & 0.55
\end{bmatrix}_{7 \times 10}$$

Next, we generate **Q, K, V** vectors.

We multiply the $[7 \times 10]$ input by the $(W_Q, W_K, W_V)$ weights $[10 \times 10]$, which gives us three $[7 \times 10]$ matrices.

- **Q (Query)** means what each token is looking for.
- **K (Key)** means what each token contains.
- **V (Value)** means what each token represents.

Next, calculate **attention**.

- K has $[7 \times 10]$ shape.
- $K^T$ has a shape of $[10 \times 7]$.

$$\text{Scores} = Q [7 \times \cancel{10}] \cdot K^T [\cancel{10} \times 7] \rightarrow \mathbf{[7 \times 7]}$$

Scores is a $[7 \times 7]$ grid. This corresponds to the $seq \times seq$ dimensions.

$$\text{Scores Matrix} = \begin{aligned} &\quad \text{Wht} \quad \text{is} \quad \text{the} \quad \text{cap} \quad \text{of} \quad \text{Nth} \quad \text{Car} \\ &\begin{bmatrix}
8.2 & 0.1 & 0.4 & 1.2 & 0.2 & 0.5 & 0.3 \\
0.2 & 6.4 & 1.1 & 0.1 & 0.9 & 0.2 & 0.1 \\
0.5 & 0.9 & 4.1 & 2.2 & 0.3 & 0.4 & 0.6 \\
1.1 & 0.2 & 2.1 & 9.5 & 0.4 & 7.8 & 8.1 \\
0.1 & 0.8 & 0.2 & 0.5 & 5.5 & 0.1 & 0.2 \\
0.4 & 0.1 & 0.3 & 8.2 & 0.1 & 9.1 & 9.4 \\
0.2 & 0.2 & 0.5 & 8.0 & 0.2 & 9.3 & 9.7
\end{bmatrix} \end{aligned}$$

We run this matrix through **softmax** row by row.

**Multiply by V**:

Attention $[7 \times 10]$ = softmax score $[7 \times 7] \times V [7 \times 10]$

Lastly, multiply this by the **Output projection** $W_O [10 \times 10]$.

$$\text{Final Attention Layer Output} = \text{Attention Output } [7 \times \cancel{10}] \cdot W_O [\cancel{10} \times 10] \rightarrow \mathbf{[7 \times 10]}$$

---

When we say **Llama-13B**, it means that it has 13 billion parameters.

### Parameter vs Hyperparameter

A **parameter** is a value learned during model training (like weights). A **hyperparameter** is a setting you configure outside the learning process, like temperature, model dimensions, vocabulary size, etc.

---

**What is a sparse model?**
A sparse model has a large percentage of zero-value parameters. It allows for more efficient data storage and computation. Then why use dense models? (Dense models often capture more complex patterns but are more expensive).

**Mixtral 8x7B** = Mixture of Eight Experts (MoE). This means that not all parameters are active for every token; only a subset of "experts" is triggered.

**FLOPs** is how we measure the computational cost of a model. FLOPs stands for Floating Point Operations.

**FLOP/s** (FLOPs per second) is different; it measures hardware performance.

## June 13, 2026

A language model has two phases. Pre training and post training. Pre training mostly happens with self-supervised learning on a large amount of internet data. The data can be noisy and mixed quality, but the scale helps the model learn language, facts, patterns, and reasoning-like behavior.

Fine tuning is used to refine the model. Two famous post training methods are

1. **Supervised fine tuning**: Training the model on high quality instruction data. So a model is trained for not just **text completion** but on following instructions and conversations.

2. **Preference fine tuning**: Fine tune the model so that it aligns with human preferences. This can use **Reinforcement Learning** (RL), like RLHF, but not all preference tuning has to be RL. There are also methods like DPO.

### Sampling

Sampling is the final step where we pick the next output token from a probability distribution. The full decoding pipeline is usually:

1. The model generates a **logits vector**. The size of this vector is equal to the vocabulary size.

2. Some decoding rules transform logits before softmax. For example, temperature rescales logits, and grammar constraints can mask illegal tokens by setting their logits to negative infinity.

3. Softmax converts logits into probabilities.

4. Some decoding rules filter the probability distribution. For example, top-k keeps the k most likely tokens, while top-p keeps the smallest set of tokens whose cumulative probability reaches p. Implementations often apply this by masking logits and then re-running softmax to re-normalize.

5. Sampling chooses one token from the final probability distribution. If we always choose the highest-probability token, that is greedy decoding rather than random sampling.


#### Temperature

Decoding parameter where you divide each value in logits vector with temperature before softmax. So if temperature is high, the probability distribution becomes flatter. The most likely token is still likely, but less dominant. So the model with high temperature is less deterministic and more creative.

With low temperature, the probability distribution becomes sharper. The most likely token becomes even more likely, so the model is more deterministic. In practice, temperature of zero usually means greedy decoding: always pick the token with the highest probability.


#### Greedy Sampling

Choose the token with highest probability. Works great for tasks where you want a stable answer, like classification or extraction. It can be too boring or brittle for open ended generation.

#### LogProbabilities

Anywhere you apply log, think of squeezing it. Usually with probabilities with long end tail, log of those values is easier to comprehend and compute with. In language models, log probabilities are usually natural logs of softmax probabilities. They are useful because multiplying many small probabilities can underflow, but adding log probabilities is stable.

Also most companies hide their LogProb APIs? why

Maybe because logprobs expose more about model behavior and make APIs harder to support consistently across model families. But they are useful for debugging, classification confidence, evals, autocomplete, and comparing possible outputs.

### Top-k

Top-k means only allow the top k most likely tokens to be sampled from. The rest are filtered out. In implementation, this is usually done by setting their logits to negative infinity and then applying softmax again, which re-normalizes the probability distribution over only these k tokens.

This is not mainly to make softmax cheaper. The model still produces logits for the whole vocabulary. Top-k is mainly a decoding control so that very unlikely tokens are not sampled.


#### Top-p

Instead of having fixed k size logits, we can make it dynamic. We sort tokens by probability in descending order and keep adding tokens until their cumulative probability is at least p. Then we sample only from this smaller set.

Empirically it often works better than top-k because the candidate set can be small when the model is confident and larger when the model is uncertain.

How does a model know when to stop?

1. Restrict number of tokens? but we could have incomplete response

2. Use End of Sequence token? During training, the model learns special tokens that mark the end of a response/document. During generation, if the model emits this token, decoding stops.

3. Use stop sequences? The application can define strings like `\n\nUser:` or `</answer>` and stop generation when they appear.

4. The API or serving system can also stop because of max output tokens, safety filters, tool call boundaries, or structured output constraints.

## June 14, 2026


### Prompting

You can use prompting to instruct a model to generate **structured output** like JSON or SQL. But prompting alone is a soft constraint: the model can still emit invalid JSON, miss a field, or add extra text.

### Constrained Decoding

We already know decoding controls like **temperature**, **top-k**, and **top-p**. The model first produces a **logits vector**, then decoding rules transform or filter the possible next tokens before the final token is sampled.

With **constrained decoding**, we restrict which tokens are legal at each generation step. This is stronger than just asking nicely in the prompt.

Examples:

- If output must be JSON, after `{` the decoder can allow only tokens that keep the JSON valid.
- If a field must be one of `["small", "medium", "large"]`, the decoder can block tokens that cannot lead to one of those values.
- If output must match a regex or grammar, the decoder masks out tokens that violate that grammar.

A **classifier head** is different. It predicts a class from model representations. It can be used for classification, reranking, or moderation, but it is not the usual meaning of constrained sampling.

### Limitations of Language Models

1. **Inconsistency**: The same prompt can produce different answers when decoding is stochastic. Even with low temperature, small prompt changes can change the answer.

2. **Hallucination**: The model generates text that sounds plausible but is false, unsupported, or not grounded in the provided context. It is not simply "answering something it was not trained on." A model can hallucinate about common facts too.

3. **Lack of calibrated confidence**: The model may sound equally confident when it is correct, uncertain, or wrong.

### Snowballing hallucination

Snowballing hallucination happens when the model makes one incorrect assumption, then builds more reasoning on top of it.

Example: "Is 1337 a prime number?"

Incorrect path: "Yes, 1337 is prime because it is not divisible by small primes."

Correct path: 1337 is not prime because `1337 = 7 * 191`.

Once the model commits to the wrong first step, the rest of the explanation can become a justification of that mistake.

### Underflow Problem

Probabilities are between 0 and 1. When we multiply many small probabilities together, the result can become so tiny that a computer rounds it to zero. This is called **numerical underflow**.

Instead of multiplying probabilities directly:

$$P(x_1, x_2, x_3) = P(x_1) * P(x_2) * P(x_3)$$

we usually add log probabilities:

$$\log P(x_1, x_2, x_3) = \log P(x_1) + \log P(x_2) + \log P(x_3)$$

This is more numerically stable and easier to compare across candidate outputs.

## June 19, 2026

Language models are **open-ended** models. They can produce many possible valid outputs, not just one fixed label.

Closed-ended models have a fixed output space. Example: classification model outputs `spam` or `not spam`.

Open-ended models have an almost unlimited output space. Example: summarization, chat, code generation, and reasoning. This makes them powerful, but also harder to test because there may be many acceptable answers and many subtle failure modes.

### Entropy

In Claude Shannon's information theory, **entropy** measures uncertainty.

For language models, entropy tells us how unpredictable the next token is.

- Low entropy: the next token is obvious.
- High entropy: many next tokens are plausible.

Information is measured with negative log probability:

$$
I(x) = -\log_2 P(x)
$$

If an event has probability `0.5`, then:

$$
-\log_2(0.5) = 1
$$

So an event with 50% probability carries **1 bit** of information. This means one yes/no question is enough to resolve that uncertainty.

If an event is very likely, it carries little information. If an event is surprising, it carries more information.

Conceptually, different logs measure the same thing in different units:

- `log_2`: measures information in **bits**. Common in information theory and compression.
- `ln` or `log_e`: measures information in **nats**. Common in machine learning because calculus with `e` is cleaner.
- `log_10`: measures information in decimal digits. Common in science/engineering scales.

The base changes the unit, not the idea.

$$
\log_2(x) = \frac{\ln(x)}{\ln(2)}
$$

### Cross-Entropy

**Cross-entropy** measures how hard it is for a model to predict the true next token.

In language model training:

- `P` is the real data distribution.
- `Q` is the model's learned distribution.
- Lower cross-entropy means the model assigns higher probability to the correct tokens.
- Training tries to minimize cross-entropy.

Practical meaning: if the model sees `"The capital of France is"` and gives high probability to `"Paris"`, loss is low. If it gives low probability to `"Paris"`, loss is high.

### KL Divergence

**KL divergence** measures how different one probability distribution is from another.

$$
D_{KL}(P \Vert Q) = H(P, Q) - H(P)
$$

Where:

- `P` is the true distribution.
- `Q` is the model's learned distribution.
- `H(P)` is the entropy of the real data.
- `H(P, Q)` is the cross-entropy when using the model to predict real data.

`P || Q` is read as "P compared to Q". It is not symmetric:

$$
D_{KL}(P \Vert Q) \ne D_{KL}(Q \Vert P)
$$

Intuition: KL divergence is the extra surprise or extra cost we pay because the model's distribution is not the same as the true distribution.

Simple example:

```text
True distribution P:
cat = 0.8
dog = 0.2

Model distribution Q:
cat = 0.5
dog = 0.5
```

The model is not completely wrong, but it is less confident about `cat` than the real data. KL divergence measures that mismatch.

A model's job during pretraining is to learn the probability distribution of the training data.

Useful compression-style metrics:

- **Bits per character**: average bits needed to encode each character.
- **Bits per byte**: average bits needed to encode each byte.

Lower is better because the model is less surprised by the data.

### Perplexity

**Perplexity** is another way to express cross-entropy. It roughly means: "how many equally likely choices the model feels it has at each step."

If entropy is measured in bits:

$$
PPL = 2^H
$$

If cross-entropy is measured in nats:

$$
PPL = e^H
$$

Low perplexity means the model is confident and usually assigns high probability to the correct next token.

High perplexity means the model is uncertain; many tokens seem possible.

For a token sequence `x_1, x_2, ..., x_n`:

$$
PPL(x_1, ..., x_n) = P(x_1, ..., x_n)^{-\frac{1}{n}}
$$

Using next-token probabilities:

$$
PPL = \left(\prod_{i=1}^{n} \frac{1}{P(x_i \mid x_1, ..., x_{i-1})}\right)^{\frac{1}{n}}
$$

Important practical note: post-training can sometimes increase perplexity while making the model more useful. Why? Because instruction tuning and RLHF may teach the model to follow human preferences instead of only imitating raw internet text.

### Embeddings

An **embedding** is a vector: a list of numbers representing the meaning of something.

Text, images, audio, users, products, or documents can all be converted into embeddings.

The useful property: similar meanings tend to have nearby vectors.

Example: `sad` and `disappointed` should be closer to each other than `sad` and `happiness`.

We can compare embeddings using metrics like **cosine similarity**.

Practical uses:

- semantic search
- recommendations
- clustering
- duplicate detection
- RAG document retrieval

### CLIP Technology

**CLIP** connects text and images in the same embedding space.

It has two encoders:

- Text encoder: converts text into a text embedding.
- Image encoder: converts an image into an image embedding.

If an image and a caption match, their embeddings should be close.

Practical use: search images using text. For example, query `"a dog playing in snow"` and retrieve images whose embeddings are close to that text embedding.

### How Do We Evaluate Models?

Evaluation is harder for open-ended models because there is often no single correct answer.

Useful evaluation dimensions:

- **Accuracy**: is the answer correct?
- **Faithfulness**: is the answer supported by the provided context?
- **Helpfulness**: does it actually solve the user's task?
- **Safety**: does it avoid harmful or disallowed output?
- **Consistency**: does it give stable answers across similar prompts?
- **Latency and cost**: is it fast and cheap enough for the product?

For RAG systems, faithfulness is especially important. The model should answer from the retrieved context, not from unsupported memory or guesses.

## June 21, 2026

### Prompt engineering

Prompt engineering means designing the input to a model so that it is more likely to produce the behavior you want. It is an inference-time technique: it changes the tokens sent to the model, but it does **not** update the model's weights.

The model's **weights** are the learned parameters produced during training. If the weights change, we are doing some form of training or fine-tuning. If only the prompt changes, we are steering the model at inference time.

Most chat APIs separate the prompt into roles:

- **System prompt**: high-level instructions about behavior, constraints, persona, safety rules, output format, or domain expectations.
- **User prompt**: the concrete task or question from the user.
- **Assistant messages**: previous model responses, often included in multi-turn conversations.
- **Tool messages**: outputs returned by tools, when the model is used in an agentic or tool-calling setup.

Example:

```text
System: You are a dental assistant. Give scientifically grounded information and recommend professional care when symptoms could be serious.

User: I have had a toothache since yesterday. What should I do?
```

Internally, chat APIs usually serialize these role-based messages into one token sequence before sending them through the model. The exact formatting depends on the model provider and the model's chat template.

Important interview point: instruction placement can matter because transformers do not treat all positions equally. Models can show **position bias** or **lost-in-the-middle** behavior, where information near the beginning or end of the context may be easier to use than information buried in the middle. In practice, follow the provider's chat template and put durable behavioral instructions in the system message instead of hiding them deep inside the user prompt.

### In context learning

Models update their weights during **pretraining**, **post-training**, and **fine-tuning**.

- **Pretraining**: the model learns general language and world patterns from large datasets, usually with next-token prediction.
- **Post-training**: the model is adapted for usefulness, instruction following, safety, preference alignment, or domain behavior. This can include supervised fine-tuning and reinforcement learning from feedback.
- **Fine-tuning**: the model is trained further on a narrower dataset for a specific task, domain, style, or behavior.

**In-context learning** is different. The model is given instructions, examples, or reference material inside the prompt, and it uses them to perform the current task. The model appears to "learn" from the examples, but its weights do not change. Once the context is gone, that adaptation is gone too.

The examples included in a prompt are called **shots**:

- **Zero-shot**: no examples are given; the model must infer the task from the instruction alone.
- **One-shot**: one example is given.
- **Few-shot**: a few examples are given.

Few-shot examples help most when the task has an ambiguous format, unusual label space, or domain-specific convention. Good examples should be representative, correctly labeled, and formatted exactly like the expected output.

### Context length

Context length is the maximum number of tokens the model can consider in one request. It includes system messages, user messages, assistant messages, tool outputs, retrieved documents, few-shot examples, and the generated output tokens.

Longer context is useful because you can provide more instructions, conversation history, documents, examples, or tool results. But it also has tradeoffs:

- It increases inference cost because more tokens must be processed.
- It can increase latency, especially during the prompt-processing/prefill stage.
- It uses more memory because transformer inference stores attention-related state in the **KV cache**.
- It can make retrieval harder if important details are buried in irrelevant text.

The **KV cache** stores key and value tensors for previous tokens so the model does not recompute attention over the entire prefix for every generated token. During generation, each new token attends to prior tokens through this cache. Larger contexts therefore require more memory, commonly in GPU VRAM during hosted inference.

> A larger context window does not mean the model understands everything equally well. The model may still miss facts, over-focus on recent text, or ignore information in the middle.

### Best prompt engineering practices

1. **Be specific about the task**

   State the goal, audience, constraints, and success criteria. Vague prompts produce vague outputs.

2. **Provide relevant context**

   Include only information the model needs. More context is not always better if it adds noise.

3. **Specify the output format**

   Ask for JSON, a table, bullet points, code, a rubric, or a fixed schema when downstream processing matters.

4. **Use roles when they clarify behavior**

   A role can help set expectations, such as "act as a senior ML engineer reviewing this design." Avoid decorative roles that do not change the task.

5. **Use examples**

   Few-shot examples are often stronger than long explanations. Show the model what good input-output pairs look like.

6. **Ask for reasoning carefully**

   Prompts like "think step by step" can improve performance on reasoning tasks, but they also increase token cost and may produce verbose or unreliable explanations. A practical pattern is to ask the model to solve the problem carefully, then return a concise explanation or final answer.

7. **Ask the model to check its work**

   Self-critique can catch obvious mistakes, especially for formatting, missing requirements, or inconsistent assumptions. It is not a guarantee of correctness, so use external checks when the task is high-stakes.

8. **Decompose complex tasks**

   Break large tasks into smaller stages: extract facts, identify constraints, reason over options, then produce the answer. This is often more reliable than asking for everything in one pass.

9. **Use automatic prompt optimization when the task is repeated**

   Tools can search for better prompts using evaluation datasets, but they can be expensive because they require many model calls. They are most useful when you have a measurable target, such as accuracy, extraction quality, latency, or cost.

## June 28, 2026


### Prompt Attacks

Prompt attacks happen because an LLM sees the system prompt, developer instructions, retrieved context, tool outputs, and user message as one combined text sequence. The model does not naturally enforce a hard security boundary between trusted instructions and untrusted text.

Types of attacks:

- **Prompt extraction**: the attacker tries to reveal hidden system prompts, policies, credentials, or private context.
- **Jailbreaks**: the attacker tries to override safety or behavior constraints.
- **Indirect prompt injection**: malicious instructions are hidden inside retrieved documents, web pages, emails, tickets, PDFs, or tool outputs.
- **Data exfiltration**: the attacker uses the model or tools to leak information the user should not receive.


Solution:

- reduce blast radius by treating retrieved text and user input as untrusted 

- Limiting the tools the model call call

- Limiting secrets or priviledged instructions in model visible context

```text
### Retrieval-Augmented Generation

RAG is useful when the model needs access to private, changing, or long-tail knowledge that is not reliably stored in its parameters. The system retrieves relevant external context and gives it to the model at generation time.

- It reduces hallucination by grounding answers in supplied documents.
- It supports fresh or proprietary data without retraining the model.
- It gives better auditability because answers can cite retrieved sources.
- It introduces new failure modes: bad chunking, poor retrieval, stale indexes, irrelevant context, and prompt injection through retrieved text.

A typical RAG pipeline:

1. Ingest documents.
2. Split documents into chunks.
3. Convert chunks into searchable representations.
4. Store them in an index.
5. Retrieve top candidates for a query.
6. Optionally rerank, filter, or compress candidates.
7. Generate the answer using the retrieved context.
8. Evaluate faithfulness, relevance, latency, and cost.

### Sparse Retrieval

Sparse retrieval is term-based retrieval. It works well when exact words, names, IDs, error codes, API fields, or domain terms matter. The classic representation is a sparse vector where most vocabulary dimensions are zero.

Important concepts:

- **Term frequency (TF)**: how often a term appears in a document.
- **Inverse document frequency (IDF)**: how rare a term is across the corpus. Rare terms usually carry more signal.
- **BM25**: a strong traditional ranking function that improves on raw TF-IDF by handling term saturation and document length normalization.
- **Inverted index**: a mapping from each term to the documents that contain it, often with counts or positions. This is the core data structure behind systems like Elasticsearch.

It's useful when User search for error code, product SKU, function name, exact phrase

Tradeoffs:

- **Pros**: fast, mature, interpretable, strong for exact terms, easier to debug.
- **Cons**: weaker for synonyms, paraphrases, semantic similarity, and vague natural-language queries.

### Dense Retrieval

Dense retrieval represents queries and documents as embedding vectors. Similar meaning should map to nearby vectors, even when the exact words differ. This is useful for semantic search.

Important concepts:

- A document chunk is embedded into a dense vector.
- A user query is embedded using the same or compatible embedding model.
- The retriever finds nearby vectors using a similarity metric such as cosine similarity, dot product, or Euclidean distance.
- The top-k nearest chunks are passed to the generation model.

It' useful when you don't know exact words in a document. It can retrieve semantically related content e.g. matching "refund policy" with "returns and reimbursements," even if the terms do not exactly overlap.

Tradeoffs:

- **Pros**: strong semantic matching, good for paraphrases, useful for natural-language questions.
- **Cons**: less interpretable, can miss exact identifiers, depends on embedding quality, and vector search infrastructure can be more complex.

### Vector Search and ANN

The brute-force nearest-neighbor approach compares the query vector with every vector in the database, then returns the most similar results. This is simple but too slow for large corpora.

Approximate nearest neighbor search, or ANN, speeds this up by searching an index that returns very close candidates without checking every vector exactly. The tradeoff is usually recall versus latency and cost.

```text
Exact nearest-neighbor search gives the best recall but does not scale well.
ANN indexes trade a small amount of recall for much lower latency, which is usually
acceptable in production RAG systems if we measure retrieval quality end to end.
```

What to tune:

- Chunk size and overlap.
- Embedding model.
- Similarity metric.
- Top-k retrieval count.
- ANN index parameters.
- Reranking model.
- Filtering by metadata such as tenant, date, permission, language, or document type.

### Hybrid Retrieval

A strong production answer is often hybrid retrieval: combine sparse and dense retrieval, then rerank. Sparse retrieval catches exact matches. Dense retrieval catches semantic matches. A reranker can then score the candidates more carefully.

I would start with hybrid retrieval for high-value knowledge search. BM25 handles exact terms and identifiers, embeddings handle semantic similarity, and a reranker improves precision before the final context is sent to the LLM.
