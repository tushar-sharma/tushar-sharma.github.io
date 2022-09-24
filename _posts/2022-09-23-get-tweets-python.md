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


Next we need to authenticate with twitter


```python
def setup_auth() -> tweepy:
    """
    Set up authentication with twitter
    """
    consumer_key = ""
    consumer_secret = ""
    access_key = "" 
    access_secret = ""

    auth = tweepy.OAuthHandler(consumer_key, consumer_secret)
    auth.set_access_token(access_key, access_secret)
    api = tweepy.API(auth)
    
    return api

```


Full code for the `tweets.py` 


```python
#!/usr/bin/env python
# encoding: utf-8

import tweepy #https://github.com/tweepy/tweepy
import csv
import codecs
import sys

def setup_auth() -> tweepy:
    """
    Set up authentication with twitter
    """
    consumer_key = ""
    consumer_secret = ""
    access_key = "" 
    access_secret = ""

    auth = tweepy.OAuthHandler(consumer_key, consumer_secret)
    auth.set_access_token(access_key, access_secret)
    api = tweepy.API(auth)
    
    return api


def get_tweets_by_profile(screen_name: str) -> None:
    """
    Get all tweets of a profile
    Twitter only allows access to a users most recent 3240 tweets with this method
    """
    
    print(f"Get tweets for the {screen_name}")

    api = setup_auth()

    all_tweets = []

    # make initial request for most recent tweets (200 is the maximum allowed count)
    new_tweets = api.user_timeline(screen_name = screen_name,count=200)

    # save most recent tweets
    all_tweets.extend(new_tweets)

    # save the id of the oldest tweet less one
    oldest = all_tweets[-1].id - 1

    # keep grabbing tweets until there are no tweets left to grab
    while len(new_tweets) > 0:
        print(f"getting tweets before {oldest}")

        #all subsiquent requests use the max_id param to prevent duplicates
        new_tweets = api.user_timeline(screen_name = screen_name,count=200,max_id=oldest)

        #save most recent tweets
        all_tweets.extend(new_tweets)

        #update the id of the oldest tweet less one
        oldest = all_tweets[-1].id - 1

        print(f"...{len(all_tweets)} tweets downloaded so far")

    # transform the tweepy tweets into a 2D array that will populate the csv
    outtweets = [[tweet.id_str, tweet.created_at, tweet.text] for tweet in all_tweets]

    #write the csv
    tweets_filename = "%s_tweets.csv" % screen_name

    with codecs.open(tweets_filename, 'w', 'utf-8') as f:
        writer = csv.writer(f)
        writer.writerow(["id","created_at","text"])
        writer.writerows(outtweets)


if __name__=="__main__":
    screen_name = sys.argv[1]
    
    get_tweets_by_profile(screen_name)
```