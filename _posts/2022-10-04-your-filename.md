---
published: false
---
## Moodys

### Training

### RedisJSON 
Time: 

So ReactiveRedisOperations<String, T> foo;

foo = bar;

and ReactiveRedisTemplate<factory, context> bar;

RedisSerializationContext<String, T> context = builder.value(serializer).build();

and 

```java
        RedisSerializationContext.RedisSerializationContextBuilder<String, T> builder = RedisSerializationContext
                .newSerializationContext(new StringRedisSerializer());
```
 
 
My hunch is to pass some generic Serializer to serilzation context.