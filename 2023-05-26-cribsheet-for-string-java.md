
### Cribsheet for String in java

Strings are immutable in java. It's best to convert string to StringBuilder/StringBuffer so that it's memory efficient while string manipulation.

```java
// Convert to StringBuilder
String input = "abcde";
StringBuilder sb = new StringBuidler(input);

// Convert back to String
String sbString = sb.toString();

// Get a character at index 1
char c = sb.charAt(1);

// Modify at index 1
sb.setCharAt(1, 'z');

// Get ASCII value of 'a' at index 0
int asciiA = sb.charAt(0); 
assert asciiA == 97;

// Get ASCII value of 'z' at index 1
int asciiZ = sb.charAt(1); 
assert asciiZ == 122;

// Get character from ASCII value
char c = (char) asciiA; 
assert c == 'a';
```


