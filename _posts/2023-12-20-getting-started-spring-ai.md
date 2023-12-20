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

question? but what is snapshot repository?

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


Create a class `controller/SongsController.java`

question? what is requestMapping?

```java
import org.springframework.ai.client.AiClient;

@RestController
@RequestMapping("/songs")
public class SongsController {
    private final AiClient aiClient;
  
    public SongsController(AiClient aiClient) {
        this.aiClinet = aiClient;
    }
  
    @GetMapping("/topsong/{year}")
    public lString topSong(@PathVariable("year") int year) {
        String prompt = "What was the Billboard number one year-end top 100 single for {year}?";
        return aiClient.generate(prompt);
    }
}
```

question? dont we need to put `AutoWired` when we are injecting aiClient. Is it constructor injection?

Now go to 'localhost:8080/songs/topsong' to get the answer.

question? what's a path variable?

Using prompt tempalte


```java
@GetMapping("/topsong/{year}")
public String topSong(@PathVariable("year") int year){
    String prompt = "What was the Billboard number one year-end top 100 single for {year}?";
    PromptTemplate template = new PromptTemplate(prompt);
    template.add("year", year);
    return aiClient.generate(template.render());
}
```

question? why use promptTemplate? 



