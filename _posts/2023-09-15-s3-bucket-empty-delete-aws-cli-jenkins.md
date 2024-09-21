---
layout: post
title: Empty s3 bucket and Delete using Jenkins and AWS CLI
image: https://unsplash.com/photos/NVlcid8E5pI/download?w=437
thumb: https://unsplash.com/photos/NVlcid8E5pI/download?w=437
author: Tushar Sharma
tags:
  - jenkins
  - aws
category: blog
---

Amazon Simple Storage Service (s3) is a scalable object storage service provided by AWS. It allows users to store and retrieve vast amount of data, make it a fundamental building block for many applications hosted on AWS. Deleting a s3 bucket is a two step process: empty a s3 bucket and then delete a s3 bucket.<!-- truncate_here -->

Amazon Simple Storage Service (s3) is a scalable object storage service provided by AWS. It allows users to store and retrieve vast amount of data, make it a fundamental building block for many applications hosted on AWS. Deleting a s3 bucket is a two step process: empty a s3 bucket and then delete a s3 bucket.

### Deleting bucket without versioning 

If a bucket has no versioning, we can empty s3 bucket using aws cli via jenkins

{% template  customCode.html %}
---
id: eec7e619c93f9f2c2874d26833200bce
file: pipeline1.groovy
---
{% endtemplate %}


If there's versioning, then it will fail with the following error:

```none
The bucket you tried to delete is not empty. You must delte all versions in the bucket.
```

### Understanding s3 versioning and delete markers

* **Versioning**: It allows you to preserve, retrieve, and restore every version of every object in a bucket. Once enabled, it cannot be suspended, only disabled.

* **Delete Markers**: Once you delete a versioned object in s3, a delete marker is inserted. This marker becomes the current version, simulating a "delete" operatings but not actually removing the object.


### Deleting bucket with versioning 

We need to delete all versions and delete markers to empty the s3 bucket.

{% template  customCode.html %}
---
id: eec7e619c93f9f2c2874d26833200bce
file: pipeline2.groovy
---
{% endtemplate %}