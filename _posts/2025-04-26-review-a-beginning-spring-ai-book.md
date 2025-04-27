---
layout: post
title: Review A Beginning Spring AI book
image: https://unsplash.com/photos//download?w=437
thumb: https://unsplash.com/photos//download?w=437
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

- **Temperature**: Controls the randomness of the model's output. A lower value makes the output more focused and deterministic, while a higher value increases creativity and variability. Range from 0.0 to 2.

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


- If we comprae two sets of n-grams with low tempearature and low top_p values, it would be more similar. For higher values, it would have higher variability.

- The `@ParameterizedTest` annotation is used to run the same test logic with different sets of input data.

- Each set of input data is provided by a data source, in this case, the `@MethodSource` annotation.


{% template  customCode.html %}
---
id: bea8036111fbedaff3b8d54812604a11
file: JaccardSimilarityCalculator.java
---
{% endtemplate %}


{% template  customCode.html %}
---
id: bea8036111fbedaff3b8d54812604a11
file: JaccardSimilarityCalculatorTest.java
---
{% endtemplate %}

## Conversations and Roles

Prompt object accepts a string and a ChatOptions objet (optional) and returns a text. 


### Type of messages in LLM

- **User**: User query is setnt form user role

- **Assistant**: Role assisgned to messages from the LLM

- **System**: It's has persistent impact over the entire conversation. It's an edict for the LLM to factor in

Lets create a service 

```java
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.chat.messages.Message;
import org.springframework.ai.chat.model.Generation;
import org.springframework.ai.chat.prompt.Prompt;
import org.springframework.ai.openai.OpenAiChatOptions;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ConversationChatService extends OptionChatService
{
    ConversationChatService(ChatClient.Builder builder) {
        super(builder);
    }

    public List<Generation> converse(List<Message> messages) {
        return converse(messages, new OpenAiChatOptions().builder().build());
    }

    public List<Generation> converse(
            List<Message> messages,
            OpenAiChatOptions options) {
        var prompt = new Prompt(messages, options);

        return chatClient.prompt(prompt).call().chatResponse().getResults();
    }
}

```

Unit test : 

```
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.text.WordUtils;
import org.junit.jupiter.api.Order;
import org.junit.jupiter.api.Test;
import org.springframework.ai.chat.messages.AssistantMessage;
import org.springframework.ai.chat.messages.Message;
import org.springframework.ai.chat.messages.UserMessage;
import org.springframework.ai.chat.model.Generation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.ArrayList;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertTrue;

@SpringBootTest
@Slf4j
public class ConversationChatServiceTest {
    @Autowired
    private ConversationChatService conversationChatService;

    /*
    extract `assistantMessage` from the generated LLM output
     */
    private AssistantMessage getAssistantMessage(List<Generation> output) {
        return output.get(0).getOutput();
    }

    private void display(String content) {
        var lines = WordUtils
                .wrap(content, 62, "\n", true)
                .split("\\n");

        for (String line : lines) {
            log.info(line);
        }
    }

    @Test
    @Order(1)
    void simpleConversation() {
        // List.of creates an immutable list
        var conversation = conversationChatService
                .converse(List.of(new UserMessage("what's the slope of y=x*1.2/z if z=2?")));

        var output = getAssistantMessage(conversation);
        display(output.getText());
        assertTrue(output.getText().contains("0.6"));
    }

    @Test
    @Order(2)
    void interactiveConversation() {
        // we want to make a mutable list, because we're adding context
        List<Message> messages = new ArrayList<>();

        messages.add(new UserMessage("what's the slope of y=x*1.2/z if z=2?"));

        var conversations = conversationChatService
                .converse(messages);

        var output = getAssistantMessage(conversations);

        display(output.getText());

        assertTrue(output.getText().contains("0.6"));

        // we want to establish the context of the first asnwer
        messages.add(output);

        messages.add(
                new UserMessage("And if z=3?"));

        conversations = conversationChatService
                .converse(messages);

        output = getAssistantMessage(conversations);
        display(output.getText());

        assertTrue(output.getText().contains("0.4"));

    }

}
```