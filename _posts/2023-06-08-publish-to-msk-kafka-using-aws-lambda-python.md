---
layout: post
date: 2023-06-08
title: Publish to MSK Kafka using AWS Lambda Python
image: https://unsplash.com/photos/0Fws0jyIt9s/download?w=437
thumb: https://unsplash.com/photos/0Fws0jyIt9s/download?w=437
tags:
- kafka
- aws
- python
mutipleTab: true
category: blog
---

Apache Kafka is a distributed streaming platform designed to handle real-time data streams efficiently. It uses a publish-subscribe model, where producers publish messages to topics, and consumers subscribe to those topics to receive the messages. Amazon MSK simplifies the deployment and management of Kafka clusters on AWS, providing a fully managed and scalable solution. You can use AWS lambda in python to publish to MSK topic.<!-- truncate_here -->

Apache Kafka is a distributed streaming platform designed to handle real-time data streams efficiently. It uses a publish-subscribe model, where producers publish messages to topics, and consumers subscribe to those topics to receive the messages. Amazon MSK simplifies the deployment and management of Kafka clusters on AWS, providing a fully managed and scalable solution. You can use AWS lambda in python to publish to MSK topic.

### Dependencies

First we need to build a `lambda layer` which will install dependencies for the lambda function:

{% template  customTab.html %}
---
id: 056166b6da844fcbe20271310e890ec0
files:
  - file: layer.sh
    language: Bash
---
{% endtemplate %}

Open the AWS Management Console and navigate to the AWS Lambda service.

Create a new layer: Click on "Layers" in the left navigation menu and then click the "Create layer" button.

Configure the layer: Provide a name for your layer, and optionally, a description and compatible runtimes. Select the appropriate runtime based on the code files included in your layer.

Upload the zip file: In the "Code entry type" section, select "Upload a file from Amazon S3" or "Upload a file from your computer", depending on where your zip file is located. If it's on your local machine, choose the latter option. Then, click the "Upload" button and select your zip file.

Create the layer: Once the zip file is uploaded, click the "Create" button to create the Lambda layer.

Add the layer to your Lambda function: After the layer is created, you can add it to your Lambda function. Open the function's configuration, scroll down to the "Layers" section, and click on "Add a layer". Select the layer you created from the list and click "Add".


### Kafka Producer

We will write a `producer` to publish to MSK topic. Environment variables passed are: 

1. **kafka_topic**. Producers write data to a specific topic, and consumers read from one or more topics.

2. **Kafka broker**. Brokers receive messages from producers and serve them to consumers. Multiple brokers form a Kafka cluster, and they collaborate to provide fault tolerance, scalability, and high throughput.

3. **sasl username**. SASL (Simple Authentication and Security Layer) is a framework used for authentication and data security in distributed systems. 

4. **sasl password**. Secret credential associated with a SASL username. 

{% template  customTab.html %}
---
id: 056166b6da844fcbe20271310e890ec0
files:
  - file: kafka_producer.py
    language: Python
---
{% endtemplate %}

### Kafka Consumer

Similarly, we can write a `consumer` to subscribe to the topic: 

{% template  customTab.html %}
---
id: 056166b6da844fcbe20271310e890ec0
files:
  - file: kafka_consumer.py
    language: Python
---
{% endtemplate %}
