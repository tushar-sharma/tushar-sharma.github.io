---
published: false
---
# Dynamic Interface for you AWS CDK Project

- typescript
- aws 
- cdk 

If you are not familiar with AWS CDK, then I would recommend to first refer to [Getting started with AWS CDK](http://randomwits.com/blog/tutorial-cdk-aws). 


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

This csv will be our interface for our CDK project. 

| **resources** | **create ** | **category** | **default** | **description**| **allowed_values**|
|---------------+-------------+--------------+-------------+----------------+-------------------|
| Environment   | yes         | parameter    | dev         |  Enter enviroment | dev "|" qa | prod |

