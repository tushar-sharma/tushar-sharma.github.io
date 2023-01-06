---
published: false
---
A simple GET request to a endpoint in python 

```python
import urllib3

url = '#' 
http = urllib3.PoolManager()

try:
    response = http.request('GET', url)
    print(response.data, response.status)
except urlib3.exceptions.HTTPError as e:
    print('Request Failed:', e.reason)
```