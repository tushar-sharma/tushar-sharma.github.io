---
published: false
---
## OpenTelemetry using Java Agent in Spring Boot


3 pillars of observability: 

1. Traces
2. Metrics
3. logs


Java agent collects opentelmetry agent and emit to console (or Collector). 

start with start.spring.io
    Spring Web
    lombok
    
open the zip file in IntelliJ

create a record called 

```java
public record Order(Long id, Long customerId, ZonedDateTime orderDate, BigDecimal totalAmount){
}
```

create a controller called `OrderController`

```java
@RestController
@RequestMapping("/orders")
public class OrderController {
  @GetMapping("/{id}")
  public Order ifndById(@PathVariable Long Id) {
    return new Order(id, 1L, zonedDateTime.now(), BigDecimal.TEN);
  }
}
```

Now go to `localhost:8080/orders/1`.

next download `opentelemtry-javaagent.jar` and run the following in termainl 

```bash
$ java javaagent:opentelemetry-javaagent.jar -Dotel.traces.exporter=logging -Dotel.metrics.exporter=logging -Dotel.logs.exporter=logging -jar build/libs/order-service-0.0.1-SNAPSHOT.jar
```

