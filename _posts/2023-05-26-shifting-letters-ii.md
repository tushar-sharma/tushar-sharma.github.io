---
published: false
---

### Brute Force Attempt

```java
class Solution {
    public String shiftingLetters(String s, int[][] shifts) {
        StringBuilder sb = new StringBuilder(s);

        for(int i = 0; i < shifts.length; i++){
            int direction = (shifts[i][2] == 1) ? 1 : -1;

            for (int j = shifts[i][0]; j <= shifts[i][1]; j++){
                int ascii = sb.charAt(j) + direction;
                if (ascii > 122){
                    ascii = 97;
                }
                if (ascii < 97){
                    ascii = 122;
                }
                char asciiChar = (char) ascii;
                sb.setCharAt(j, asciiChar);

            }
        }

        return sb.toString();
        
    }
}
```
