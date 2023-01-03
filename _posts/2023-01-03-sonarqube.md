---
published: false
---
## Sonar Cube Scan

```bash
$ docker pull sonarqube
```

If this throws error:

```bash
no matching manifest for linux/arm64/v8 in the manifest list entries
```
then do 

```bash
$ mkdir ~/myFiles/sonarqube-arm
$ git clone https://github.com/SonarSource/docker-sonarqube ~/myFiles/sonarqube-arm/
$ docker build -t sonarqube-arm ~/myFiles/sonarqube-arm/9/community/
```

