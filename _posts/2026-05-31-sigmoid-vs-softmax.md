---
layout: post
title: "Sigmoid vs Softmax"
tags: [ml, python]
image: 'https://unsplash.com/photos/HqbsmJpWt34/download?w=437'
thumb: 'https://unsplash.com/photos/HqbsmJpWt34/download?w=437'
---

Sigmoid and softmax are both functions that turn model scores into values that are easier to interpret, but they solve different kinds of classification problems.<!-- truncate_here -->Sigmoid and softmax are both functions that turn model scores into values that are easier to interpret, but they solve different kinds of classification problems.

## Rule of thumb

**Sigmoid** = independent yes/no decisions.  
**Softmax** = choose one class out of many.

## Quick answer

- Use **sigmoid** for **binary classification** or **multi-label classification**.
- Use **softmax** for **multi-class classification** where the classes are **mutually exclusive**.

## Intuition

- **Sigmoid** takes **one score** and squashes it to a value between **0 and 1**.
- **Softmax** takes a **vector of scores** and converts it into probabilities that **sum to 1**.
- With **sigmoid**, each output is treated **independently**.
- With **softmax**, outputs are **competing with each other**.

## Formulas

### Sigmoid

```text
σ(x) = 1 / (1 + e^(-x))
```

### Softmax

```text
softmax(z_i) = e^(z_i) / Σ_j e^(z_j)
```

## Key differences

| Aspect | Sigmoid | Softmax |
|---|---|---|
| Input | One score | A vector of scores |
| Output | One value in `(0, 1)` | A probability distribution |
| Sum to 1? | No | Yes |
| Relationship between outputs | Independent | Dependent and competing |
| Best for | Binary or multi-label classification | Multi-class single-label classification |
| Example question | "Is this email spam?" | "Is this image a cat, dog, or horse?" |

## Tiny example

Suppose a model produces these raw scores:

```text
[2.0, 1.0, 0.1]
```

If you apply **sigmoid** to each score independently, you get:

```text
[0.881, 0.731, 0.525]
```

These values do **not** sum to 1, because each class is evaluated separately.

If you apply **softmax**, you get:

```text
[0.659, 0.242, 0.099]
```

These values **do** sum to 1, so they can be interpreted as a probability distribution across classes.

### Why this matters

If one softmax score goes up, the others must go down.  
With sigmoid, multiple outputs can be high at the same time.

## When to use which

### Use sigmoid when

- There are only **two classes**.
- Or you have a **multi-label** problem, where more than one label can be true at once.
- Example: a photo can contain **dog**, **car**, and **tree** at the same time.

### Use softmax when

- You must pick **exactly one class** from many.
- Example: classifying a digit as **0 to 9**.

## Interview-ready answers

- **Sigmoid is for independent outputs; softmax is for mutually exclusive outputs.**
- **Sigmoid can be used for multi-label problems; softmax is used for multi-class single-label problems.**
- **Softmax normalizes across classes, while sigmoid treats each class separately.**
- **Sigmoid is commonly paired with binary cross-entropy; softmax with categorical cross-entropy.**

## Common mistakes

- Using **softmax** for a **multi-label** problem.
- Expecting sigmoid outputs across classes to sum to 1.
- Forgetting that softmax depends on the **relative size** of all scores, not just one score by itself.

## Simple Python

```python
import math


def sigmoid(x: float) -> float:
    return 1 / (1 + math.exp(-x))


def softmax(scores: list[float]) -> list[float]:
    max_score = max(scores)
    exp_scores = [math.exp(score - max_score) for score in scores]
    total = sum(exp_scores)
    return [score / total for score in exp_scores]
```

## One-line memory trick

- **Sigmoid**: "Can each label be true?"
- **Softmax**: "Which one label is most likely?"
