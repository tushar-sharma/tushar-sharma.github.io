---
published: false
---


```bash
                          aws cloudformation delete-stack  \
                                --stack-name ${application}-${INPUT_JSON_FILE}-${params.ENVIRONMENT} \
                                --region ${params.Region}
                            echo "Waiting on stack: ${application}-${INPUT_JSON_FILE}-${params.ENVIRONMENT} to be deleted..."
                            aws cloudformation wait stack-delete-complete  \
                                --stack-name ${application}-${INPUT_JSON_FILE}-${params.ENVIRONMENT} \
                                --region ${params.Region}
```