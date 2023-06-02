---
published: false
---

If you have multiple cloudformations, delete the stack becomes tedious using console in AWS. We can automate this by creating a simple Jenkins pipeline using bash script. 


```bash
if aws cloudformation wait stack-exists --stack-name ${params.StackName} --region ${params.Region}
    aws cloudformation delete-stack  \
        --stack-name ${params.StackName}} \
        --region ${params.Region}

    echo "Waiting on stack: ${params.StackName}} to be deleted..."
                            
    aws cloudformation wait stack-delete-complete  \
        --stack-name ${params.StackName} \
        --region ${params.Region}
else
    echo "Skipped deleting the stack : ${params.StackName} as it does not exist"
fi
```