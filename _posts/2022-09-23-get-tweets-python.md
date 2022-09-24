---
published: false
---
## Get Tweets from twitter using Python

```bash
$ mkdir get-tweets
$ cd get-tweets
$ touch tweets.py
```

Now we will edit the `tweets.py`

```python
#!/usr/bin/env python
# encoding: utf-8

import tweepy #https://github.com/tweepy/tweepy
import csv
import codecs
import sys

def get_tweets_by_profile(profile_name: str) -> None
    """
    Get all tweets of a profile
    """

if __name__ == "__main__:
    profile_name = sys.argv[1]
    
    get_tweets_by_profile(profile_name)
```
