---
published: true
---
## Import Tweets to Google Sheet Using Python

Lets implement `get_tweets` method.

```python
import tweepy
import csv
import codecs
import sys

## Fill this with your credentials
consumer_key = "" # API key
consumer_secret = ""
access_key = "301777598-" # access token
access_secret = "" #acces token secret

def get_tweets(screen_name: str):
    ## authorize twitter
    auth = tweepy.OAuthHandler(consumer_key, consumer_secret)
    auth.set_access_token(access_key, access_secret)
    api = tweepy.API(auth)
    
    
        #initialize a list to hold all the tweepy Tweets
    alltweets = []

    ## make initial request for most recent tweets (200 is the maximum allowed count)
    new_tweets = api.user_timeline(screen_name = screen_name,count=200)

    ## save most recent tweets
    alltweets.extend(new_tweets)

    #save the id of the oldest tweet less one
    oldest = alltweets[-1].id - 1

    #keep grabbing tweets until there are no tweets left to grab
    while len(new_tweets) > 0:
        print(f"getting tweets before {oldest}")

        #all subsiquent requests use the max_id param to prevent duplicates
        new_tweets = api.user_timeline(screen_name = screen_name,count=200,max_id=oldest)

        #save most recent tweets
        alltweets.extend(new_tweets)

        #update the id of the oldest tweet less one
        oldest = alltweets[-1].id - 1

        print(f"...{len(alltweets)} tweets downloaded so far")

    #transform the tweepy tweets into a 2D array that will populate the csv
    outtweets = [[tweet.id_str, tweet.created_at, tweet.text] for tweet in alltweets]

    #write the csv
    tweets_filename = "%s_tweets.csv" % screen_name

    with codecs.open(tweets_filename, 'w', 'utf-8') as f:
        writer = csv.writer(f)
        writer.writerow(["id","created_at","text"])
        writer.writerows(outtweets)
        

if __name__=="__main__":
    try:
        screen_name = sys.argv[1]
        get_tweets(screen_name)
    except:
        traceback.format_exc()

```
