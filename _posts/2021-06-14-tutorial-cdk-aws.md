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

$ test-cdk  

$ cd $_

$ cdk init sample-app --language=javascript

$  cdk synth --version-reporting false > output.yaml

It will emit the cloudformation in yaml format

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

Here we need to focus on following file 

1. lib/test-cdk-stack.js

```javascript
const sns = require('@aws-cdk/aws-sns');
const subs = require('@aws-cdk/aws-sns-subscriptions');
const sqs = require('@aws-cdk/aws-sqs');
const cdk = require('@aws-cdk/core');

class TestCdkStack extends cdk.Stack {
  /**
   * @param {cdk.App} scope
   * @param {string} id
   * @param {cdk.StackProps=} props
   */
  constructor(scope, id, props) {
    super(scope, id, props);

    const queue = new sqs.Queue(this, 'TestCdkQueue', {
      visibilityTimeout: cdk.Duration.seconds(300)
    });

    const topic = new sns.Topic(this, 'TestCdkTopic');

    topic.addSubscription(new subs.SqsSubscription(queue));
  }
}

module.exports = { TestCdkStack }
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
$ npm install "@aws-cdk/cloudformation-include"
```

$ cdk synth --version-reporting false
