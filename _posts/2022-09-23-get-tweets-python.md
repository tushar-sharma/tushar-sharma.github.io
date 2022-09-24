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

def get_tweets_by_profile(profile_name: str) -> None:
    """
    Get all tweets of a profile
    """

    print(f"Get tweets for the {profile_name}")

if __name__=="__main__":
    profile_name = sys.argv[1]

    get_tweets_by_profile(profile_name)
```


Now lets create default `poetry` profile.

```bash
$ poetry init
$ poetry add tweepy
$ poetry run python tweets.py tshrocks
```

We haven't implemented anything, so it will just ouput `Get tweets for the tshrocks` to the console.