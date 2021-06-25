---
published: false
---
# Dynamic Interface for you AWS CDK Project

- typescript
- aws 
- cdk 

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

We will edit the `lib/project_cdk-stack.ts` file from scratch. First we will add Parameters to our cdk class.
