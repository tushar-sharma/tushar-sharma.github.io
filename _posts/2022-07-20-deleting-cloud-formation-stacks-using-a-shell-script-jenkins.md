---
published: false
---
if aws cloudformation wait stack-exists --stack-name dev-nics-proxyservlet-svc --region us-west-2 &>/dev/null 
then
    aws cloudformation delete-stack --stack-name dev-nics-proxyservlet-svc
else
    aws cloudformation create-stack --stack-name dev-nics-proxyservlet-svc --region us-west-2 --template-body file://dev-nics-proxyservlet-cluster.yml --parameters file://dev-nics-proxyservlet-svc-param.json --capabilities "CAPABILITY_IAM" "CAPABILITY_NAMED_IAM"
fi


```bash
                          aws cloudformation delete-stack  \
                                --stack-name ${application}-${INPUT_JSON_FILE}-${params.ENVIRONMENT} \
                                --region ${params.Region}
                            echo "Waiting on stack: ${application}-${INPUT_JSON_FILE}-${params.ENVIRONMENT} to be deleted..."
                            aws cloudformation wait stack-delete-complete  \
                                --stack-name ${application}-${INPUT_JSON_FILE}-${params.ENVIRONMENT} \
                                --region ${params.Region}
```