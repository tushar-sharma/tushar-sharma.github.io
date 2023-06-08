---
layout: post
date: 2023-06-08
title: Publish to MSK Kafka using AWS Lambda Python
image: https://damion.club/uploads/posts/2022-02/1646069008_33-damion-club-p-chelovek-za-kompyuterom-art-art-36.jpg
thumb: https://damion.club/uploads/posts/2022-02/1646069008_33-damion-club-p-chelovek-za-kompyuterom-art-art-36.jpg
prismjs: true
prismBash: true
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
    if err:
        print(f"Unable to publish to topic:")
    else:
        print(f"Successfully publish to topic")

def publish_data():
    kafka_topic="devx-events-nprd"

    payload = {
        'message': '${status}'
    }

    conf = {
        "bootstrap.servers": "234",
        "socket.timeout.ms": 10000,
        "security.protocol": "SASL_SSL",
        "sasl.mechanisms": "SCRAM-SHA-512",
        "sasl.username": "23",
        "sasl.password": "sdf",
        "broker.version.fallback": "0.9.0",
        "api.version.request": True,
        "batch.num.messages": 100,
    }
    
    producer = confluent_kafka.Producer(**conf)
    
    producer.produce(f"{kafka_topic}", json.dumps(payload, default=str), callback=delivery_callback)
    producer.flush()

if __name__=="__main__":
    publish_data()
{% endtemplate %}