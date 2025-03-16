
## Observability in MongoDb

Spring boot's metrics listener uses Micrometer's `MeterRegsitry`. There is autoconfiguration class `MongoMetericsAutoConfiguration.class`. 

It creates a bean of `MongoClientSettingsBuilderCustomizer`

```java
MongoClientSettingsBuilderCustomizer mongoClientSettingsBuilderCustomizer(MongoMetricsCommandListener mongoMetricsCommandListener) {
  return (clientSettingsBuilder) -> clientSettingsBuilder 
     .addCommandListener(mongoMetricsCommandListener);
}
```

For traces, micrometer uses `ObservationRegistry`. For traces in `mongodb`, we need to disable Spring's Mongodb metrics listener in `application.properties	

```
management.metrics.mongo.command.enabled=false

# enable openTelemetry traces
management.tracing.enabled=true
```
and override the bean 

```
@Bean
MongoClientSettingsBuilderCustomizer mongoClientSettingsBuilderCustomizer(final ObservationRegistry observationRegistry) {
  return (clientSettingsBuilder) -> clientSettingsBuilder 
     .addCommandListener(new MongoObservationCommandListener(observationRegistry);
}
```

## Avoid cheap dopamine

Rome wasn’t built in a day, and neither is lasting success or fulfillment. Instant gratification may feel rewarding in the moment, but it rarely leads to true progress or long-term happiness.

* Avoid porn 

* Avoid sugar
