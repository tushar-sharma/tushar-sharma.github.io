---
published: false
---


1. POST endpoint that request a JSON

2. Save payload to redis in REDIS data type

3. Current implementation has String datatype

## Brainstorm

### Using `execute` method

We are using buildRedisOptional which is Optional<ReactiveRedisOperations<String, Build>. 

So common way to save it in String datatype is 

```java
buildRedisOptional
.map(operations -> 
     operations
     .opsForValue()
     .set("key", myObject)
     onErrorResume(Exception.class, ex -> {
                                    log.warn(Constants.LOG_REDIS_ERROR_IGNORING + ex.getMessage());
                                    return Mono.empty();
                                })
                ).orElseGet(() -> {
                    log.info(Constants.LOG_REDIS_UNAVAILABLE_SKIPPING);
                    return Mono.empty();
                });
     
```

I can use `execute` method in `buildRedisOptional` like

```java
        RedisScript script = new DefaultRedisScript("redis.call(JSON.get key)");

        return buildRedisOptional.map(redisBuildOperations ->
                        redisBuildOperations
                                .execute(script)
                                .onErrorResume(Exception.class, ex -> {
                                    log.warn(Constants.LOG_REDIS_ERROR_IGNORING, ex);
                                    return Flux.empty();
                                }))
                .orElseGet(() -> {
                    log.warn(Constants.LOG_REDIS_UNAVAILABLE_SKIPPING);
                    return Flux.empty();
                });

```

But it's failing.


### Using `lettucemod` module

We are using `lettuce` as a connection module. there'a library called [lettucemod](https://github.com/redis-developer/lettucemod




