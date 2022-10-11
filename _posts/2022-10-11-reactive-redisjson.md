---
published: false
---
## Spring Data Redis

It provides `ReactiveRedisOperations` for writing reactively to redis. 

As if now it doesn't suport [REDISJSON](https://github.com/spring-projects/spring-data-redis/issues/2429) format.

## Try1 

key is Class object. 


```
ReactiveRedisOperations
.map(operation -> 
operation
.opsForValue()
.set(key1, key)
```

Try using `bytebuffer`

```
ReactiveRedisOperations
.map(operation -> 
operation
.opsForValue()
.set(key1, ByteBuffer.wrap(key.ByteUtils.getBytes()))
```

or use `toByteArray`

```
ReactiveRedisOperations
.map(operation -> 
operation
.opsForValue()
.set(key1, ByteBuffer.wrap(key.toByteArray()))
```

Try2 

https://github.com/redis/redis-om-spring doesnt support lettuce. It only suports jedis.


Links 
https://stackoverflow.com/questions/61062171/spring-data-redis-support-for-modules


Lettucemod

```java
StatefulRedisModulesConnection<String, String> connection;

```

