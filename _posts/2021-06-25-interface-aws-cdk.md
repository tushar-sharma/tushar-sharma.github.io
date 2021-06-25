---
published: false
category: blog
layout: post
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

If you are not familiar with AWS CDK, then I would recommend to visit [Getting started with AWS CDK](http://randomwits.com/blog/tutorial-cdk-aws). 


create a project first

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

Our aim is to dynamically generate paramter resource. We will edit het `lib/helpers.ts` file as 

