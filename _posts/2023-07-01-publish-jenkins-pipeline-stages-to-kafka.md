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

### Create our model

define `KafkaMessage.groovy` as

```groovy
class KafkaMessage implements Serializable {
    def status
    
    KafkaMessage(def status){
        this.status = status
    }
    
    static class Stage {
        def startTime
        def endTime
        
        Stage(def startTime, def endTime){
            this.startTime = startTime
            this.endTime = endTime
        }
    }
}
```

Now we can define `Events` class. 

```groovy
class Events {

    def steps
    
    Events(steps) {
        this.steps = steps
    }
    
    def publish(KafkaMessage kafkaMessage, def currentBuild, def testMode){

        def saslUsername = ""
        def saslPassword = ""
        def kafkaBrokers = ""

        def payload = JsonOutput.toJson(kafkaMessage)

        def output = this.steps.sh(script: """
                                 set -x
                                 aws --version
                                 aws sts get-caller-identity
                                 echo '${payload}' | kafkacat -b ${kafkaBrokers} -t ${kafkaTopic} -P -l -J -z 'gzip' -X security.protocol=SASL_SSL -X sasl.mechanism=SCRAM-SHA-512 -X sasl.username=${saslUsername} -X sasl.password=${saslPassword}
                                 """, returnStdout: true).trim()

       }
}
```