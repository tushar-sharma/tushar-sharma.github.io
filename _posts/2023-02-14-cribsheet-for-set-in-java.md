---
published: false
---
## Set

A set in Java is a collection that stores a unique set of elements. This means that there are no duplicates in a set. You can define set using HashSet, TreeSet, or LinkedHashSet.

```java
import java.util.set;

public class Test1{
    public static void main(String[] args){

        //create a set using HashSet
        Set<String> myHashSet = new HashSet<>();

        //create a set using TreeSet
        Set<String> myTreeSet = new TreeSet<>();

        //create a set using LinkedHashSet
        Set<String> myLinkedHashSet = new LinkedHashSet<>();
    }
}
```

