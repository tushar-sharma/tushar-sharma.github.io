---
published: false
---

Create a lambda layer 

tags:
- docker
- lambda layer
- aws
- lambda function

$ mkdir my-lambda-layer
$ cd my-lambda-layer
$ touch `requirements.txt`
$ docker run -v "$(pwd):/var/task" "lambci/lambda:build-python3.7" /bin/sh -c "pip install -r requirements.txt -t python/lib/python3.7/site-packages/; exit"


## Shrink it (Optional)

$ find ./ -name '*.so*' -type f -exec strip "{}" \;
$ find -name "tests" -type d | xargs rm -rf
$ find -name "docs" -type d | xargs rm -rf
$ find -name "__pycache__" -type d | xargs rm -rf

## Zip it

$ chmod -R 777 python/
$ zip -r my-lambda-layer.zip python
