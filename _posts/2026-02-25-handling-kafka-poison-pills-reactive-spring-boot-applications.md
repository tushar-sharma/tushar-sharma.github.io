---
published: false
---

what's a kafka poison pill? it's a corrupted kafka record that cannot be deserialized by the consumer. it causes the consumer to fail repeatedly on the same offset, blocking all subsequent messages in that partition indefinitely. 



## example

we published a malformed JSON message to the kafka topic

```
{"id": 1, "name": "Tushar", }
```

Notice the trailing comma - invalid JSON that cannot be deserialized 

## The problem : Infinite loop

```json
{
  "level": "ERROR",
  "message": "Unexpected exception",
  "stack_trace": "JsonParseException: Unexpected character ('}' (code 125)): was expecting double-quote to start field name at line: 1, column: 50",
  "error": "RecordDeserializationException: Error deserializing VALUE for partition ratings-topic-0 at offset 243. If needed, please seek past the record to continue consumption."
}
```

## What happens

1. consumer fetches offset 243
2. JSONDeserializer fails to parse malformed JSON 
3. Exception thrown -> offset not commited
4. consumer retries -> fetches offset 243 again
5. loop continues indefinately 
6. all messages after offset 243 are blocked


## application.yaml

```yaml
spring:
  kafka:
    consumer:
      value-deserializer: org.springframework.kafka.support.serializer.ErrorHandlingDeserializer
      properties:
        spring.deserializer.value.delegate.class: org.springframework.kafka.support.serializer.JsonDeserializer    
```

### How It Works

```
Bad JSON → JsonDeserializer throws exception
        → ErrorHandlingDeserializer catches it
        → Returns NULL value (no exception propagated)
        → Stores error details in headers
        → Consumer can skip and continue
```














