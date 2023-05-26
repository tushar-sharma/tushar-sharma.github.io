
### Cribsheet for String in java

Strings are immutable in java. It's best to convert string to StringBuilder/StringBuffer so that it's memory efficient while string manipulation.

```java
// Convert to StringBuilder
String input = "abcde";
StringBuilder sb = new StringBuidler(input);

// Convert back to String
String sbString = sb.toString();
```


