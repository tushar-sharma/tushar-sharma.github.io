---
published: false
---
## God

God is the best job in the world. "God is great" is a phrase I have heard often. Most people invoke god for any good occurance in their lives. However when the misfortune strike, I have never.  heard anyone cursing God. "May be God will help pull me from my misfortune", or "just a bad luck". 

I want this God job where people praise me for any good thing that happen in their life and pray to me for anything worse. No responsiblity whatsoever.

## Redisjson

It's been a long time that I am strugglng with `redisjon` reactive way. I even asked a question in [stackoverflow](https://stackoverflow.com/questions/73913760/reactively-write-to-redis-in-redisjson-format) but haven't got any response. 


There's a library [lettucemod](https://github.com/redis-developer/lettucemod) that use letticue library to make connection to redis.

We are using a an interface called `ReactiveRedisOperations`

It has following methods

1. execute - which can execute the given RedisScript. This is the solution with `lua` but Scott want to alternative solution.

