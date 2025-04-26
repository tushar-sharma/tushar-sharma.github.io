---
layout: post
title: 
image: https://unsplash.com/photos//download?w=437
thumb: https://unsplash.com/photos//download?w=437
author: tushar sharma
category: blog
---

Below are my rough notes while reading the [A Beginning Spring AI]({{ root_url }}/books/).<!-- truncate_here -->

Below are my rough notes while reading the [A Beginning Spring AI]({{ root_url }}/books/).<br>


- A model accepts a request and gives back a response

- Chat models use text

- chat models have blocking version and a streaming version

- ChatClient uses Prompt to interact with larguage model

Some properties

```
spring.ai.openai.api-key : api key to be used by application
spring.ai.openai.chat.options.temperature : determines variability of the responses. High temperature means model generate more diverse answers.  low temperature means the answers are more deterministic.
spring.ai.openai.chat.options.model = name of the model to use
```

## Different types of roles in LLM

In the context of LLMs, roles help define the interactions and boundaries within a conversation. Here are the primary roles:

- **System role**: This role provides setup and operational guidelines for the assistant. It ensures the model adheres to specific behaviors or constrain. e.g:

```
System: The assistant should always maintain a professional tone and avoid discussing personal opinions on politics.
```

- **User Role**: This role represents input or queries from the user. It guides the conversation by posing questions or requests to the assistant. e.g.

```
User: Can you explain how to integrate OpenAI’s API with my existing Python application?
```

- ** Assistant Role**: This is the role of the model itself. The assistant responds to user inputs, taking into account the context and constraints provided by the system role. e.g.

```
Assistant: Certainly! To integrate OpenAI’s API with your Python application, you can start by installing the OpenAI Python client library using pip...
```

## What's principle of Least priviledge

The Principle of Least Privilege (PoLP) is a security concept advising that individuals or processes should have the minimum level of access necessary to perform their job functions. This minimizes potential security risks by reducing the attack surface.
Example: If a user only needs to read data from a database to perform their job duties, they should not have write or delete permissions.

## First Chat Service

Add following `dependencies` to `build.gradle`: 

```gradle
repositories {
	mavenCentral()
	maven { url 'https://repo.spring.io/milestone' }
	maven { url 'https://repo.spring.io/snapshot' }
}
dependencies {
	implementation platform("org.springframework.ai:spring-ai-bom:1.0.0-SNAPSHOT")
	implementation 'org.springframework.ai:spring-ai-openai-spring-boot-starter:1.0.0-SNAPSHOT'
}
```

Next we need to add following to `application.properteis`

```
spring.ai.openai.api-key=${OPEN_API_KEY}
spring.ai.openai.chat.options.temperature=0.0
spring.ai.openai.chat.options.model=gpt-3.5-turbo
spring.ai.retry.max-attempts=4
```

Lets create a service that sends a `prompt` to the model 

```java
@Service
public class FirstChatService {

    private final ChatClient chatClient;

    public FirstChatService(ChatClient.Builder chatClientBuilder) {
        this.chatClient = chatClientBuilder.build();
    }

    public String query(String query){
        Objects.requireNonNull(query, "Query must not be null");

        var prompt = new Prompt(query);

        var request = chatClient
                .prompt(prompt);

        // make a blocking call
        var response = request.call();

        return response.content();
    }
}
```

Lets write a test to verifiy this 

```java
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.MOCK)
public class Ch02FirstTests {

    @Autowired
    private FirstChatService firstChatService;

    @Test
    void runSimpleQuery() {
        var response = firstChatService.query(
            "What is the capital of France?"
        );

        System.out.println(response);

        assertTrue(response.toLowerCase().contains("paris"));
    }
}
```

## OpenAiChatOptions

Configure parameters for OpenAI chat models dynamically (at runtime). Lets create another service 

```java
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.chat.prompt.Prompt;
import org.springframework.ai.openai.OpenAiChatOptions;
import org.springframework.stereotype.Service;
import java.util.Objects;

@Service
public class OptionChatService extends FirstChatService {

    OptionChatService(ChatClient.Builder builder) {
        super(builder);
    }

    public String query(String query, OpenAiChatOptions options) {
        Objects.requireNonNull(options);
        Objects.requireNonNull(query);

        var prompt = new Prompt(query, options);

        var request = chatClient
                .prompt(prompt);

        var response = request.call();

        return response.content();

    }
}
```

And test our service class 

```java
import lombok.extern.slf4j.Slf4j;
import org.junit.jupiter.api.Test;
import org.springframework.ai.openai.OpenAiChatOptions;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import static org.junit.jupiter.api.Assertions.assertTrue;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.MOCK)
@Slf4j
public class OptionChatServiceTest {

    @Autowired
    OptionChatService optionChatService;

    @Test
    void runSimpleQuery() {
        var response = optionChatService.query(
                "what is the speed of a typical junk carrying tea in November?\n" +
                        "Assume clear weather and standard currents in the south China sea.",
                OpenAiChatOptions.builder()
                        .model("gpt-4o")
                        .build());


        log.info("Response: {}", response);

        assertTrue(response.toLowerCase().contains("south china sea"));
    }
}

```

## Key terms

- **Tempearture**: Controls the randomness of the model's output. A lower value makes the output more focused and deterministic, while a higher value increases creativity and variability. Range from 0.0 to 2.

- **top-p** : Nucleus sampling. Percentage of things to consider. 0.10 means consider most relevant tokens, 1 means don't filter at all. 
- **top-k**: Truncated sampling. Restricts the model to selecting the next word from the top k most probable candidates, reducing the influence of less likely options.

in the code , we can use 

```java
var options = OpenAiChatOptions.builder()
             .withModel("gpt-4o")
             .temperature(1.0)
             .build();
```

## Jaccard Similarity / Index

**Formula**:  
(Number of overlapping items in both sets) / (Total unique items in both sets)

- find similarities between two blocks of text

- extract n-grams from text

- n-grams are sequence of tokens in a specified order

n-gram of length two 

```
are sequences
sequences of
of tokens
```

n-gram of length three

```
n-grams are sequences
are sequences of
sequences of tokens
```

- If we comprae two sets of n-grams with low tempearature and low top_p values, it would be more similar. For higher values, it would have higher variability.

 We create a new Service

 ```java
 import org.springframework.stereotype.Service;
import java.util.HashSet;
import java.util.Set;

@Service
public class JaccardSimilarityCalculator {
    public double calculateJaccardSimilarity(String text1, String text2, int nGramSize) {
        // preprocess the texts
        Set<String> set1 = new HashSet<>(preprocessText(text1, nGramSize));
        Set<String> set2 = new HashSet<>(preprocessText(text2, nGramSize));

        // calculate intersection
        Set<String> intersection = new HashSet<>(set1);
        intersection.retainAll(set2);

        // calculate union
        Set<String> union = new HashSet<>(set1);
        union.addAll(set2);

        return (double) intersection.size() / union.size();
    }

    public Set<String> preprocessText(String text, int nGramSize) {
      String[] tokens = text.toLowerCase().split("\\W+");
      Set<String> nGrams = new HashSet<>();

      for (int i = 0; i <= tokens.length - nGramSize; i++) {
         StringBuilder nGram = new StringBuilder();
         for (int j = 0; j < nGramSize; j++) {
             nGram.append(tokens[i+ j]).append(" ");
         }
         nGrams.add(nGram.toString().trim());
      }

      return nGrams;
    }
}

```

For the unit test

- The @ParameterizedTest annotation is used to run the same test logic with different sets of input data.

- Each set of input data is provided by a data source, in this case, the @MethodSource annotation.

```java
import lombok.extern.slf4j.Slf4j;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.Arguments;
import org.junit.jupiter.params.provider.MethodSource;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import java.util.stream.Stream;
import static org.junit.jupiter.api.Assertions.assertEquals;

@SpringBootTest
@Slf4j
public class JaccardSimilarityCalculatorTest {
    @Autowired
    JaccardSimilarityCalculator jaccardSimilarityCalculator;

    public static Stream<Arguments> texts() {
        return Stream.of(
                Arguments.of(
                        "This is some cool text. More is better but this will do.",
                        "This is some cool text. More is better but this will do.",
                        1),
                Arguments.of(
                        "Now is the time for all good men to come to the aid of their country.",
                        "The quick brown fox jumps over the lazy dog tail",
                        0),
                Arguments.of(
                        "This is some cool text. More is better but this will do.",
                        "This is some cool text. More is better but this might do.",
                        0.8)

                );
    }

    @ParameterizedTest
    @MethodSource("texts")
    public void testTexts(String text1, String text2, double expected) {
        var result = jaccardSimilarityCalculator.calculateJaccardSimilarity(text1, text2, 1);
        log.info("Jaccard similarity between '{}' and '{}' is: {}", text1, text2, result);
        assertEquals(expected, result, 0.1);
    }
}
```