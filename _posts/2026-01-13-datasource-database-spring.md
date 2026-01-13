---
published: false
---

1. set up docker sybase

2. create gradle file 

```xml
<dependency>
     <groupId>org.springframework.boot</groupId>
     <artifactId>spring-boot-starter-data-jpa</artifactId>
</dependency>
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-data-jdbc</artifactId>
</dependency>
<dependency>
    <groupId>org.postgresql</groupId>
    <artifactId>postgresql</artifactId>
</dependency>
<dependency>
     <groupId>org.projectlombok</groupId>
     <artifactId>lombok</artifactId>
     <optional>true</optional>
</dependency>
```


create a datasource Configuration

```java
@Configuration
@configurationProperties (prefix = "datasource")
public class DataSourceConfiguration {
  private String driverClassName;
  
  private String url;
  
  private String username;
  
  private String passwrod;
  
  @Bean
  public DriverManagerDataSource  datasource() {
    DriverManagerDataSource dataSource = new DriverManagerDataSource();
    dataSource.setDriverClassName(driverClassName);
    dataSource.setUrl(url);
    dataSource.setPassword(passwrod);
    dataSource.setUsername(username);
  }
}
```

