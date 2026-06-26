---
layout: post
title: boolean vs Boolean in Java
image: https://unsplash.com/photos/tPtP2IXnSm0/download?w=437
thumb: https://unsplash.com/photos/tPtP2IXnSm0/download?w=437
author: tushar sharma
category: blog
tags:
 - java
---

What's the difference between boolean and Boolean in Java? At first, they look almost the same. Both can hold true or false.<!-- truncate_here -->

What's the difference between `boolean` and `Boolean` in Java?

At first, they look almost the same. Both can hold `true` or `false`.

The important difference is that `boolean` is a primitive, while `Boolean` is an object wrapper. That sounds small, but it matters a lot when you are working with JSON, DTOs, and `PATCH` requests.

## Primitive boolean

`boolean` is a primitive type.

```java
boolean pushToProduction = true;
```

A primitive `boolean` has only two possible values:

- `true`
- `false`

It can never be `null`.

That also means Java has to give it a default value. For a field on a class, the default value is `false`.

```java
class Patch {
  private String name;
  private boolean pushToProduction;
}
```

If a JSON payload does not contain `pushToProduction`:

```json
{
  "name": "Updated name"
}
```

Jackson still has to put some value into the Java field. Since the field is primitive, it becomes:

```java
name = "Updated name";
pushToProduction = false;
```

The problem is that this loses information. We no longer know whether the client meant:

- "I did not send `pushToProduction`; leave it unchanged"
- "I explicitly want `pushToProduction` to become `false`"

Both cases become the same Java value: `false`.

## Boolean wrapper

`Boolean` is the object wrapper for `boolean`.

```java
Boolean pushToProduction;
```

Because it is an object, it can represent three states:

- `Boolean.TRUE`
- `Boolean.FALSE`
- `null`

That third state is the useful part. `null` can mean "not provided".

```java
class Patch {
  private String name;
  private Boolean pushToProduction;
}
```

For the same JSON payload:

```json
{
  "name": "Updated name"
}
```

Jackson can now deserialize it as:

```java
name = "Updated name";
pushToProduction = null;
```

Now the application can tell the difference between an omitted value and an explicit `false`.

## Why this matters for PATCH

`PATCH` usually means partial update. The client sends only the fields it wants to change.

So this request:

```json
{
  "name": "Updated name"
}
```

should mean:

> Change the name. Do not change anything else.

It should not mean:

> Change the name, and also set every missing boolean to false.

This is where primitive `boolean` can introduce a subtle bug.

Imagine this DTO:

```java
public record Patch(
    String name,
    boolean pushToProduction
) {}
```

If the request body is:

```json
{
  "name": "Updated name"
}
```

then `pushToProduction` becomes `false`, even though the client never sent it.

If the service forwards that DTO to another API, the outgoing JSON may accidentally become:

```json
{
  "name": "Updated name",
  "pushToProduction": false
}
```

That is dangerous. A sparse update can accidentally clear an existing `true` value.

## The safer PATCH DTO

For partial updates, use `Boolean` when missing and explicit `false` have different meanings.

```java
import com.fasterxml.jackson.annotation.JsonInclude;

@JsonInclude(JsonInclude.Include.NON_NULL)
public record Patch(
    String name,
    Boolean pushToProduction
) {}
```

Now the states stay separate:

| JSON input | Java value | Meaning | Serialized with `NON_NULL` |
| --- | --- | --- | --- |
| field omitted | `null` | do not change it | no |
| `"pushToProduction": true` | `Boolean.TRUE` | set it to true | yes |
| `"pushToProduction": false` | `Boolean.FALSE` | set it to false | yes |

With `Boolean` and `NON_NULL`, this input:

```json
{
  "name": "Updated name"
}
```

can stay sparse when forwarded:

```json
{
  "name": "Updated name"
}
```

That preserves the meaning of the PATCH request.

## Null-safe checks

Once a field is `Boolean`, avoid this:

```java
if (patch.pushToProduction()) {
  publishToBlockchain();
}
```

If `pushToProduction` is `null`, unboxing it to `boolean` can throw a `NullPointerException`.

Use this instead:

```java
if (Boolean.TRUE.equals(patch.pushToProduction())) {
  publishToBlockchain();
}
```

This condition is true only when the value is explicitly `Boolean.TRUE`.

For merge logic, check for `null` when you want to know whether the client sent the field:

```java
if (patch.pushToProduction() != null) {
  patch.setpushToProduction(patch.pushToProduction());
}
```

This means:

- `null`: do not update
- `Boolean.TRUE`: update to true
- `Boolean.FALSE`: update to false

## Rule of thumb

Use primitive `boolean` when the value is always required and there is a real default.

Use wrapper `Boolean` when absence has meaning.

For JSON `PATCH` DTOs, absence usually has meaning. If the client does not send a boolean field, the safest assumption is often "do not change it", not "set it to false".
