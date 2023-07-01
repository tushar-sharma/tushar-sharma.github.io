---
published: false
---
## Publish Jenkinks Pipeline Stages to Kafka

Let say you have jenkins pipeline as

```groovy
pipeline {
  agent{node{label "TestNode"}}
  
  stages {
  
    stage("Intitialize") {
    }
  
    stage("Unit tests") {
    }
  
    stage("Deploy"){
    }
  }
}
```

You can add a post action to push to kafka 


```groovy
pipeline {
    stages {
    }
    post {
      success {
        script {
          new Events(this).publish(new KafkaMessage("success");
        }
      }
      failure {
        script {
            new Events(this).publish(new KafkaMessage("failure");
        }
      }
    }
}
```