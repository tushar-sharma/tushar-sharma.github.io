---
title: Creating Python AWS lambda layer with Docker
category: blog
layout: post
tags:
  - docker
  - aws
  - python
featuredPost: false
image: 'https://unsplash.com/photos/1pyqUh8Jx3E/download?w=437'
thumb: 'https://unsplash.com/photos/1pyqUh8Jx3E/download?w=437'
published: true
---

When you develop AWS lambda functions, you might feel the need to install additional `python` libraries. This can be achieved using Lambda layers that can be included in any lambda function.<!-- truncate_here -->


When you develop AWS lambda functions, you might feel the need to install additional `python` libraries. This can be achieved using Lambda layers that can be included in any lambda function.  


### Creating Lambda Layer with Docker

We will create a lambda layer `my-lambda-layer`. 

```bash
$ mkdir my-lambda-layer
$ cd my-lambda-layer
```

Next, we need to list libraries that we want to include in the lambda layer. For our example, we will only add `pandas` to our lambda layer.

```bash
$ echo "pandas" > requirements.txt
```

Use docker to install libraries

```bash
$ mkdir -p python/lib/python3.7/site-packages
$ docker run \
  -v "$(pwd):/var/task" \
  "lambci/lambda:build-python3.7" \
  /bin/sh -c "pip install -r requirements.txt \
  -t python/lib/python3.7/site-packages/; exit"
```

<blockquote class="attention" markdown="1">
This will create lambda layer for python runtime `3.7`. However you can also use docker image : public.ecr.aws/sam/build-python3.9 for `3.9`. 
</blockquote>

The example directory structure for a Lambda layer that's compatible with Python `3.7` 

```
├── requirements.txt
└── python/
    └── lib/
        ├── python3.7/
        │   └── site-packages/
```

### Remove unnecessary files (Optional)

Sometimes you might want to reduce the size of the lambda layer since there is a size quota in AWS[^quota]. 

```bash
$ find -name "__pycache__" -type d | xargs rm -rf
$ find ./ -name '*.pyc' -type f -delete
$ find -name "tests" -type d | xargs rm -rf
```

### Create a zipped file

```bash
$ chmod -R 777 python/
$ zip -r my-lambda-layer.zip python
```

### Create or update your layer

```bash
$ aws lambda publish-layer-version --layer-name my-lambda-layer --description "Demo Lambda Layer" --zip-file "fileb://my-lambda-layer.zip" --compatible-runtimes "python3.7"
```

### Reference

[^quota]: [Lambda Layer Size Quota](https://docs.aws.amazon.com/lambda/latest/dg/invocation-layers.html)
