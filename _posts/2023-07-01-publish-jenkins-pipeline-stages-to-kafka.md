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

Jenkins is a popular automation tool used for continuous integration and continuous delivery (CI/CD) processes. Kafka, on the other hand, is a distributed event streaming platform capable of handling large volumes of real-time data. By combining the power of Jenkins and Kafka, we can effectively publish pipeline information to a Kafka topic.<!-- truncate_here -->

Jenkins is a popular automation tool used for continuous integration and continuous delivery (CI/CD) processes. Kafka, on the other hand, is a distributed event streaming platform capable of handling large volumes of real-time data. By combining the power of Jenkins and Kafka, we can effectively publish pipeline information to a Kafka topic.

Lets say we have a jenkins pipeline. Post success or failure of the pipeline, we want to publish this information to kakfa topic. We would also want to log start and end time of each stages. We want to do this without modifiying our pipeline script.

We can create an `Event` class with `publish` method that will push to kafka.

### Pipeline Script


{% template customCode.html %}
---
id: 7bb66bc02307332cd4f7009daa0a1594
file: pipeline.groovy
---
{% endtemplate %}

### Modeling Pipeline Stages

We'll define a Stage class that contains information about each stage in the pipeline. This class will help us organize and structure the data before sending it to Kafka.

{% template customCode.html %}
---
id: 7bb66bc02307332cd4f7009daa0a1594
file: Stage.groovy
---
{% endtemplate %}

The `Stage` class will provide the necessary structure to capture relevant information about each stage in the pipeline.

### Creating Kafka Messages

In order to publish data to the Kafka topic, we need to define the structure of the messages we will be sending. We'll create a `KafkaMessage` class that represents the JSON format of the data to be published.

{% template customCode.html %}
---
id: 7bb66bc02307332cd4f7009daa0a1594
file: KafkaMessage.groovy
---
{% endtemplate %}

### Implementing the Events Class

Lastly we will define our `Events` class. We will use `PipelineNodeGraphVisitor` to intrinsically get each nodes information. Also we use `kafkacat` utility to publish to kafka topic.

{% template customCode.html %}
---
id: 7bb66bc02307332cd4f7009daa0a1594
file: Events.groovy
---
{% endtemplate %}

### Understanding the NonCPS Notation

The `@NonCPS` annotation is specific to Jenkins' implementation of Groovy, and it is used to mark a method as "non-continuable-permanent-space" (NCPS). This means that the method cannot be continued in a later build step, and its state cannot be saved across pipeline restarts.

In Jenkins, pipeline scripts are executed in a "sandbox" environment that restricts certain operations for security reasons. For example, the sandbox does not allow methods that use reflection, file I/O, or network I/O.

The @NonCPS annotation is used to mark methods that perform operations that are not allowed in the sandbox. In this case, the getStage method performs operations that access the raw build data, which is not allowed in the sandbox. By marking the method with @NonCPS, Jenkins allows it to be executed outside the sandbox, which allows it to access the raw build data.

To summarize, the @NonCPS annotation is specific to Jenkins' implementation of Groovy, and it is used to mark methods that perform operations that are not allowed in the sandbox.