---
published: false
---
Understanding Kafka Deserializer

In Kafka, a deserializer is responsible for converting byte arrays from kafka topic into Java Objects. Kafka provides default deserializer for standard data types like strings and integers, but you can also implement custom deserializer for complex types.

Usually you will encounter error: 'No delegate deserializer configured' when consuming messages from a kafka topic. 

This error often occurs when using the 'ErrorHandlingDeserializer' provided by Spring Kafka which acts as a wrapper around another deserializer (the delegate) to provide additional error-handling capabilities. If the delegate deserializer isn't configured properly, then 'ErrorHandlingDeserializer' cannot function correctly.

Solution

* Ensure that both the 'ErrorHandlingDeserializer' and the delegate deserializer are correctly configured in 'application.yaml'. 

* Update the kafka consumer configuration in your Java code to use the correct deserializer classes based on the configuration. 

```yaml
spring:
  kafka:
    consumer:
      key-deserializer: org.springframework.kafka.support.serializer.ErrorHandlingDeserializer
      value-deserializer: org.springframework.kafka.support.serializer.ErrorHandlingDeserializer
      properties:
        spring.deserializer.key.delegate.class: org.apache.kafka.common.serialization.StringDeserializer
        spring.deserializer.value.delegate.class: org.apache.kafka.common.serialization.StringDeserializer
```

Like in Java, we would also update consumer properties

```java

private final Map<String, Object> kafkaConfigProperties = new HashMap<>();

private void setConfigProps(KafkaProperties kafkaProperties) { 
this.kafkaConfigProperties.put(ConsumerConfig.KEY_DESERIALIZER_CLASS_CONFIG,
        Class.forName(kafkaProperties.getConsumer().getProperties().getOrDefault(
                "spring.deserializer.key.delegate.class",
                StringDeserializer.class.getName()
        ))
);

this.kafkaConfigProperties.put(ConsumerConfig.VALUE_DESERIALIZER_CLASS_CONFIG,
        Class.forName(kafkaProperties.getConsumer().getProperties().getOrDefault(
                "spring.deserializer.value.delegate.class",
                StringDeserializer.class.getName()
        ))
}
);
```

