---
published: false
---
# Tutorial on AWS CDK

Tags: 
-python
-cdk 
-aws


Install or update the AWS CDK CLI from npm

$ npm i -g aws-cdk

$ hello-cdk  
$ cd $_

$ cdk init sample-app --language=python

node js 

$ cdk init sample-app --language=javascript


then try the following command 

$ cdk synth

It will emit the cloudformation in yaml format

`hello_cdk_stack.py` 

```python
from aws_cdk import (
    core
)

class HelloCdkStack(core.Stack):

    def __init__(self, scope: core.Construct, construct_id: str, **kwargs) -> None:
        super().__init__(scope, construct_id, **kwargs)

        NullResource = core.CfnWaitConditionHandle( 
            self, "NullResource"
        )

```

## Errors 

1. 

```bash
    from aws_cdk import core
ModuleNotFoundError: No module named 'aws_cdk
```

you can do something like
```bash
$ source .env/bin/activate
$ pip install -r requirements.txt
```

2. 

```bash
$ pip install aws-cdk.aws-stepfunctions
$ npm install  "@aws-cdk/aws-stepfunctions"
$ npm install "@aws-cdk/cloudformation_include"
```
