---
published: false
---


Spring AI

start.spring.io
* name : SongsApi
* dependencies 
 - spring Web
 - Spring Boot DevTools
 
Add snapshot repository. 

TODO: but what is snapshot repository?

```xml
 <repositories>
   <repository>
     <id>spring-snapshot</id>
     <name>Spring Snapshot Repository</name>
     <url>https://repo.spring.io/snapshot</url>
     <snapshots>
       <enabled>true</enabled>
     </snapshots>
   </repository>
 </repositories>
```
    
add spring ai dependency

```xml
    <dependency>
        <groupId>org.springframework.ai</groupId>
        <artifactId>spring-ai-openai-spring-boot-starter</artifactId>
        <version>0.8.0-SNAPSHOT</version>
    </dependency>
```

Add API_KEY in `src/main/resources/application.properties`. 

```
spring.ai.openai.api-key=YOUR_API_KEY
```