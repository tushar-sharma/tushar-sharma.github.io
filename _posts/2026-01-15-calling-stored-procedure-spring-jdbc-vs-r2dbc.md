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
| **Annotation** | `@Procedure` | `@Query` |

**Key insight**: These are separate stacks. You can't mix them - `JdbcTemplate` only works with JDBC drivers, and `DatabaseClient` only works with R2DBC drivers.

<div style="text-align: center;">
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

rectangle "**JPA / Hibernate**\n(Full ORM)" as hibernate #1565C0
rectangle "**Basic Mapping**\n(No ORM)" as basicMapping #F57C00

rectangle "**Spring Data JPA**\n@Procedure" as jpa #90CAF9
rectangle "**Spring Data R2DBC**\n@Query" as r2dbcRepo #FFCC80

db -down-> protocol
protocol -down-> jdbc
protocol -down-> r2dbc
jdbc -down-> ds
r2dbc -down-> cf
ds -down-> jt
cf -down-> dc
jt -down-> hibernate
dc -down-> basicMapping
hibernate -down-> jpa
basicMapping -down-> r2dbcRepo
@enduml
</div>

## Where Does Hibernate Fit?

In the JDBC stack, there's an important layer between JdbcTemplate and Spring Data JPA:

```
Spring Data JPA (@Procedure, repositories)
        ↓
JPA (Specification - just interfaces)
        ↓
Hibernate (Implementation - actual code)
        ↓
JDBC
```

**JPA** (Java Persistence API) is just a *specification* - interfaces that define what an ORM should do. No actual code.

**Hibernate** is an *implementation* of JPA - the actual code that does the work. EclipseLink is another implementation.

**Hibernate does NOT work with R2DBC.** It's built on JDBC (blocking). That's why `@Procedure` only exists in the JDBC stack.

## ORM vs Repository

These are different concepts:

**Repository** = A pattern for abstracting data access (find, save, delete). Both stacks have this.

**ORM** (Object-Relational Mapping) = Maps Java objects ↔ database tables with advanced features:
- Class → Table mapping
- Relationships (OneToMany, ManyToOne)
- Lazy loading
- Caching
- Dirty checking (tracking changes)

| Feature | JDBC + Hibernate | R2DBC |
|---|---|---|
| **Repository** | JpaRepository | ReactiveCrudRepository |
| **ORM** | Hibernate (full) | None |
| **Entity mapping** | `@Entity`, `@OneToMany` | `@Table`, `@Id (basic)` |
| **Lazy loading** | Yes | No |
| **Relationships** | Automatic | Manual |
| **Caching** | Yes | No |

R2DBC is more "direct" - it talks to the database through drivers without a heavy ORM layer. Less magic, more control, but more manual work for complex scenarios.

## How to Tell Which Stack You're Using

Quick ways to identify the stack in code:

| See this? | You're using |
|---|---|
| `DataSource` | JDBC |
| `ConnectionFactory` | R2DBC |
| `@Entity` | JPA/Hibernate (JDBC) |
| `@Table` (without @Entity) | R2DBC |
| `JdbcTemplate` | JDBC |
| `DatabaseClient` | R2DBC |
| `JpaRepository` | JPA/Hibernate (JDBC) |
| `ReactiveCrudRepository` | R2DBC |
| `@Procedure` | JPA (JDBC only) |
| Returns `Mono`/`Flux` | R2DBC |

**Connection management is different:**
- JDBC uses `DataSource` (blocking connection pool like HikariCP)
- R2DBC uses `ConnectionFactory` (reactive connection pool)

You cannot use `DataSource` with `DatabaseClient` - they're from different worlds.

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

## ConnectionFactory (R2DBC)

For R2DBC, you use `ConnectionFactory` instead of `DataSource`:

{% template  customCode.html %}
---
id: ca33ddf1335fdc8c63f4fc23f2dd6ef1
file: ConnectionFactory.java
---
{% endtemplate %}


In Spring Boot, just add `spring.r2dbc.*` properties:

{% template  customCode.html %}
---
id: ca33ddf1335fdc8c63f4fc23f2dd6ef1
file: application.yaml
---
{% endtemplate %}

Spring Boot auto-configures `ConnectionFactory` and `DatabaseClient` for you.

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


### Spring Data JPA `@Procedure`

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

### `@Query` in Repository - Declarative

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