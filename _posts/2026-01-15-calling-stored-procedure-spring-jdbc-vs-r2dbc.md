---
layout: post
title: Calling Stored Procedure in Spring using jdbc vs r2dbc
image: https://i.pinimg.com/originals/da/a4/64/daa4647f6b6159a23763884b92597bcf.jpg
thumb: https://i.pinimg.com/originals/da/a4/64/daa4647f6b6159a23763884b92597bcf.jpg
author: tushar sharma
category: blog
skipImage: true
tags:
 - spring-boot
 - jdbc
 - r2dbc
 - spring-data
---

Calling stored procedures from Spring Boot? You have two paths: JDBC (blocking) or R2DBC (reactive).<!-- truncate_here -->

Calling stored procedures from Spring Boot? You have two paths: JDBC (blocking) or R2DBC (reactive).


## What's a stored procedure

- it's a sql code that's saved and executed on database server

- it's like a resuable function that has business logic 

- can accept input parameter, produce output parameters

e.g.

{% template  customCode.html %}
---
id: ca33ddf1335fdc8c63f4fc23f2dd6ef1
file: store.sql
---
{% endtemplate %}

## The Two Paths: JDBC vs R2DBC

There are two distinct stacks for database access in Java:

| | **JDBC (Blocking)** | **R2DBC (Reactive)** |
|---|---|---|
| **Driver** | JDBC Driver | R2DBC Driver |
| **Connection** | DataSource | ConnectionFactory |
| **Client API** | JdbcTemplate, SimpleJdbcCall | DatabaseClient |
| **ORM** | Spring Data JPA | Spring Data R2DBC |
| **Annotation** | @Procedure | @Query (no @Procedure) |

**Key insight**: These are separate stacks. You can't mix them - `JdbcTemplate` only works with JDBC drivers, and `DatabaseClient` only works with R2DBC drivers.

@startuml
skinparam backgroundColor transparent
skinparam defaultFontName Arial
skinparam rectangle {
    RoundCorner 10
    BorderColor #555555
}

database "**DATABASE**" as db #388E3C
rectangle "**Protocol**\nPostgres Wire Protocol" as protocol #4CAF50

rectangle "**JDBC Driver**\n(Blocking)" as jdbc #1E88E5
rectangle "**R2DBC Driver**\n(Reactive)" as r2dbc #FB8C00

rectangle "**DataSource**\nHikariCP / DriverManager" as ds #42A5F5
rectangle "**ConnectionFactory**\nR2DBC Pool" as cf #FFA726

rectangle "**JdbcTemplate**\nSimpleJdbcCall" as jt #64B5F6
rectangle "**DatabaseClient**" as dc #FFB74D

rectangle "**Spring Data JPA**\n@Procedure" as jpa #90CAF9
rectangle "**Spring Data R2DBC**\n@Query" as r2dbcRepo #FFCC80

db -down-> protocol
protocol -down-> jdbc
protocol -down-> r2dbc
jdbc -down-> ds
r2dbc -down-> cf
ds -down-> jt
cf -down-> dc
jt -down-> jpa
dc -down-> r2dbcRepo
@enduml

## DriverManager vs DataSource

Both are ways to get a database connection, but `DataSource` is the modern choice.

**DriverManager** (JDBC 1.0) - the old way:

{% template  customCode.html %}
---
id: ca33ddf1335fdc8c63f4fc23f2dd6ef1
file: DriverManager.java
---
{% endtemplate %}

**DataSource** (JDBC 2.0+) - the preferred way:

{% template  customCode.html %}
---
id: ca33ddf1335fdc8c63f4fc23f2dd6ef1
file: DataSource.java
---
{% endtemplate %}


Why `DataSource` is preferred:
- **Connection pooling** - reuses connections instead of creating new ones
- **Configuration externalized** - connection details in properties, not code
- **Transparent to application** - switch databases without code changes
- **Health monitoring** - pools can validate connections before use

In Spring Boot, just add `spring.datasource.*` properties and you get a `HikariDataSource` automatically.

## JDBC Stack (Blocking)

Everything in this stack **blocks the thread** while waiting for the database.

### Raw JdbcTemplate

Full control, but verbose:

{% template  customCode.html %}
---
id: ca33ddf1335fdc8c63f4fc23f2dd6ef1
file: JdbcTemplate.java
---
{% endtemplate %}


Why `registerOutParameter`? The JDBC driver needs to know which parameters are outputs **before** execution. After the call completes, it retrieves the value from that registered position.

### SimpleJdbcCall

Declarative, less boilerplate:

{% template  customCode.html %}
---
id: ca33ddf1335fdc8c63f4fc23f2dd6ef1
file: SimpleJdbcCall.java
---
{% endtemplate %}


### Spring Data JPA @Procedure

The cleanest - but **only works with JDBC** (blocking):

{% template  customCode.html %}
---
id: ca33ddf1335fdc8c63f4fc23f2dd6ef1
file: MathRepository.java
---
{% endtemplate %}


`@Procedure` is a JPA annotation. JPA is built on JDBC, so it's inherently blocking. There's no reactive equivalent.

## R2DBC Stack (Reactive)

Everything in this stack is **non-blocking** and returns `Mono`/`Flux`.

Two ways to execute queries - same pattern as JDBC:

| | **Programmatic (Client)** | **Declarative (Repository)** |
|---|---|---|
| **JDBC** | `JdbcTemplate.query()` | `@Query` in JpaRepository |
| **R2DBC** | `DatabaseClient.sql()` | `@Query` in ReactiveCrudRepository |

### DatabaseClient.sql() - Programmatic

The reactive equivalent of `JdbcTemplate`. You write code to build and execute queries manually:

{% template  customCode.html %}
---
id: ca33ddf1335fdc8c63f4fc23f2dd6ef1
file: DatabaseClient.java
---
{% endtemplate %}


Use this when you need full control - dynamic queries, complex mappings, or operations that don't fit the repository pattern.

### @Query in Repository - Declarative

You annotate a method and Spring generates the implementation:

{% template  customCode.html %}
---
id: ca33ddf1335fdc8c63f4fc23f2dd6ef1
file: Query.java
---
{% endtemplate %}


Same SQL, but Spring handles the binding and execution. You just call `mathRepository.addNumbers(2, 3)`.

**No `@Procedure` in R2DBC** - Spring Data R2DBC doesn't have a `@Procedure` annotation because R2DBC drivers don't have standardized stored procedure support like JDBC's `CallableStatement`. You must use `@Query` with native SQL instead.

## Summary

| Want to... | Use | Driver |
|---|---|---|
| Call stored procedures with annotations | `@Procedure` (JPA) | JDBC (blocking) |
| Call stored procedures with full control | `JdbcTemplate` / `SimpleJdbcCall` | JDBC (blocking) |
| Reactive database access | `DatabaseClient` / `@Query` | R2DBC (non-blocking) |
| Reactive stored procedures | `DatabaseClient` with native SQL | R2DBC (limited support) |

If you need `@Procedure`, you're using JDBC. If you need reactive/non-blocking, you're using R2DBC and will need `@Query` with native SQL instead.