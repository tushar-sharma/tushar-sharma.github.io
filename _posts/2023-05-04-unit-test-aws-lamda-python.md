---
layout: post
title: Unit Test AWS Lambda Function in Python
category: blog
tags:
  - aws
  - python
thumb: https://threewill.com/wp-content/uploads/female-programmer.jpg
image: https://threewill.com/wp-content/uploads/female-programmer.jpg
author: Tushar Sharma
published: true
python: true
prismjs: true
---
AWS lambda function are event driven serverless code. To follow TDD, we should write unit test our lambda functions.<!-- truncate_here -->
<p>Tags: {% for tag in page.tags %} <a class="mytag" href="/tag/{{ tag }}" title="View posts tagged with &quot;{{ tag }}&quot;">{{ tag }}</a>  {% if forloop.last != true %} {% endif %} {% endfor %} </p>

Project Structure 

```bash
MyLambda/
├── __init__.py
├── lambda_function.py
└── test
    ├── __init__.py
    └── test_my_lambda_test_lambda_function.py

```

> `__init__.py` are empty files that mark the directories as python package so that they can be imported.

We will create a simple `lambda_function.py` that simply returns id as response.

{% template customPython.html %}
import json

def lambda_handler(event, context):

    id = event['id']

    return {
        'statusCode': 200,
        'body': {
            'id': id
        }
    }
{% endtemplate %}


We have a test corresponding to the test file `MyLambda/test/test_lambda_function.py`:

{% template customPython.html %}
import pytest

from MyLambda.lambda_function import lambda_handler

def test_lambda_handler():

    event = {
        'id': 5
    }

    result = lambda_handler(event, context={})

    assert result['statusCode'] == 200

    assert result['body']['id'] == 5
{% endtemplate %}

We will use `pytest` to run our test:

```bash
$ pytest -v -s --cov=.
```


```bash
MyLambda/test/test_my_lambda_test_lambda_function.py::test_lambda_handler PASSED

--------- coverage: platform darwin, python 3.10.10-final-0 ----------
Name                                                   Stmts   Miss  Cover
--------------------------------------------------------------------------
MyLambda/__init__.py                                       0      0   100%
MyLambda/lambda_function.py                                4      0   100%
MyLambda/test/__init__.py                                  0      0   100%
MyLambda/test/test_my_lambda_test_lambda_function.py       7      0   100%
--------------------------------------------------------------------------
TOTAL                                                     11      0   100%

```

### Using patch

As our lambda function gets complex, we must explore additional functionality to test our lambda function. We can use `patch` to mock resources like environment variables, etc

{% template customPython.html %}
import json
import os


def lambda_handler(event, context):

    id = event['id']
    name = os.environ['name']
 our
    return {
        'statusCode': 200,
        'body': {
            'id': id,
            'name': name
        }
    }
{% endtemplate %}

Our updated `test` becomes

{% template customPython.html %}
import pytest
import os
from unittest.mock import patch
from MyLambda.lambda_function import lambda_handler

def test_lambda_handler():

    event = {
        'id': 5
    }

    with patch.dict(os.environ, {
        'name': 'FAKE_NAME'
    }):

        result = lambda_handler(event, context={})

    assert result['statusCode'] == 200

    assert result['body']['id'] == 5

    assert result['body']['name'] == 'FAKE_NAME'
{% endtemplate %}

### Pytest fixtures

A fixture is a function that returns a test resource to supply a mock `context` object to our lambda function. Let's rewrite our test function 

{% template customPython.html %}
import pytest
import os
from unittest.mock import patch
from MyLambda.lambda_function import lambda_handler

@pytest.fixture
def event():
    return {
        'id': 5
    }


def test_lambda_handler(event):

    with patch.dict(os.environ, {
        'name': 'FAKE_NAME'
    }):

        result = lambda_handler(event, context={})

    assert result['statusCode'] == 200

    assert result['body']['id'] == 5

    assert result['body']['name'] == 'FAKE_NAME'
{% endtemplate %}


In our example, we define a `event` fixture that return dictionary. We then pass this fixture as an argument to our test function.
