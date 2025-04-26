---
layout: post
title: Review A Beginning Spring AI book
image: https://unsplash.com/photos/Wf4nX6hiDo4/download?w=437
thumb: https://unsplash.com/photos/Wf4nX6hiDo4/download?w=437
author: tushar sharma
category: blog
tags:
  - books
---

Below are my rough notes while reading the [A Beginning Spring AI book]({{ root_url }}/bookshelf/).<!-- truncate_here -->

Below are my rough notes while reading the [A Beginning Spring AI book]({{ root_url }}/bookshelf/).<br>

- A model acceps a request and give back a reponse

- We will use Chat Model that takes input as text and return a text response

## Setup Spring AI

Add following `dependencies` to `build.gradle`: 

{% template  customCode.html %}
---
id: bea8036111fbedaff3b8d54812604a11
file: build.gradle
---
{% endtemplate %}

We need to add following values in `application.properties`

{% template  customCode.html %}
---
id: bea8036111fbedaff3b8d54812604a11
file: application.properties
---
{% endtemplate %}


## Create our first Chat Service

ChatClient can make a `blocking` or `non-blocking` call to the model e.g.


{% template  customCode.html %}
---
id: bea8036111fbedaff3b8d54812604a11
file: ChatService.java
---
{% endtemplate %}


Lets write a unit test for this service: 


{% template  customCode.html %}
---
id: bea8036111fbedaff3b8d54812604a11
file: ChatServiceTest.java
---
{% endtemplate %}


## OpenAiChatOptions

If you want to configure chat model dynamically (i.e. at runtime) like 


{% template  customCode.html %}
---
id: bea8036111fbedaff3b8d54812604a11
file: OptionChatService.java
---
{% endtemplate %}


Also, we can test it like: 

{% template  customCode.html %}
---
id: bea8036111fbedaff3b8d54812604a11
file: OptionChatServiceTest.java
---
{% endtemplate %}

### Parameters

- **Temperatuer**: Controls the randomness of the model's output. A lower value makes the output more focused and deterministic, while a higher value increases creativity and variability. Range from 0.0 to 2.

- **Top_p**: Nucleus sampling. Percentage of things to consider. 0.10 means consider most relevant tokens, 1 means don't filter at all. 

- **Top_k**: Truncated sampling. Restricts the model to selecting the next word from the top k most probable candidates, reducing the influence of less likely options.

We can use `OpenAiChatOptions` to set these parameters for the model like


{% template  customCode.html %}
---
id: bea8036111fbedaff3b8d54812604a11
file: Temperature.java
---
{% endtemplate %}

## Jaccard Index

The Jaccard Index is given by:

$$
J(A, B) = \frac{|A \cap B|}{|A \cup B|}
$$

Where:
- \( |A \cap B| \) is the number of overlapping items in both sets.
- \( |A \cup B| \) is the total number of unique items in both sets.


- it find similarities between two blocks of text

- extract n-grams from text

- n-grams are sequence of tokens in a specified order