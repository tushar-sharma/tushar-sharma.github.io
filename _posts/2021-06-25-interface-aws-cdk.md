---
layout: post
title: Automate creation of AWS Stack
category: blog
tags:
- aws
- cdk
- cloudformation
- typescript
- tutorial
name: interface-aws-cdk
thumb: https://unsplash.com/photos/pgSkeh0yl8o/download?w=437
image: https://unsplash.com/photos/pgSkeh0yl8o/download?w=437
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

<a href="https://aws.amazon.com/cdk/" target="_bank">AWS CDK</a> is a great framework to programmatically deploy cloudformation stack. If you are unfamiliar with AWS CDK, I would recommend first to check out [Getting started with AWS CDK](http://randomwits.com/blog/tutorial-cdk-aws).<!-- truncate_here -->

<a href="https://aws.amazon.com/cdk/" target="_bank">AWS CDK</a> is a great framework to programmatically deploy cloudformation stack. If you are unfamiliar with AWS CDK, I would recommend first to check out [Getting started with AWS CDK](http://randomwits.com/blog/tutorial-cdk-aws). 

One of the pet peeves I have while designing <a href="https://aws.amazon.com/cloudformation/" target="_blank">cloudformation</a> template is redundancy. I have to manually copy-paste the same properties across multiple resources. I wanted to leverage AWS CDK to create an interface that would allow tto dynamically create cloudformation. For the interface, I harked back to the good old CSV file.

For a simple example, let's consider a simple cloudformation template 


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

What if we have to maintain 100 parameters, resources, etc in our project. Soon it will become tedious to maintain multiple resources. Instead, we create a class called `Parameter` that we instantiate multiple times using different parameters. Here is a class diagram for our `Parameter` class.

<center>
<img src="https://i.imgur.com/XnSkPM5.png" alt="class diagram">  
</center>

Using typescript, we can define the class as 

<script src="https://gist.github.com/tushar-sharma/ba6ca7d009513cc3ddb0bc7105cc0aa2.js"></script><br>


<p>We will create a `CSV` file under folder `resources`  which would contain information for each instance of our class.</p>


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

First, we will read our `CSV` file into our project. We would need to install an additional library to read the file.

```bash 
$ npm i --save csvtojson
```

We will edit the `lib/project_cdk-stack.ts` file.

<script src="https://gist.github.com/tushar-sharma/b541b614e6be8502c95f460ecdf2dd37.js"></script> 


Then we will create `lib/helpers.ts` file. 

<script src="https://gist.github.com/tushar-sharma/4a080d416faf980b71723bdce21feb66.js"></script> 


Our code till now will not generate any cloudformation. However, we can test it for any compile errors


```bash 
$ cdk synth --quiet
```

Next, we will implement our `generateTemplate` function.


<script src="https://gist.github.com/tushar-sharma/8cb4e903d0ca972ecaac81f7de042704.js"></script><br>

Lastly, we can deploy our cloudformation stack using 


```bash 
$ cdk deploy
```

In the next article, we will update our code to add additional classes to handle `resources`, `output`, etc for our cloudformation template.