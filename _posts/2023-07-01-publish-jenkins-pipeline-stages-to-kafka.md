---
layout: post
title: Publish Jenkins Pipeline's Stages to Kafka topic
tags:
  - groovy
  - jenkins
  - kafka
image: /img/girl-question.jpeg
thumb: /img/girl-question.jpeg
author: Tushar Sharma
category: blog
---

Strings are immutable in java. It's best to convert string to StringBuilder/StringBuffer so that it's memory efficient for string manipulation.<!-- truncate_here -->
<p>Tags: {% for tag in page.tags %} <a class="mytag" href="/tag/{{ tag }}" title="View posts tagged with &quot;{{ tag }}&quot;">{{ tag }}</a>  {% if forloop.last != true %} {% endif %} {% endfor %} </p>

Publish Jenkins Pipeline's Stages to Kafka topic


### Pipeline Script


{% template customCode.html %}
---
id: 7bb66bc02307332cd4f7009daa0a1594
file: pipeline.groovy
---
{% endtemplate %}

### Create model class


{% template customCode.html %}
---
id: 7bb66bc02307332cd4f7009daa0a1594
file: KafkaMessage.groovy
---
{% endtemplate %}

Now we can define `Events` class. 

{% template customCode.html %}
---
id: 7bb66bc02307332cd4f7009daa0a1594
file: Events.groovy
---
{% endtemplate %}

### What's NonCPS notation

The `@NonCPS` annotation is specific to Jenkins' implementation of Groovy, and it is used to mark a method as "non-continuable-permanent-space" (NCPS). This means that the method cannot be continued in a later build step, and its state cannot be saved across pipeline restarts.

In Jenkins, pipeline scripts are executed in a "sandbox" environment that restricts certain operations for security reasons. For example, the sandbox does not allow methods that use reflection, file I/O, or network I/O.

The @NonCPS annotation is used to mark methods that perform operations that are not allowed in the sandbox. In this case, the getStage method performs operations that access the raw build data, which is not allowed in the sandbox. By marking the method with @NonCPS, Jenkins allows it to be executed outside the sandbox, which allows it to access the raw build data.

To summarize, the @NonCPS annotation is specific to Jenkins' implementation of Groovy, and it is used to mark methods that perform operations that are not allowed in the sandbox.