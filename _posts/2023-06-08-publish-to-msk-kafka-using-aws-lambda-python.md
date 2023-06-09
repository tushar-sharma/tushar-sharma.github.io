---
layout: post
date: 2023-06-08
title: Publish to MSK Kafka using AWS Lambda Python
image: https://damion.club/uploads/posts/2022-02/1646069008_33-damion-club-p-chelovek-za-kompyuterom-art-art-36.jpg
thumb: https://damion.club/uploads/posts/2022-02/1646069008_33-damion-club-p-chelovek-za-kompyuterom-art-art-36.jpg
prismjs: true
prismBash: true
python: true
tags:
- kafka
- aws
- python
---

Apache Kafka is a distributed streaming platform designed to handle real-time data streams efficiently. It uses a publish-subscribe model, where producers publish messages to topics, and consumers subscribe to those topics to receive the messages. Amazon MSK simplifies the deployment and management of Kafka clusters on AWS, providing a fully managed and scalable solution. You can use AWS lambda in python to publish to MSK topic.<!-- truncate_here -->
<p>Tags: {% for tag in page.tags %} <a class="mytag" href="/tag/{{ tag }}" title="View posts tagged with &quot;{{ tag }}&quot;">{{ tag }}</a>  {% if forloop.last != true %} {% endif %} {% endfor %} </p>

Apache Kafka is a distributed streaming platform designed to handle real-time data streams efficiently. It uses a publish-subscribe model, where producers publish messages to topics, and consumers subscribe to those topics to receive the messages. Amazon MSK simplifies the deployment and management of Kafka clusters on AWS, providing a fully managed and scalable solution. You can use AWS lambda in python to publish to MSK topic.

### Dependencies

First we need to build a `lambda layer` which will install dependencies for the lambda function:

{% template customCode.html %}
---
title: language-bash
---
$ mkdir -p kakfaLibrary && cd $_
$ python3 -m venv myenv
$ . myenv/bin/activate
$ echo "confluent-kafka===1.9.2" > requirements.txt
$ pip install \
  --target=python/lib/python3.8/site-packages \
  --implementation cp \
  --python 3.8 \
  --only-binary=:all --upgrade \
  -r requirements.txt
$ zip -r kakfaLibrary.zip python
$ deactivate
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

{% template customCode.html %}
---
title: language-python
---
import json
import confluent_kafka
import os

def delivery_callback(err, msg):
    """
    Callback method
    """
    if err:
        print("Unable to publish to topic:", err)
    else:
        print("Successfully published to topic")


def kafka_producer():
    """
    Publish Data
    """
    kafka_topic = os.environ["kafka_topic"]
    conf = {
        "bootstrap.servers": os.environ["brokers"],
        "socket.timeout.ms": 10000,
        "security.protocol": "SASL_SSL",
        "sasl.mechanisms": "SCRAM-SHA-512",
        "sasl.username": os.environ["username"],
        "sasl.password": os.environ["password"],
        "broker.version.fallback": "0.9.0",
        "api.version.request": True,
        "batch.num.messages": 100,
    }
    producer = confluent_kafka.Producer(**conf)
    payload = {
        "message": "This is payload"
    }
    producer.produce(f"{kafka_topic}", json.dumps(payload, default=str), callback=delivery_callback)
    producer.flush()

def lambda_handler(event, context):
    kafka_producer()
    return {
        'statusCode': 200,
        'body': json.dumps('Hello from Lambda!')
    }

{% endtemplate %}

### Kafka Consumer

Similarly, we can write a `consumer` to subscribe to the topic: 


{% template customCode.html %}
---
title: language-python
---
import json
import confluent_kafka
import os

def kafka_consumer():
    kafka_topic= os.environ["kafka_topic"]
    conf = {
        "bootstrap.servers": os.environ["brokers"],
        "socket.timeout.ms": 10000,
        "security.protocol": "SASL_SSL",
        "sasl.mechanisms": "SCRAM-SHA-512",
        "sasl.username": os.environ["username"],
        "sasl.password": os.environ["password"],
        "broker.version.fallback": "0.9.0",
        "api.version.request": True,
        "group.id": os.environ["groupid"],
    }
    consumer = confluent_kafka.Consumer(**conf)
    consumer.subscribe([kafka_topic])
    while True:
        message = consumer.poll(timeout=1.0)
        if message is None:
            continue
        if message.error():
            raise confluent_kafka.KafkaException(message.error())
        else:
            print(message.value())

def lambda_handler(event, context):
    kafka_consumer()
    return {
        'statusCode': 200,
        'body': json.dumps('Hello from Lambda!')
    }
{% endtemplate %}
