---
layout: post
title: Getting Started with AWS CDK 
category: blog
tags:
- aws
- cdk
- cloudformation
- typescript
- python
name: aws-cdk
thumb: https://i.imgur.com/DOFlgaf.jpg
summary: AWS CDK tutorial
author: Tushar Sharma
image : https://i.imgur.com/DOFlgaf.jpg
---

Cloudformation service in AWS allows you to describe an entire set of resources required to make a pipeline. The cloudformation template can be described in JSON or YAML format. Updating the cloudformation template was not a pleasant experience. I wanted to discover alternative ways to generate cloudformation template programmatically.<!-- truncate_here -->
<p>Tags: {% for tag in page.tags %} <a class="mytag" href="/tag/{{ tag }}" title="View posts tagged with &quot;{{ tag }}&quot;">{{ tag }}</a>  {% if forloop.last != true %} {% endif %} {% endfor %} </p>

<link rel="stylesheet" type="text/css" href="{{ root_url }}/css/chat.css">
<link rel="stylesheet" href="{{ root_url }}/css/multipleTab.css"/>
<script src="{{ root_url }}/js/jquery.easytabs.min.js"></script>
<script src="{{ root_url }}/js/multipleTab.js"></script>

<p>Cloudformation service in AWS allows you to describe an entire set of resources required to make a pipeline. The cloudformation template can be described in JSON or YAML format. Updating the cloudformation template was not a pleasant experience. I wanted to discover alternative ways to generate cloudformation template programmatically.</p>

The CDK library provides you a way to declare the resources in your favorite languages like Java, Javascript, Typescript, and Python. In this tutorial, we will use **typescript and python** to generate our cloudformation template.

## Before we begin

Just a quick referesher to few concepts before we delve into AWS CDK 

1. **Cloudformation** template describes AWS resources. A running instance of cloudformation is called a stack. 

2. **Constructs** are the basic building blocks of AWS CDK apps.

3. **L1 construct** are named CfnXyz, where Xyz is name of the resource. They are low-level construct which directly represent cloudformatoin resources. 

4. **L2 construct** provide common boilerplates and glue logic. These will come with convenient defaults and reduces the amount of knowledge you need to know about them. 

5. **L3 construct** are called high-level patterns. These constructs are designed to help you complete common tasks in AWS, often involving multiple kinds of resources. 

<div class="attention">
<i style="color: orange;" class="fas fa-exclamation-circle"> </i>
For this tutorial, we will use L1 construct. However same concept can be used for L2 construct.
</div>
<br>
## Installation

First, install the AWS CDK CLI from command line using

```bash
$ npm i -g aws-cdk@latest
```

Let's create a project

<div class="tab-container">
  <ul>
    <li class="tab Typescript1"><a href="#Typescript1">Typescript</a></li>
    <li class="tab Python1"><a href="#Python1">Python</a></li>
  </ul>

   <div class="codeSample Typescript1" id="Typescript1">
      <script src="https://gist.github.com/tushar-sharma/167a194b3e9258d39e176905a6788d9b.js?file=initial1.sh"></script>
   </div>

   <div class="codeSample Python1" id="Python1">
      <script src="https://gist.github.com/tushar-sharma/167a194b3e9258d39e176905a6788d9b.js?file=initial2.sh"></script>   
  </div>

</div>

Then you can verify 
    
<script src="https://gist.github.com/tushar-sharma/167a194b3e9258d39e176905a6788d9b.js?file=cdk-doctor.sh"></script><br>


For our first use case, will add Parameters to our cloudformation. We need to edit file **lib\test-cdk-stack.ts** for typescript or **lib\test_cdk_stack.py** for python.

<div class="tab-container">
  <ul>
    <li class="tab Typescript2"><a href="#Typescript2">Typescript</a></li>
    <li class="tab Python2"><a href="#Python2">Python</a></li>
  </ul>

   <div class="codeSample Typescript2" id="Typescript2">
      <script src="https://gist.github.com/tushar-sharma/167a194b3e9258d39e176905a6788d9b.js?file=test-cdk-stack.ts"></script>
   </div>

   <div class="codeSample Python2" id="Python2">
      <script src="https://gist.github.com/tushar-sharma/167a194b3e9258d39e176905a6788d9b.js?file=test_cdk_stack.py"></script>   
  </div>

</div><br>

We can see the output of the cloudformation template by using the following command

```bash
$ cdk synth
```

If you want to generate cloudformation template without metadata

```bash
$ cdk synth --version-reporting false --path-metadata false 
```

The output is 

<script src="https://gist.github.com/tushar-sharma/167a194b3e9258d39e176905a6788d9b.js?file=synth_output1.yaml"></script>


<div class="attention">
<i style="color: orange;" class="fas fa-exclamation-circle"> </i>
For CDK v2, CheckBootstrapVersion rule is added to the Stack's template as a safety check, to verify that the bootstrap stack in the target environment meets the minimum requirements of the current stack<sup>1</sup></div>.
<br>

## Stepfunction

The cloudformation template needs at least one resource to validate. We will add a `stepfunction` to our cloudformation. We will define our stepfunction inside a json file, **helloworld.asl.json**

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

Next we need to upload the **helloworld.asl.json** to s3 bucket. We also need to define a mapping to access this `json` file.


<div class="tab-container">
  <ul>
    <li class="tab Typescript3"><a href="#Typescript3">Typescript</a></li>
    <li class="tab Python3"><a href="#Python3">Python</a></li>
  </ul>

   <div class="codeSample Typescript3" id="Typescript3">
      <script src="https://gist.github.com/tushar-sharma/167a194b3e9258d39e176905a6788d9b.js?file=test-cdk-stack2.ts"></script>
   </div>

   <div class="codeSample Python3" id="Python3">
      <script src="https://gist.github.com/tushar-sharma/167a194b3e9258d39e176905a6788d9b.js?file=test_cdk_stack2.py"></script>   
  </div>

</div><br>



Our output will still be the same since our mapping is **lazy**. Next, we will add stepfunction to our resources

<div class="tab-container">
  <ul>
    <li class="tab Typescript4"><a href="#Typescript4">Typescript</a></li>
    <li class="tab Python4"><a href="#Python4">Python</a></li>
  </ul>

   <div class="codeSample Typescript4" id="Typescript4">
      <script src="https://gist.github.com/tushar-sharma/167a194b3e9258d39e176905a6788d9b.js?file=test-cdk-stack3.ts"></script>
   </div>

   <div class="codeSample Python4" id="Python4">
      <script src="https://gist.github.com/tushar-sharma/167a194b3e9258d39e176905a6788d9b.js?file=test_cdk_stack3.py"></script>   
  </div>

</div>

The final cloudformation template is

<script src="https://gist.github.com/tushar-sharma/167a194b3e9258d39e176905a6788d9b.js?file=synth_output2.yaml"></script>

The cloudformation template is generated under 

```python
# for typescript
cdk.out\TestCdkStack.template.json
# for python 
cdk.out\test_cdk.template.json
```

Or you can simply deploy it using

```bash
$ cdk deploy
```

<div class='footnotes'><h4>Footnotes</h4><hr />
  <ol>
    <li id='fn:1'>
         <p><a href="https://github.com/aws/aws-cdk/issues/17942" target="_blank">Github issues</a></p>
         <a href='#fnref:1' rev='footnote'>&#8617;</a>
    </li>
  </ol>
</div>

<nav class="pagination clear" style="padding-bottom:20px;">
{% if page.previous.url %} <a class="prev-item" href="{{page.previous.url}}" title="Previous Post: {{page.previous.title}}">&larr;Previous</a>   {% endif %}  {% if page.next.url %}<a class="next-item" href="{{page.next.url}}" title="Next Post: {{page.next.title}}">Next&rarr;</a>         {% endif %}
</nav>