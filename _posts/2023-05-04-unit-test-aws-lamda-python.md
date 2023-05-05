---
published: false
---
## Unit Testing AWS Lambda with Python

```
MyLambda/
├── __init__.py
├── lambda_function.py
└── test
    ├── __init__.py
    └── test_my_lambda_test_lambda_function.py

```
MyLambda code

```


import json


def lambda_handler(event, context):

    id = event['id']

    return {
        'statusCode': 200,
        'body': {
            'id': id
        }
    }
```

Create test first, MyLambda/test/test_lambda_function.py

```

import pytest

from MyLambda.lambda_function import lambda_handler

def test_lambda_handler():

    event = {
        'id': 5
    }

    result = lambda_handler(event, context={})

    assert result['statusCode'] == 200
    assert result['body']['id'] == 5
```

```
$ pytest -v -s --cov=
```


```
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
