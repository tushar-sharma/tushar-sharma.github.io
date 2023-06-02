---
published: false
---

## Update a Lambda Layer in a CloudFormation Stack with a New Zip File on S3

Lambda Layers are a great way to share code and resources across multiple Lambda functions. However, if you need to update the code in a Lambda Layer, you may find yourself wondering how to do it without having to manually update each function that uses the layer. In this tutorial, we'll show you how to update a Lambda Layer in a CloudFormation stack with a new zip file on S3.


###  Create a Lambda Layer

First, we'll create a new Lambda Layer that we can use in our CloudFormation stack. Here's an example CloudFormation resource for a Lambda Layer that includes the S3 bucket and key where the layer's code will be stored:

```yaml
MyLambdaLayer:
  Type: AWS::Lambda::LayerVersion
  Properties:
    LayerName: MyLayer
    Description: My Lambda Layer
    Content:
      S3Bucket: my-bucket
      S3Key: my-layer.zip
    CompatibleRuntimes:
      - python3.8

```

In this example, the Content section specifies the S3 bucket and key where the layer's code will be stored. Make sure to replace my-bucket and my-layer.zip with your own bucket and key values.

### Upload the Zip File to S3

Next, we need to upload the zip file containing the code for our Lambda Layer to the S3 bucket specified in the CloudFormation resource. You can do this using the AWS CLI or the S3 console. Here's an example command using the AWS CLI:

```bash
$ aws s3 cp my-layer.zip s3://my-bucket/my-layer.zip
```

Replace my-layer.zip and my-bucket with the actual values for your S3 bucket and key.

### Update the Zip File on S3

When you need to update the code in your Lambda Layer, you can simply upload a new zip file to the same S3 bucket and key as before. Make sure to give the new zip file a different name than the previous version.

### Update the CloudFormation Stack

To update the Lambda Layer in your CloudFormation stack with the new zip file on S3, you need to add a new property called CodeSha256 to the Content section of the resource. The CodeSha256 property should reference the S3 object version of the new zip file. Here's an example of how to do this:

```
MyLambdaLayer:
  Type: AWS::Lambda::LayerVersion
  Properties:
    LayerName: MyLayer
    Description: My Lambda Layer
    Content:
      S3Bucket: my-bucket
      S3Key: my-new-layer.zip
      CodeSha256: !GetAtt LayerS3Object.VersionId
    CompatibleRuntimes:
      - python3.8

LayerS3Object:
  Type: 'AWS::S3::Object'
  Properties:
    Bucket: my-bucket
    Key: my-new-layer.zip
```

In this example, we've updated the S3Key property to reference the new zip file my-new-layer.zip. We've also added a new resource called LayerS3Object that retrieves the S3
