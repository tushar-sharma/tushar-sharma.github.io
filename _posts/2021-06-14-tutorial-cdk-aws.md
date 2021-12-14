---
layout: post
title: Gettting Started with AWS CDK 
category: blog
tags:
- aws
- cdk
- cloudformation
- typescript
- tutorial
name: aws-cdk
thumb: https://docs.aws.amazon.com/step-functions/latest/dg/images/tutorial-getting-started-visual-pane-render.png
---

Cloudformation service in AWS allows you to describe an entire set of resources required to make a pipeline. The cloudformation template can be described in JSON or YAML format. Updating the cloudformation template was not a pleasant experience. I wanted to discover alternative ways to generate cloudformation template programmatically.<!-- truncate_here -->
<p>Tags: {% for tag in page.tags %} <a class="mytag" href="/tag/{{ tag }}" title="View posts tagged with &quot;{{ tag }}&quot;">{{ tag }}</a>  {% if forloop.last != true %} {% endif %} {% endfor %} </p>

<p>Cloudformation service in AWS allows you to describe an entire set of resources required to make a pipeline. The cloudformation template can be described in JSON or YAML format. Updating the cloudformation template was not a pleasant experience. I wanted to discover alternative ways to generate cloudformation template programmatically.</p>

The CDK library provides you a way to declare the resources in your favorite languages like Java, Javascript, Typescript, and Python. In this tutorial, we will use typescript to generate our cloudformation template.

## Installation

First, install the AWS CDK CLI from command line using

```bash
$ npm i -g aws-cdk@latest
```

Let's create a project

```bash
$ mkdir test-cdk  
$ cd test-cdk
$ cdk init sample-app --language=typescript
```

Then you can verify it  

```bash
$ cdk doctor
_ CDK Version: 1.108.1 (build ae24d8a)
_ AWS environment variables:
  - AWS_STS_REGIONAL_ENDPOINTS = regional
  - AWS_NODEJS_CONNECTION_REUSE_ENABLED = 1
  - AWS_SDK_LOAD_CONFIG = 1
_ No CDK environment variables
```

We will edit the `lib/test-cdk-stack.ts` file from scratch. First we will add Parameters to our cdk class.

<script src="https://gist.github.com/tushar-sharma/8d66c6e91a4de56b4a9f9385465b5958.js"></script>

We can see the output of the cloudformation template by using the following command

```bash
$ cdk synth  > cfn-template.yaml
```

If you want to generate cloudformation template without metadata

```bash
$ cdk synth --version-reporting false --path-metadata false > cfn-template.yaml 
```

The output of the `cfn-template.yaml` is 

```yaml
Parameters:
  Application:
    Type: String
    Default: CDK Tutorial
  Environment:
    Type: String
    Default: development
    AllowedValues:
      - development
      - production
```


## Stepfunction

The cloudformation template needs at least one resource to validate. We will add a `stepfunction` to our cloudformation. We will define our stepfunction inside a json file, `helloworld.asl.json`

```json
{
  "Comment" : "A very very simple StepFunction",
  "StartAt": "Hello", 
  "States": {
    "Hello": {
      "Type": "Wait",
      "Seconds": 10,
      "Next": "World"
    },
    "World": {
      "Type": "Pass",
      "End": true
    }
  }
}
```


If you are not familiar with Stepfunction, AWS Stepfunction console has a nice visualization

<center>
<img src="https://docs.aws.amazon.com/step-functions/latest/dg/images/tutorial-getting-started-visual-pane-render.png" alt="stepfunction image">
</center><br>

Next we need to upload the `helloworld.asl.json` to s3 bucket. We also need to define a mapping to access this `json` file.

<script src="https://gist.github.com/tushar-sharma/f7d3ff867b2a9b10c15744ba186fa7c8.js"></script>


```bash
$ cdk synth --version-reporting false --path-metadata false  > cfn-template.yaml 
```


```yaml
Parameters:
  Application:
    Type: String
    Default: CDK Tutorial
  Environment:
    Type: String
    Default: development
    AllowedValues:
      - development
      - production
Mappings:
  MyMapping:
    development:
      S3Bucket: development-s3-bucket
      S3Key: development-s3-prefix
    production:
      S3Bucket: production-s3-bucket
      S3Key: production-s3-prefix
```

Lastly, we will add stepfunction to our resources

```bash
$ npm i "@aws-cdk/aws-stepfunctions"
```

<script src="https://gist.github.com/tushar-sharma/4bb0490ee424b2866c55bafca8b7fc76.js"></script>


The final cloudformation template is


```yaml
Parameters:
  Application:
    Type: String
    Default: CDK Tutorial
  Environment:
    Type: String
    Default: development
    AllowedValues:
      - development
      - production
  StepFunctionRole:
    Type: String
    Default: put-your-stepfunction-execution-role
Mappings:
  MyMapping:
    development:
      S3Bucket: development-s3-bucket
      S3Key: development-s3-prefix
    production:
      S3Bucket: production-s3-bucket
      S3Key: production-s3-prefix
Resources:
  DemoStepFunction:
    Type: AWS::StepFunctions::StateMachine
    Properties:
      RoleArn:
        Fn::Join:
          - ""
          - - "arn:aws:iam::"
            - Ref: AWS::AccountId
            - :role/
            - Ref: StepFunctionRole
      DefinitionS3Location:
        Bucket:
          Fn::FindInMap:
            - MyMapping
            - development
            - S3Bucket
        Key:
          Fn::FindInMap:
            - MyMapping
            - development
            - S3Key
      StateMachineType: STANDARD
      Tags:
        - Key: environment
          Value: development
    Metadata:
      aws:cdk:path: TestCdkStack/DemoStepFunction

```

Lastly, you can either upload the `cfn-template.yaml` yaml file using AWS console or simply deploy it using

```bash
$ cdk deploy
```
