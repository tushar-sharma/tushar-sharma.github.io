---
layout: post
title: Enable Observability at MongoDB
image: https://unsplash.com/photos/DSeVfl4CnZg/download?w=437
thumb: https://unsplash.com/photos/DSeVfl4CnZg/download?w=437
author: tushar sharma
category: blog
tags: [spring-boot, mongodb, observability]
---

Implementing Observability in Reactive MongoDB with Spring Boot and Testcontainers. <!-- truncate_here -->

Implementing Observability in Reactive MongoDB with Spring Boot and Testcontainers

## Introduction to Observability


Observability is the cornerstone of modern distributed systems, enabling developers to:
- **Trace** request flows through microservices

- **Measure** system performance via metrics

- **Diagnose** issues using structured logs

In reactive MongoDB applications, observability becomes crucial due to:

- Non-blocking nature complicating request tracing

- Connection pooling challenges

- Complex query performance analysis



## The Three Observability Pillars

1. **Metrics**: Quantitative measurements (e.g., query duration)

2. **Traces**: Distributed request context propagation

3. **Logs**: Contextual event records

## AutoConfigure class

Lets create our `CustomMongoReactiveAutoConfiguration` class which needs to create a bean of `MongoClientSettingsBuilderCustomizer`


```java
@AutoConfigureAfter(value = {MongoReactiveAutoConfiguration.class, MongoReactiveDataAutoConfiguration.class})
@ConditionalOnClass({ MongoClient.class, ReactiveMongoTemplate.class, MongoClientSettings.class})
@EnableConfigurationProperties(MongoProperties.class)
public class CustomMongoReactiveAutoConfiguration {

    @Bean
    @ConditionalOnMissingBean
    @ConditionalOnProperty(prefix = "spring.data.mongodb", name = "database")
    public ReactiveMongoTemplate reactiveMongoTemplate(MongoClient mongoClient, 
                                                     MongoProperties mongoProperties) {
        return new ReactiveMongoTemplate(mongoClient, mongoProperties.getDatabase());
    }

    @Bean
    public MongoClientSettingsBuilderCustomizer mongoClientSettingsBuilderCustomizer(
        final ObservationRegistry registry) {
        return builder -> builder
            .contextProvider(ContextProviderFactory.create(registry))
            .addCommandListener(new MongoObservationCommandListener(registry));
    }
}
```

**Key Components**:

- **@AutoConfigureAfter:** Ensures proper configuration ordering

- **MongoClientSettingsBuilderCustomizer:** Injects observability instrumentation

- **ContextProvider:** Propagates tracing context through reactive pipelines

## Integration Testing with Testcontainers

```java
@SpringBootTest(classes = {
    TestObservationRegistry.class,
    MongoReactiveAutoConfiguration.class,
    CustomMongoReactiveAutoConfiguration.class}, 
    properties = {
        "spring.data.mongodb.database=testdb",
        "management.metrics.mongo.command.enabled=false",
        "management.tracing.enabled=true",
        "spring.main.web-application-type=reactive"
    })
@Testcontainers
@AutoConfigureObservability
public class CustomMongoReactiveAutoConfigurationIntegrationTest {

    @Container
    private static final GenericContainer<?> mongoDBContainer = 
        new GenericContainer<>(DockerImageName.parse("mongo:latest"))
            .withExposedPorts(27017)
            .withEnv("MONGO_INITDB_ROOT_USERNAME", "root")
            .withEnv("MONGO_INITDB_ROOT_PASSWORD", "password");

    @Autowired
    private ReactiveMongoTemplate mongoTemplate;

    @Autowired
    private TestObservationRegistry observationRegistry;

    @DynamicPropertySource
    static void setProperties(DynamicPropertyRegistry registry) {
        registry.add("spring.data.mongodb.uri", () -> 
            String.format("mongodb://%s:%s@%s:%d/testdb?authSource=admin",
                "root",
                "password",
                mongoDBContainer.getHost(),
                mongoDBContainer.getFirstMappedPort()));
    }

    @Test
    void verifyCommandObservationInstrumentation() {
        TestDocument doc = new TestDocument("1", "test-data");
        
        StepVerifier.create(mongoTemplate.save(doc, "testCollection"))
            .expectNextCount(1)
            .verifyComplete();

        TestObservationRegistryAssert.assertThat(observationRegistry)
            .hasNumberOfObservationsWithNameEqualTo("spring.data.mongodb.command", 1)
            .hasObservationWithNameEqualTo("spring.data.mongodb.command")
            .that()
            .hasLowCardinalityKeyValue("db.operation", "insert")
            .hasLowCardinalityKeyValue("db.name", "testdb")
            .hasLowCardinalityKeyValue("db.mongodb.collection", "testCollection");
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    static class TestDocument {
        @Id
        private String id;
        private String payload;
    }
}
```