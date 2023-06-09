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

{% template  customCode.html %}
---
id: 1dd4fbf8a8eead83a9535e2ae10c6ecd
file: ex1.py
---
{% endtemplate %}


We have a test corresponding to the test file `MyLambda/test/test_lambda_function.py`:

{% template  customCode.html %}
---
id: 1dd4fbf8a8eead83a9535e2ae10c6ecd
file: ex2.py
---
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

{% template  customCode.html %}
---
id: 1dd4fbf8a8eead83a9535e2ae10c6ecd
file: ex3.py
---
{% endtemplate %}

Our updated `test` becomes

{% template  customCode.html %}
---
id: 1dd4fbf8a8eead83a9535e2ae10c6ecd
file: ex4.py
---
{% endtemplate %}

### Pytest fixtures

A fixture is a function that returns a test resource to supply a mock `context` object to our lambda function. Let's rewrite our test function 

{% template  customCode.html %}
---
id: 1dd4fbf8a8eead83a9535e2ae10c6ecd
file: ex5.py
---
{% endtemplate %}

In our example, we define a `event` fixture that return dictionary. We then pass this fixture as an argument to our test function.
