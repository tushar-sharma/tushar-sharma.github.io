---
published: false
---
## Java Reflections

Reflection is the ability of a computer program to examine, inspect and modify its own behaviour at runtime. In particular, reflections in Java allows the inspection of classes, methods and fields during runtime, without having any knowledge of it during compile time.

From the Java Class API, we see that Class is a subclass of Object. Every unique Object is assigned an immutable Class object by the JVM. This immutable Class object is fundamentally different from instances of a class. The class object itself holds information such as its name and the package it resides in while an instance of a class holds the instanced values and methods as defined in the class.

https://www.baeldung.com/java-reflection
