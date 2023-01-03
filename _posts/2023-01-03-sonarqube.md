---
published: false
---
## Sonar Cube Scan

```bash
$ docker pull sonarqube
```

On ARM based Macs you might get this error

```bash
no matching manifest for linux/arm64/v8 in the manifest list entries
```
Solution 

```bash
$ docker pull davealdon/sonarqube-with-docker-and-m1-macs
```

Start the sonarqube server

```
$ docker run -d --name sonarqube -e SONAR_ES_BOOTSTRAP_CHECKS_DISABLE=true -p 9000:9000 davealdon/sonarqube-with-docker-and-m1-macs
```

Login to sonarqube using following cred

```bash
Username : admin
Password : admin
```

next go to the folder where you want to scan


```bash
$ sonar-scanner -X  \
  -Dsonar.projectKey=Test \
  -Dsonar.sources=. \
  -Dsonar.host.url=http://localhost:9000 \
  -Dsonar.login=<token>
```

For token go to My Profile -> Security -> Generate token