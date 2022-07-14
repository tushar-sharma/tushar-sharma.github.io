---
published: false
---
## Import Tweets to Google Sheet Using Python

First pass Twitter `username` that you need to downlaod tweets.

```python
if __name__=="__main__":
    try:
        username = sys.argv[1]
        get_tweets(username)
    except:
        traceback.format_exc()
```.
