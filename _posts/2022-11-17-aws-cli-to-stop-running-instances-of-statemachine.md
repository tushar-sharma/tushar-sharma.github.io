---
layout: post
title: AWS CLI to stop running instances of statemachine
image: https://unsplash.com/photos/aiyBwbrWWlo/download?w=437
thumb: https://unsplash.com/photos/aiyBwbrWWlo/download?w=437
author: Tushar Sharma
tags:
  - aws
  - statemachine
published: true
category: blog
---

I could not delete a statemachine that had running instances stuck in Progress. Since the number of instances were humongous, it was impossible to manually delete them using UI.<!-- truncate_here -->

I could not delete a statemachine that had running instances stuck in Progress. Since the number of instances were humongous, it was impossible to manually delete them using UI. 

We can bulk delete these instances using aws-cli in bash.

| <img align="center"  loading="lazy" src="{{ root_url }}/img/sfn1.jpg" alt="" />|

First we can get list of all executions of a statemachine that are in running state.

```bash
$ export arn=""
$ aws stepfunctions list-executions --state-machine-arn $arn --status-filter RUNNING --query "executions[*].{executionArn:executionArn}" --output text)
```

We can combine this with `stop-execution` command like

```bash
$ export arn=""
$ for i in $(aws stepfunctions list-executions --state-machine-arn $arn --status-filter RUNNING --query "executions[*].{executionArn:executionArn}" --output text); do
aws stepfunctions stop-execution --execution-arn $i > /dev/null 2>&1;
done
```

However this might be slow for large number of executions. Much faster solution would be to execute them in `parallel`

```bash
$ export arn=""
$ export limit=14000
$ aws  stepfunctions list-executions --state-machine-arn $arn --status-filter RUNNING  --max-items 10000 | grep executionArn | awk '{print $2}' | sed -e 's/\"//g' | sed -e 's/,//g' | xargs -L 1 -n 1 -P 10 aws stepfunctions stop-execution --execution-arn >/dev/null 2>&1
```

We can combine both solution if you still have a large number of executions. You can set count to the number of times you want to repeat this process.

```bash
$ export count=20
$ for i in $(seq $count); do 
 aws  stepfunctions list-executions --state-machine-arn $arn --status-filter RUNNING  --max-items 10000 | grep executionArn | awk '{print $2}' | sed -e 's/\"//g' | sed -e 's/,//g' | xargs -L 1 -n 1 -P 10 aws stepfunctions stop-execution --execution-arn >/dev/null 2>&1
done
```

Here,

`14000` is the value I got from trial and error. Any larger value than 14000 throws following error from the API

```bash
An error occurred (ThrottlingException) when calling the ListExecutions operation

```
