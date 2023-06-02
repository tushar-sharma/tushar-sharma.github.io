---
published: false
---
## God

God is the best job in the world. "God is great" is a phrase I have heard often. Most people invoke god for any good occurance in their lives. However when the misfortune strike, I have never.  heard anyone cursing God. "May be God will help pull me from my misfortune", or "just a bad luck". 

I want this God job where people praise me for any good thing that happen in their life and pray to me for anything worse. No responsiblity whatsoever.

## Java

In java , an interface can extend another interface. An interface is a blueprint of a class. It has static constants and abstract methods.

Since Java 8, we can have default and static methods in an interface.
Since Java 9, we can have private methods in an interface.

## Interesting website

[java](https://javachallengers.com/)


## Redisjson

It's been a long time that I am strugglng with `redisjon` reactive way. I even asked a question in [stackoverflow](https://stackoverflow.com/questions/73913760/reactively-write-to-redis-in-redisjson-format) but haven't got any response. 

We are using a an interface called `ReactiveRedisOperations`

It has following methods

1. execute - which can execute the given RedisScript. This is the solution with `lua` but Scott want to alternative solution.


I want to be able to use `opsForValue` method to store the value in JSON data type. Currenlty I am able to save it in `String` datatype only.

There's a library [lettucemod](https://github.com/redis-developer/lettucemod) that use letticue library to make connection to redis.


There's a `reactive` interface there

```java
public interface RedisJSONReactiveCommands<K, V> {
  
  Mono<String> jsonSet(K key, String path, V json);
  
}
```

There's another interface that extends `RedisJSONReactiveCommands` inteface.

```java
public inteface RedisModulesReactiveCommands<K, V> extends ReactiveCommands<K,V>, RedisReactiveCommands<K, V> {
  @Override 
  StatefulRedisModulesConnection<K,V> getStatefulConnection();
}
```

Now I have to search for `RedisModulesReactiveCommands` interface.

There's another interface that has `RedisModulesClusterReactiveCommands` that uses `RedisModulesReactiveCommands`

```java
public interface RedisModulesClusterReactiveCommands<K,V> extends RedisModulesReactiveCommands<K,V>  {
}
```

Here' I am looking at `RedisModulesReactiveCommandsImpl`

```java
public class RedisModulesReactiveCommandsImpl<K,V> extends RedisReactiveCommandsImpl<K, V> {
      public 
}
```


Why not use the module, it seems that there's an intefrace definition like this

```java
public interface StatefulRedisModulesConnection<K, V> extends StatefulRedisConnection<K, V> {

	RedisModulesCommands<K, V> sync();

	RedisModulesAsyncCommands<K, V> async();

	RedisModulesReactiveCommands<K, V> reactive();
}
```


Add this dependency to the gradle config

```yaml
dependencies {
    implementation 'com.redis:lettucemod:3.1.5'
}
```

here are few methods / intrface that I see

```java
public interface StatefulRedisModulesClusterConnection<K,V> extends StatefulRedisClusterConnection<K, V>, StatefulRedisModulesConnection<K, V> {

    RedisModulesAdvancedClusterReactiveCommands<K, V> reactive();
    
}


public interface StatefulRedisModulesConnection<K, V> extends StatefulRedisConnection<K, V> {

	RedisModulesReactiveCommands<K, V> reactive();
}


public class StatefulRedisModulesClusterConnectionImpl<K, V> extends StatefulRedisClusterConnectionImpl<K, V>
		implements StatefulRedisModulesClusterConnection<K, V> {
}
```




