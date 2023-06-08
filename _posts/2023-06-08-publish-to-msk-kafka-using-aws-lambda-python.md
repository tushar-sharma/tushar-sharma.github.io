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


if __name__=="__main__":
    publish_data()
{% endtemplate %}

