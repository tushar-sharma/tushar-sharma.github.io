---
published: false
--- 


**Helm** is the package manager for kubernetes. We can either deploy our application (*yamls) to kubernetes using native **kubectl**  like

```yaml
# deployement.yaml
image: node/latest
replica: 2

# values.yaml
services:
 - bla
```

Or we can use **helm** to template these files using **helm chart**. You can replace variables and inject those parameters. **helm** send template to **tiller** (helm server) .

```bash
helm install myChart
```

and for upgrde

```bash
helm upgrade install
```