---
layout: post
title: Understanding AtomicLong in Java
image: https://unsplash.com/photos/_mX0sSpVbOg/download?w=437
thumb: https://unsplash.com/photos/_mX0sSpVbOg/download?w=437
author: tushar sharma
category: blog
tags:
 - java
---

`AtomicLong` is a thread-safe counter and numeric state holder from `java.util.concurrent.atomic`. It is useful when multiple threads need to update one `long` value without using a `synchronized` block.<!-- truncate_here -->

## Why `count++` is not thread-safe

This line looks like one operation:

```java
count++
```

But it is really a read-modify-write sequence:

1. Read the current value of `count`.
2. Add `1`.
3. Write the new value back.

That creates a race condition when two threads run the same code at the same time.

For example, suppose `count` is `10`.

| Thread | Step | Value |
| --- | --- | --- |
| A | reads `count` | `10` |
| B | reads `count` | `10` |
| A | writes `10 + 1` | `11` |
| B | writes `10 + 1` | `11` |

Two increments happened, but the final value is only `11`. One update was lost.

## A broken counter

Here is a small counter that is not safe under concurrency:

```java
public class UnsafeCounter {
    private long value;

    public void increment() {
        value++;
    }

    public long get() {
        return value;
    }
}
```

The code is simple, but it is not correct if multiple threads call `increment()` at the same time.

## The same counter with AtomicLong

Use `AtomicLong` when the shared state is a single `long` value:

```java
import java.util.concurrent.atomic.AtomicLong;

public class AtomicCounter {
    private final AtomicLong value = new AtomicLong(0);

    public long increment() {
        return value.incrementAndGet();
    }

    public long get() {
        return value.get();
    }
}
```

Now the increment is atomic. Multiple threads can call `increment()` and each update is applied safely.

## Complete example

This example starts ten threads. Each thread increments the same counter 100,000 times.

```java
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.Future;
import java.util.concurrent.atomic.AtomicLong;

public class AtomicLongExample {
    public static void main(String[] args) throws InterruptedException, ExecutionException {
        var counter = new AtomicLong(0);

        int threadCount = 10;
        int incrementsPerThread = 100_000;

        ExecutorService executor = Executors.newFixedThreadPool(threadCount);
        List<Future<?>> futures = new ArrayList<>();

        for (int i = 0; i < threadCount; i++) {
            futures.add(executor.submit(() -> {
                for (int j = 0; j < incrementsPerThread; j++) {
                    counter.incrementAndGet();
                }
            }));
        }

        for (Future<?> future : futures) {
            future.get();
        }

        executor.shutdown();

        System.out.println(counter.get()); // 1000000
    }
}
```

Without `AtomicLong`, the final result may be less than `1,000,000` because some increments can be lost.

## How AtomicLong works

`AtomicLong` does not put a Java monitor lock around the value. It uses low-level CPU-supported atomic operations, usually exposed as compare-and-swap, also called CAS.

CAS has three pieces of information:

1. The memory location to update.
2. The value you expect to find.
3. The new value you want to write.

The update succeeds only if the current value still matches the expected value. If another thread changed the value first, the CAS operation fails and the code retries with the latest value.

Conceptually, an atomic increment looks like this:

```java
long previous;
long next;

do {
    previous = value.get();
    next = previous + 1;
} while (!value.compareAndSet(previous, next));
```

You usually should not write this loop yourself for simple operations. Use the built-in methods like `incrementAndGet()`, `addAndGet()`, and `updateAndGet()`.

## Common AtomicLong methods

| Method | What it does | Returned value |
| --- | --- | --- |
| `get()` | Reads the current value | Current value |
| `set(long newValue)` | Sets a new value | Nothing |
| `getAndSet(long newValue)` | Replaces the value | Old value |
| `getAndIncrement()` | Adds `1` | Old value |
| `incrementAndGet()` | Adds `1` | New value |
| `getAndAdd(long delta)` | Adds `delta` | Old value |
| `addAndGet(long delta)` | Adds `delta` | New value |
| `compareAndSet(long expected, long update)` | Updates only if current value equals `expected` | `true` if updated |
| `updateAndGet(LongUnaryOperator updateFunction)` | Updates using a function | New value |
| `getAndUpdate(LongUnaryOperator updateFunction)` | Updates using a function | Old value |

The difference between `getAndIncrement()` and `incrementAndGet()` is important:

```java
var counter = new AtomicLong(10);

System.out.println(counter.getAndIncrement()); // 10
System.out.println(counter.get());             // 11

System.out.println(counter.incrementAndGet()); // 12
System.out.println(counter.get());             // 12
```

Use the method whose return value matches what your code needs.

## Use update methods for business rules

Avoid this pattern:

```java
long current = counter.get();
counter.set(current + 10);
```

The `get()` and `set()` calls are individually safe, but the pair is not one atomic operation. Another thread can update the value between those two lines.

Prefer an atomic update method:

```java
counter.addAndGet(10);
```

For custom logic, use `updateAndGet()`:

```java
import java.util.concurrent.atomic.AtomicLong;

public class Score {
    private final AtomicLong highScore = new AtomicLong(0);

    public long recordScore(long score) {
        return highScore.updateAndGet(current -> Math.max(current, score));
    }

    public long currentHighScore() {
        return highScore.get();
    }
}
```

This keeps the read, decision, and write inside one atomic update.

## When to use AtomicLong

`AtomicLong` is a good fit for:

- counters
- sequence numbers
- request IDs
- retry counters
- single-value numeric state
- simple state transitions with `compareAndSet()`

Example sequence generator:

```java
import java.util.concurrent.atomic.AtomicLong;

public class IdGenerator {
    private final AtomicLong nextId = new AtomicLong(1);

    public long next() {
        return nextId.getAndIncrement();
    }
}
```

## When not to use AtomicLong

Do not use `AtomicLong` as a general replacement for locks.

It protects only that one value. If you need to update multiple fields together, use a lock, an immutable object swapped through `AtomicReference`, or a higher-level concurrency abstraction.

This is risky:

```java
private final AtomicLong balance = new AtomicLong();
private final AtomicLong version = new AtomicLong();

public void update(long newBalance) {
    balance.set(newBalance);
    version.incrementAndGet();
}
```

`balance` and `version` are each atomic, but the two updates are not atomic as a pair. Another thread can observe the new balance with the old version.

## AtomicLong vs LongAdder

Modern Java also has `LongAdder`.

Use `AtomicLong` when:

- you need the exact current value after each update
- you need `compareAndSet()`
- you need one atomic numeric state

Use `LongAdder` when:

- many threads update a counter very frequently
- the counter is mostly used for metrics
- an eventually consistent sum is acceptable while updates are happening

Example:

```java
import java.util.concurrent.atomic.LongAdder;

public class RequestMetrics {
    private final LongAdder totalRequests = new LongAdder();

    public void recordRequest() {
        totalRequests.increment();
    }

    public long totalRequests() {
        return totalRequests.sum();
    }
}
```

For high-contention metrics, `LongAdder` can scale better because it spreads updates across multiple internal cells. For state that must be read and updated as one exact value, `AtomicLong` is usually the clearer choice.

## Best practices

- Keep the `AtomicLong` field `private final`.
- Use intention-revealing names like `requestCount`, `nextId`, or `retryAttempts`.
- Prefer `incrementAndGet()`, `addAndGet()`, `updateAndGet()`, and `compareAndSet()` over manual `get()` plus `set()`.
- Do not expose the `AtomicLong` itself from your class. Expose methods that describe the allowed operations.
- Use `LongAdder` for hot counters used only for statistics.
- Use locks or immutable state objects when multiple values must change together.

## Summary

`AtomicLong` makes updates to a single `long` value atomic. It is often simpler than a lock for counters and small numeric state, but it is not a magic thread-safety wrapper for an entire object.

The practical rule is:

- use `AtomicLong` for exact single-value state
- use `LongAdder` for high-throughput metrics counters
- use a lock or a higher-level abstraction when a whole group of values must stay consistent
