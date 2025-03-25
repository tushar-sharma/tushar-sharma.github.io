---
layout: post
title: Enable Observability at MongoDB
image: https://unsplash.com/photos//download?w=437
thumb: https://unsplash.com/photos//download?w=437
author: tushar sharma
category: blog
tags: [mongo]
---

Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.<!-- truncate_here -->

First lets' create a autoconfigure class 


```
@AutoConfigureAfter(value = {MongoReactiveAutoConfiguration.class, MongoReactiveDataAutoConfiguration.class})
@ConditionalOnClass({ MongoClient.class, ReactiveMongoTemplate.class, MongoClientSettings.class})
@EnableConfigurationProperties(MongoProperties.class)
public class CustomMongoReactiveAutoConfiguration {

    @Bean
    @ConditionalOnMissingBean
    @ConditionalOnProperty(prefix = "spring.data.mongodb", name = "database")
    public ReactiveMongoTemplate reactiveMongoTemplate(MongoClient mongoClient, MongoProperties mongoProperties) {
        return new ReactiveMongoTemplate(mongoClient, mongoProperties.getDatabase());
    }

    @Bean
    public MongoClientSettingsBuilderCustomizer mongoClientSettingsBuilderCustomizer(final ObservationRegistry registry) {
        return builder -> builder.contextProvider(ContextProviderFactory.create(registry))
                .addCommandListener(new MongoObservationCommandListener(registry));
    }
}
```

Now lets write a test for this : 

```java
@SpringBootTest(classes = {
        TestObservationRegistry.class,
        MongoReactiveAutoConfiguration.class,
        CustomMongoReactiveAutoConfiguration.class}, properties = {
        "spring.data.mongodb.database=testdb",
        "spring.data.mongodb.username=root",
        "spring.data.mongodb.password=password",
        "management.metrics.mongo.command.enabled=false",
        "managment.tracing.enabled=true",
        "spring.data.mongodb.authentication-database=admin",
        "spring.main.web-application-type=reactive"})
@Testcontainers
@AutoConfigureObservability
public class CustomMongoReactiveAutoConfigurationIntegrationTest {

    @Container
    private static final GenericContainer<?> mongoDBContainer = new GenericContainer<>(DockerImageName.parse("mongo:latest"))
            .withStartupAttempts(5)
            .withStartupTimeout(Duration.ofMinutes(5));

    @Autowired
    private TestObservationRegistry observationRegistry;

    @BeforeAll
    public static void beforeAll() {
        mongoDBContainer.start();
    }

    @DynamicPropertySource
    static void setProperties(DynamicPropertyRegistry registry) {
        String mongdbUri = String.format("mongodb://%s:%s@%s:%d/testdb?authSource=admin",
                "root",
                "password",
                mongoDBContainer.getHost(),
                mongoDBContainer.getFirstMappedPort());

        registry.add("spring.data.mongodb.uri", () -> mongdbUri);
    }


    @Test
    void testInsertAndRetrieveDataWithObservations()  {
        TestDocument doc = new TestDocument();
        doc.setId("testData");

        StepVerifier.create(retrieveFlux)
                .assertNext(retrievedDoc -> assertEquals(doc.getId(), retrievedDoc.getId()))
                .verifyComplete();


        TestObservationRegistryAssert assertThat = TestObservationRegistryAssert.assertThat(this.observationRegistry);

        assertThat
                .hasNumberOfObservationsWithNameEqualTo("spring.data.mongodb.command", 2)
                .hasObservationWithNameEqualTo("spring.data.mongodb.command")
                .that()
                .hasBeenStarted()
                .hasLowCardinalityKeyValue("db.operation", "update")
                 .hasLowCardinalityKeyValue("db.system", "mongodb")
                .hasLowCardinalityKeyValue("db.mongodb.collection", "testCollection")
                .hasLowCardinalityKeyValue("db.name", "testdb")
                .hasBeenStopped();
    }

    static class TestDocument {
            return id;
        }
    }
}
 
```