---
layout: post
title: "Go for DevOps by John Doak and David Justice"
skipImage: true
author: tushar sharma
category: blog
image: https://unsplash.com/photos/H2K8EFcIfWs/download?w=437
thumb: https://unsplash.com/photos/H2K8EFcIfWs/download?w=437
book_notes: true
tags:
  - books
  - devops
  - go
---

These are my learning notes and reflections while reading *Go for DevOps* by John Doak and David Justice. I plan to update this periodically as I progress through the book.<!-- truncate_here -->

<!-- disclaimer -->
<div class="book-notes-disclaimer">
  These are my rough notes while reading the book.
</div>

---

## Nov 20, 2026

### Packages

A Go package is a collection of related `.go` files in the same directory. All regular Go files in that directory normally declare the same package name, although the package name does not have to match the directory name.

```text
go-repo/
├── package1/
│   └── lib1.go
├── package2/
│   └── lib2.go
└── main.go
```

For example, `package1/lib1.go` can declare:

```go
package package1
```

An executable Go program uses `package main` and defines a `main` function as its entry point:

```go
package main

func main() {
}
```

A repository can contain multiple `package main` directories and therefore produce multiple binaries.

### Compilation

Go uses ahead-of-time (AOT) compilation: source code is compiled into native machine code before the program runs. The resulting executable is built for a specific operating system and CPU architecture, but Go makes cross-compilation straightforward. Go's runtime—including garbage collection and goroutine scheduling—is included in the executable.

Java commonly compiles source code into platform-independent bytecode. A JVM then interprets that bytecode or uses just-in-time (JIT) compilation to turn frequently executed code into native machine code. This allows the same bytecode to run anywhere with a compatible JVM, but it requires that JVM at runtime. Java can also use AOT compilation to produce a platform-specific native executable when faster startup or a smaller runtime footprint is preferred.

gRPC services are often I/O-bound because they spend much of their time waiting for network requests and responses. Go is a good fit for these services because goroutines make concurrent I/O straightforward, while native binaries provide fast startup and simple deployment. AOT compilation alone does not make gRPC faster; application design, networking, serialization, and any CPU-intensive work still matter.

Both Go and Java compilers parse source code into an abstract syntax tree (AST). Static typing is a separate concept: it lets the compiler check types before the program runs.

In short:

- Go follows **write once, compile for each target**.
- Java commonly follows **compile once, run on any compatible JVM**, but AOT compilation is also available.

> machine code is literally just raw CPU instructions

### Static and dynamic typing

- **Static typing:** Types are checked at compile time. Go and Java are statically typed.
- **Dynamic typing:** Types are checked at runtime. Python is dynamically typed and also uses duck typing, where an object's supported behavior matters more than its declared type.

Python allows a variable to refer to values of different types:

```python
foo = 23
foo = "hello"

def square(x):
    return x * x

square(foo)
```

This code is syntactically valid, but `square(foo)` raises a runtime `TypeError` because Python cannot multiply one string by another.

### Variables

In Go, `var` declares a variable. Declaring the same name twice in one scope fails at compile time:

```go
func foo() {
    var word = "hello"
    var word = "world" // compile error: word redeclared in this block
}
```

After declaring a variable, update it with `=`:

```go
func foo() {
    var word = "hello"
    word = "test"
}
```

The short declaration operator `:=` declares and initializes variables inside functions:

```go
func foo() {
    word := "test"
    word = "hello"
}
```

### Loops

Go uses `for` for counter loops:

```go
for i := 0; i < 10; i++ {
}
```

It also provides the equivalent of a `while` loop:

```go
isRunning := true
for isRunning {
    // Do something that may set isRunning to false.
}
```

An empty condition creates an infinite loop, which is useful for some long-running services:

```go
for {
    // Do something.
}
```

### Variable shadowing

An inner scope can declare a variable with the same name as one in an outer scope. The inner variable temporarily shadows the outer one:

```go
package main

import "fmt"

var word = "hello"

func main() {
    word := "test"
    fmt.Println(word) // test
    printWord()
}

func printWord() {
    fmt.Println(word) // hello
}
```
