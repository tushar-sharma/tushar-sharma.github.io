---
published: false
---
# Tutorial on AWS CDK

Tags: 
-python
-cdk 
-aws


Install or update the AWS CDK CLI from command line using

$ npm i -g aws-cdk

## Part 1

Let's create a project

```bash
$ test-cdk  

$ cd $_

$ cdk init sample-app --language=javascript

```

Then you can verify it using 
```bash
$ cdk doctor
 CDK Version: 1.108.1 (build ae24d8a)
 AWS environment variables:
  - AWS_NODEJS_CONNECTION_REUSE_ENABLED = 1
  - AWS_SDK_LOAD_CONFIG = 1
  - AWS_STS_REGIONAL_ENDPOINTS = regional
 No CDK environment variables

```

You can generate cloudformation template

```bash

$  cdk synth --version-reporting false > output.yaml

```


```yaml
Resources:
  TestCdkQueueB8639E0A:
    Type: AWS::SQS::Queue
    Properties:
      VisibilityTimeout: 300
    UpdateReplacePolicy: Delete
    DeletionPolicy: Delete
    Metadata:
      aws:cdk:path: TestCdkStack/TestCdkQueue/Resource
  TestCdkQueuePolicyDEED76FA:
    Type: AWS::SQS::QueuePolicy
    Properties:
      PolicyDocument:
        Statement:
          - Action: sqs:SendMessage
            Condition:
              ArnEquals:
                aws:SourceArn:
                  Ref: TestCdkTopicC4135911
            Effect: Allow
            Principal:
              Service: sns.amazonaws.com
            Resource:
              Fn::GetAtt:
                - TestCdkQueueB8639E0A
                - Arn
        Version: "2012-10-17"
      Queues:
        - Ref: TestCdkQueueB8639E0A
    Metadata:
      aws:cdk:path: TestCdkStack/TestCdkQueue/Policy/Resource
  TestCdkQueueTestCdkStackTestCdkTopicA4B3C5120A17CBB7:
    Type: AWS::SNS::Subscription
    Properties:
      Protocol: sqs
      TopicArn:
        Ref: TestCdkTopicC4135911
      Endpoint:
        Fn::GetAtt:
          - TestCdkQueueB8639E0A
          - Arn
    Metadata:
      aws:cdk:path: TestCdkStack/TestCdkQueue/TestCdkStackTestCdkTopicA4B3C512/Resource
  TestCdkTopicC4135911:
    Type: AWS::SNS::Topic
    Metadata:
      aws:cdk:path: TestCdkStack/TestCdkTopic/Resource
```

## Part 2 


We will create an existing cloudformation template and place it at the root of the project folder called `template.yaml`. Then we will import it in cdk

```bash
$ npm install "@aws-cdk/cloudformation-include"
```

We will modify the lib/test-cdk-stack.js as 

```javascript
const sns = require('@aws-cdk/aws-sns');
const subs = require('@aws-cdk/aws-sns-subscriptions');
const sqs = require('@aws-cdk/aws-sqs');
const cdk = require('@aws-cdk/core');
const cfninc = require('@aws-cdk/cloudformation-include');

class TestCdkStack extends cdk.Stack {
  /**
   * @param {cdk.App} scope
   * @param {string} id
   * @param {cdk.StackProps=} props
   */
  constructor(scope, id, props) {
    super(scope, id, props);

    const template = new cfninc.CfnInclude(this, 'Template', { 
        templateFile: 'template.yaml',
    });
    
  }
}

module.exports = { TestCdkStack }
```
Then will will generate the cloudformation again

```bash
$  cdk synth --version-reporting false > output.yaml
```

## Part 3


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
$ 
```

3. Template contains invalid characters



$ cdk synth --version-reporting false
