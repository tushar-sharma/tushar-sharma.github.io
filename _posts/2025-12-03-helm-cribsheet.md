---
published: false
--- 


kubectl is a utility to deploy *yaml files to k8. These yaml files describe the state of your application. like

 > Are all *yaml files that kubectl deployes called manifest files

```yaml
# deployment.yaml
image: node:latest
replicas: 2

# service.yaml
type: ClusterIP
ports:
  - port: 80
```

Here the values are static and there is no version control. 

> Can we use environment variables with *yaml files and kubectl 


```yaml
# deployment.yaml
image: node:latest
replicas: ${ENV_REPLIC}

# service.yaml
type: ClusterIP
ports:
  - port: ${ENV_PORT)
```

**Helm** is a package manager for kuberenetes. We can turn these yaml into a template

```
templates\ 
    deployment.yaml
    service.yaml
values.yaml
```

Helm does

```
yaml + values -> rendendered manifest -> then deploy to k8
```



