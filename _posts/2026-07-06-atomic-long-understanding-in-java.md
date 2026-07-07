---
layout: post
title: Understanding AtomicLong in Java
image: https://unsplash.com/photos/VV13d2ozcy4/download?w=437
thumb: https://unsplash.com/photos/VV13d2ozcy4/download?w=437
author: tushar sharma
category: blog
published: false
tags:
 - java
---

// https://www.cs.umd.edu/~pugh/java/memoryModel/issues.pdf
`AtomicLong` is a thread-safe counter and numeric state holder from `java.util.concurrent.atomic`. It is useful when multiple threads need to update one `long` value without using a `synchronized` block.<!-- truncate_here -->

This post is both a tutorial and a runbook. The tutorial explains the mental model. The runbook helps you choose the right concurrency primitive when you are writing or reviewing production Java code.

## The mental model

Before learning the API, keep these ideas separate:

| Concept | Meaning |
| --- | --- |
| Atomicity | An operation happens as one indivisible step. Other threads cannot observe it half-finished. |
| Visibility | A write made by one thread becomes visible to another thread. |
| Ordering | The JVM and CPU do not reorder memory operations in a way that breaks the guarantees of the primitive you are using. |
| Contention | Multiple threads try to update the same value at the same time. |

`AtomicLong` gives you atomic operations on one `long` value, plus the visibility guarantees needed for safe communication between threads.

The most common beginner mistake is to fix visibility but not atomicity.

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

## Volatile is not enough

You might try this:

```java
public class VolatileCounter {
    private volatile long value;

    public void increment() {
        value++;
    }

    public long get() {
        return value;
    }
}
```

This is still broken.

`volatile` makes reads and writes visible across threads, but `value++` is still a read-modify-write sequence. Two threads can read the same value and overwrite each other.

Use this rule:

| Code | Visibility | Atomic compound update |
| --- | --- | --- |
| plain `long` | no reliable cross-thread visibility | no |
| `volatile long` | yes | no |
| `AtomicLong` | yes | yes, for supported atomic operations |
| `synchronized` | yes | yes, for everything inside the synchronized block |

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

## Memory semantics

The methods on `AtomicLong` are not only arithmetic helpers. They also provide memory visibility guarantees.

In practical terms:

- `get()` behaves like reading a `volatile` value.
- `set()` behaves like writing a `volatile` value.
- successful atomic updates like `compareAndSet()`, `incrementAndGet()`, and `addAndGet()` safely publish the updated value to other threads that read through the same `AtomicLong`.

This matters when one thread produces a value and another thread observes it.

```java
import java.util.concurrent.atomic.AtomicLong;

public class Progress {
    private final AtomicLong lastProcessedOffset = new AtomicLong(-1);

    public void markProcessed(long offset) {
        lastProcessedOffset.set(offset);
    }

    public long lastProcessedOffset() {
        return lastProcessedOffset.get();
    }
}
```

The reader sees a safely published `long` value. But remember the boundary: this only protects the value stored in the `AtomicLong`. It does not automatically make a larger object graph thread-safe.

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

## Keep update functions side-effect-free

Methods like `updateAndGet()` and `getAndUpdate()` may call your function more than once. That can happen when another thread updates the value first and the CAS retry loop runs again.

This is good:

```java
counter.updateAndGet(current -> Math.min(current + 1, 100));
```

The function is deterministic and has no side effects.

This is risky:

```java
counter.updateAndGet(current -> {
    auditLog.incrementAttempt(); // bad: may run more than once
    return current + 1;
});
```

The counter update still works, but the side effect may happen multiple times for one logical update. Keep update functions pure: calculate and return the next value only.

## Compare-and-set for state transitions

`compareAndSet()` is useful when you want to move from one known state to another known state.

Example: a shutdown signal should be sent only once.

```java
import java.util.concurrent.atomic.AtomicLong;

public class ShutdownGate {
    private static final long RUNNING = 0;
    private static final long STOPPING = 1;

    private final AtomicLong state = new AtomicLong(RUNNING);

    public boolean requestShutdown() {
        return state.compareAndSet(RUNNING, STOPPING);
    }

    public boolean isStopping() {
        return state.get() == STOPPING;
    }
}
```

Only the first caller changes the state from `RUNNING` to `STOPPING`. Later callers get `false` and know another thread already requested shutdown.

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

If those values must move together, model them as one immutable value and swap the whole value:

```java
import java.util.concurrent.atomic.AtomicReference;

public class AccountStateHolder {
    private record AccountState(long balance, long version) {}

    private final AtomicReference<AccountState> state =
            new AtomicReference<>(new AccountState(0, 0));

    public AccountState updateBalance(long newBalance) {
        return state.updateAndGet(current ->
                new AccountState(newBalance, current.version() + 1));
    }
}
```

Now readers cannot observe a new balance with an old version because both values are replaced together.

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

## Contention and CAS retry cost

CAS is lock-free, but it is not free.

Under low contention, an `AtomicLong` update often succeeds immediately. Under high contention, many threads may repeatedly do this:

1. Read the current value.
2. Compute the next value.
3. Try CAS.
4. Fail because another thread updated first.
5. Retry.

This is why `AtomicLong` can become a bottleneck for a very hot metric counter. Every thread is fighting over one memory location.

`LongAdder` reduces that fight by spreading updates across multiple internal cells and summing them later. The tradeoff is that `sum()` is not a single atomic snapshot while updates are still happening.

Use this practical rule:

| Situation | Better choice |
| --- | --- |
| Generate exact IDs | `AtomicLong` |
| Track exact state transitions | `AtomicLong` |
| Count HTTP requests for metrics | `LongAdder` |
| Count events with very high write contention | `LongAdder` |
| Need compare-and-set | `AtomicLong` |

## False sharing intuition

Modern CPUs move memory around in cache lines, not individual variables. If multiple hot variables sit on the same cache line and different threads update them, the CPU cores can invalidate each other's cache lines even when the variables are logically unrelated.

That problem is called false sharing.

You usually do not need to manually solve false sharing in application code. But the idea helps explain why high-contention counters are hard and why `LongAdder` exists: it avoids making every writer update the same hot memory location.

## AtomicLongFieldUpdater

Most application code should use `AtomicLong`.

In performance-sensitive code with many objects, `AtomicLongFieldUpdater` can avoid allocating one `AtomicLong` object per instance. It atomically updates a `volatile long` field inside your object.

```java
import java.util.concurrent.atomic.AtomicLongFieldUpdater;

public class Download {
    private static final AtomicLongFieldUpdater<Download> BYTES_DOWNLOADED =
            AtomicLongFieldUpdater.newUpdater(Download.class, "bytesDownloaded");

    private volatile long bytesDownloaded;

    public void addBytes(long bytes) {
        BYTES_DOWNLOADED.addAndGet(this, bytes);
    }

    public long bytesDownloaded() {
        return bytesDownloaded;
    }
}
```

Use it only when allocation overhead actually matters. It is more verbose, easier to misuse, and less readable than `AtomicLong`.

## Advanced note: the ABA problem

CAS asks: "Is the value still what I expected?"

Sometimes that is not enough. A value can change from `A` to `B` and then back to `A`. A later CAS sees `A` and succeeds, even though the value changed in between.

That is the ABA problem.

For simple increasing counters, ABA is usually not a practical concern. It matters more in lock-free data structures and reference-based algorithms. If you need to detect intermediate changes, use a version number, `AtomicStampedReference`, or model the state with an immutable object that includes a version.

## Benchmarking note

Do not trust a quick `System.nanoTime()` loop for concurrency performance. The JVM can optimize code in surprising ways, and thread scheduling noise can dominate the result.

If you want to compare `synchronized`, `AtomicLong`, and `LongAdder`, use JMH.

A rough benchmark plan:

| Variant | What to measure |
| --- | --- |
| plain `long` | incorrect baseline, shows lost updates |
| `synchronized` | correctness with monitor locking |
| `AtomicLong` | correctness with CAS |
| `LongAdder` | write throughput under contention |

The result usually depends on thread count, CPU, JVM version, and contention level. Benchmark the workload you actually care about.

## Runbook: choosing the right primitive

Use this table during code review:

| Need | Use |
| --- | --- |
| Single exact numeric value | `AtomicLong` |
| Very hot metrics counter | `LongAdder` |
| Multiple fields must update together | `synchronized`, `Lock`, or immutable state with `AtomicReference` |
| One-time state transition | `AtomicLong.compareAndSet()` or `AtomicBoolean.compareAndSet()` |
| Object reference swap | `AtomicReference` |
| Avoid per-object atomic allocation in hot path | `AtomicLongFieldUpdater` |
| Blocking coordination between threads | `CountDownLatch`, `Semaphore`, `Phaser`, or another higher-level concurrency tool |

## Runbook: reviewing AtomicLong code

Ask these questions:

1. Is the `AtomicLong` protecting exactly one independent value?
2. Is the field `private final`?
3. Is the class exposing behavior instead of exposing the `AtomicLong` object?
4. Is there any manual `get()` followed by `set()` that should be `addAndGet()`, `updateAndGet()`, or `compareAndSet()`?
5. Does an update function have side effects?
6. Are multiple atomic fields expected to stay consistent together?
7. Is this a high-contention metrics counter that should be a `LongAdder`?
8. Does the code need the exact current value after every update?

If the answer to question 6 is yes, `AtomicLong` is probably the wrong abstraction.

## Runbook: debugging suspicious counters

If a counter looks wrong in production or a test is flaky, check these in order:

1. Search for `get()` followed by `set()`.
2. Search for multiple `AtomicLong` fields that represent one logical state.
3. Check whether the counter is reset while other threads are still incrementing it.
4. Check whether `LongAdder.sumThenReset()` is being called concurrently with updates.
5. Check whether the value is read once and cached somewhere else.
6. Check whether the code increments before or after a failure path.
7. Add a focused stress test with many threads and repeated runs.

Example stress test shape:

```java
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.Executors;
import java.util.concurrent.Future;
import java.util.concurrent.atomic.AtomicLong;

class CounterStressTest {
    public static void main(String[] args) throws Exception {
        var counter = new AtomicLong();
        var executor = Executors.newFixedThreadPool(8);
        List<Future<?>> futures = new ArrayList<>();

        for (int i = 0; i < 8; i++) {
            futures.add(executor.submit(() -> {
                for (int j = 0; j < 250_000; j++) {
                    counter.incrementAndGet();
                }
            }));
        }

        for (Future<?> future : futures) {
            future.get();
        }

        executor.shutdown();

        long expected = 2_000_000;
        long actual = counter.get();

        if (actual != expected) {
            throw new AssertionError("Expected " + expected + " but got " + actual);
        }
    }
}
```

Stress tests do not prove concurrency code correct, but they are useful for exposing obvious races.

## Best practices

- Keep the `AtomicLong` field `private final`.
- Use intention-revealing names like `requestCount`, `nextId`, or `retryAttempts`.
- Prefer `incrementAndGet()`, `addAndGet()`, `updateAndGet()`, and `compareAndSet()` over manual `get()` plus `set()`.
- Do not expose the `AtomicLong` itself from your class. Expose methods that describe the allowed operations.
- Keep functions passed to `updateAndGet()` and `getAndUpdate()` side-effect-free.
- Use `LongAdder` for hot counters used only for statistics.
- Use locks or immutable state objects when multiple values must change together.

## Summary

`AtomicLong` makes updates to a single `long` value atomic. It is often simpler than a lock for counters and small numeric state, but it is not a magic thread-safety wrapper for an entire object.

The practical rule is:

- use `AtomicLong` for exact single-value state
- use `LongAdder` for high-throughput metrics counters
- use a lock or a higher-level abstraction when a whole group of values must stay consistent
