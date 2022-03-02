---
published: false
---

## Code

```yaml
AWSTemplateFormatVersion: 2010-09-09
Description: AWS CloudFormation Template to create Table Stats dynamodb table

Resources:
  SampleTable:
    Type: 'AWS::DynamoDB::Table'
    Properties:
      TableName: sample-table
      AttributeDefinitions:
        - AttributeName: id
          AttributeType: S
      KeySchema:
        - AttributeName: id
          KeyType: HASH
      PointInTimeRecoverySpecification:
        PointInTimeRecoveryEnabled: true
 
Outputs:
  TableName:
    Value: !Ref SampleTable
    Description: Sample Table 
    Export:
      Name: sample-table
```

## References

1. https://cloudkatha.com/create-dynamodb-table-using-cloudformation-template/
