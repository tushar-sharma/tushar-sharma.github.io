---
published: false
category: blog
layout: post
title: Dynamically create cloudformation stack using AWS CDK
---

<style>
table, td, th {  
  border: 1px solid #ddd;
  text-align: center;
}

table {
  border-collapse: collapse;
  width: 100%;
}

th, td {
  padding: 15px;
}


</style>

<a href="https://aws.amazon.com/cdk/" target="_bank">AWS CDK</a> is a great framework to programmatically deploy cloudformation stack. If you are unfamiliar with AWS CDK, I would recommend first to check out [Getting started with AWS CDK](http://randomwits.com/blog/tutorial-cdk-aws). 

One of pet peeves with cloudformation is to copy paste same information across multiple resources. I wanted to leverage AWS CDK to create an interface that would allow tto dynamically create cloudformation. For the interface, I harked back to the good old csv file.


Create a project first

$ mkdir projectCDK  && cd $_ 

verify everyting is installed okay 

$ cdk doctor 


```bash
$ cdk doctor
_ CDK Version: 1.108.1 (build ae24d8a)
_ AWS environment variables:
  - AWS_STS_REGIONAL_ENDPOINTS = regional
  - AWS_NODEJS_CONNECTION_REUSE_ENABLED = 1
  - AWS_SDK_LOAD_CONFIG = 1
_ No CDK environment variables
```

Next we will create a csv file 

```bash
$ mkdir resources
$ touch ckdInput.csv
```
 
This csv will be our interface for our CDK project. The CSV looks like

<table >
  <tr>
    <th>resource</th>
    <th>create</th>
    <th>category</th>
    <th>default</th>
    <th>description</th>
    <th>allowed_values</th>
  </tr>
  <tr>
    <td>Environment</td>
    <td>yes</td>
    <td>parameter</td>
    <td>dev</td>
    <td>Enter your environment</td>
    <td>dev | qa | prod</td>
  </tr>

  <tr>
    <td>Project</td>
    <td>yes</td>
    <td>parameter</td>
    <td>version1</td>
    <td>Enter version</td>
    <td></td>
  </tr>
</table>

We will edit the `lib/project_cdk-stack.ts` file.

<script src="https://gist.github.com/tushar-sharma/b541b614e6be8502c95f460ecdf2dd37.js"></script>


Then we will create `lib/helpers.ts` file. 

<script src="https://gist.github.com/tushar-sharma/4a080d416faf980b71723bdce21feb66.js"></script>

```bash 
$ npm i --save csvtojson
```

Our code till now will not generate any cloudformtion. However we can test it for any compile errors


```bash 
$ cdk synth --quiet
```

Our aim is to dynamically generate parameter resource. We will edit het `lib/helpers.ts` file as


<script src="https://gist.github.com/tushar-sharma/8cb4e903d0ca972ecaac81f7de042704.js"></script>


```bash
$ cdk synth > resources/output.yaml
```

```bash
Parameters:
  Environment:
    Type: String
    Default: dev
    AllowedValues:
      - dev
      - qa
      - prod
    Description: Enter your environment
  Project:
    Type: String
    Default: version
    Description: Enter your version

```

```bash 
$ cdk deploy
```
