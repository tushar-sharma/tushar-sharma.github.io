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

I am following this article

https://www.baeldung.com/spring-boot-redis-cache


```java
    private <T> ReactiveRedisOperations<String, T> buildRedisOperations(ReactiveRedisConnectionFactory factory, Class<T> clazz) {
        RedisSerializationContext.RedisSerializationContextBuilder<String, T> builder = RedisSerializationContext
                .newSerializationContext(new StringRedisSerializer());
        RedisSerializationContext<String, T> context = builder.value((RedisSerializationContext.SerializationPair<T>) RedisSerializationContext.SerializationPair.fromSerializer(new GenericJackson2JsonRedisSerializer())).build();
        return new ReactiveRedisTemplate<>(factory, context);
    }
```

Now I am getting different error

```bash
it's still stirng data type
```