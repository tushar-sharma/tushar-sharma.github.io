---
layout: post
date: 2023-06-08
title: Publish to MSK Kafka using AWS Lambda Python
image: https://damion.club/uploads/posts/2022-02/1646069008_33-damion-club-p-chelovek-za-kompyuterom-art-art-36.jpg
thumb: https://damion.club/uploads/posts/2022-02/1646069008_33-damion-club-p-chelovek-za-kompyuterom-art-art-36.jpg
prismjs: true
prismBash: true
python: true
---

.<!-- truncate_here -->
<p>Tags: {% for tag in page.tags %} <a class="mytag" href="/tag/{{ tag }}" title="View posts tagged with &quot;{{ tag }}&quot;">{{ tag }}</a>  {% if forloop.last != true %} {% endif %} {% endfor %} </p>


### Dependencies

{% template customCode.html %}
---
title: language-bash
---
$ python3 -m venv myenv
$ . myenv/bin/activate
$ pip install confluent-kafka===1.9.2
{% endtemplate %}


### Kafka Producer


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
