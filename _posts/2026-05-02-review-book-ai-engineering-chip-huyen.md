---
layout: post
title: AI Engineering - Building Applications with Foundation Models by Chip Huyen
image: https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=1000
thumb: https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=200
author: tushar sharma
category: blog
tags: books ai llm
published: false
---

These are my learning notes and reflections while reading "AI Engineering: Building Applications with Foundation Models" by Chip Huyen. I plan to update this periodically as I progress through the book.<!-- truncate_here -->

<link rel="stylesheet" href="{{ root_url }}/css/books.css" />

<!-- disclaimer -->
<div style="margin: 0 auto" class="cl disclaimer">
<span style="color:black"> &nbsp;&nbsp;These are my rough notes while reading this book
</span> 
</div> <br>

## Overview
This book focuses on the engineering aspects of building applications using foundation models (LLMs). It covers the full lifecycle from understanding models to deployment and monitoring.

---

## Chapter 1: Introduction to Building AI Applications with Foundation Models

Previously , software as a service as popular e.g. SAAS cloudfare, Okta, etc. Now we have, model as a service. So Gemini, Anthropic, ChatGPT, etc develop models which are used by others. 

**Language models** of 1950s are precursor to the **large language model**.  **Language models** predict how likely a word is to appear in a given context. e.g. my fav color is _ . "blue" is more likely to be correct answer than car.

The basic unit of a language model is called **token**. A token can be a character, a word, or a part of a word, etc. The process of breaking a text into tokens is called **tokenization**. A set of all tokens a model can work with is the model's vocabulary.  ? I still dont undnerstand what's vocabulary. Does it means how much tokens can a model work with ? Chatp-4's vocabular isze is 100,256 and Mixtral 8x7b has vocualbar of 32,000 . what does it mean ? 


Two types of langauge models:

1. Masked langauge model 
2. autoregresive lanauge model 

1. Masked language model: trained to predict missing token anywhere in the sequence , using hte context from before or after the missing token. e.g. bidirectional encoder representaions from transformers or BERT

2. Augoregressive lanauge model: predict next token in a sequence, using only the preciding token. they predict wwhat comes next ? but how is it differnt than masked lanague model? 

mermaid diagram

> Augtoregrresiv lM | What does the chicken corss the | -> context previous token only -> prediciton

> mask lm : why does the [predictiopn [corss the road] > =thsi has context (surroinding tokens)

modles can genrate. open endied outputs that' why it's called genrative. it generates infimit psosible outputs. 



The completiions are pridcitons, based on probalbitys , not guarted to be correct. 

what's self supervision?  language models can be trained using self supervision. unlike other like weather forecasting model are trained using supervisions. supermission refersn to trainign ML algorithming using labeled data. which can be expensive nad slow to obtain. Self userpverison helps overthis this data labelling bottleneck. the model can infer label from input data. each inptu sequence : both laables (token to be precited  an the context the model use to rpedccit these labloes. .)

Model size is measured by it snumber of. parametes. A parmaters is avaibale within a ML modle that is update thorugh the traingin process. 

Chatgpt = genrative pretrained transform model. 

foiundation model ? A model that can dela with more than one data modealitys is called a multimodal model. what' si modal? A generative mulit modal model is also called large lanague model.  You can also fine tunee a model to make it on datasets if you want. 

Using a database to suppment the isnturmction sis called retrivel augmental generation (RAG). 

## References & Further Reading
- [Chip Huyen's Blog](https://huyenchip.com/blog)
- [Official Book Website](https://www.oreilly.com/library/view/ai-engineering/9781098166298/)
