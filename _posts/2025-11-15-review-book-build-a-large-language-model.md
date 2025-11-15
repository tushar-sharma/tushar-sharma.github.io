---
layout: post
title: Review Book - Build a large language model
thumb: https://unsplash.com/photos/w6ohHcjE5TE/download?w=437
image: https://unsplash.com/photos/w6ohHcjE5TE/download?w=437
author: tushar sharma
category: blog
tags:
 - books
---

Below are my rough notes while reading the [build-a-large-language-model-book]({{ root_url }}/books/).<!-- truncate_here -->

Below are my rough notes while reading the [build-a-large-language-model-book]({{ root_url }}/books/).<br>

LLM are deep neural networks trained on massive amount of text data. The "large" in **LLM** refers to both the models's size in terms of parameters and immense dataset on which it's trained.

LLM utilize an architecture called the **transformer**, which allows them to pay selective attention to different parts of the input when making predictions. Since LLM are capable pof generating text, LLM are also called generative AI. Transfer architecture was first introducted in 2017 paper called **Attention is All You Need**.

There are other variation of **transformer** architecture like **BERT**.

General process of creating LLM includes **pretraining** and **fine-tuning**. "pre" in **pretraining** refers to inital phase where a model like a LLM is trained on a large, diverse dataset (raw text). This pretrained model then serves as a foundation resource that can be further refined through **fine-tuning**, a process where model is specifically trained on a narrow dataset for a specific task. 

**Fine-tuning** has two categories

1. **instruction fine tuning**:  labelled dataset consist of instruction and answer pairs.

2. **classification fine tuning**: labelled dataset consist of texts and associated class label.

GPT stands for generative pretrained transformer. **GPT** models are adept at : 

1. **Zero shot learning**: Generalize a completely unseen task

2. **Few shot learning**: Learning from minimal number of examples which the user provides
