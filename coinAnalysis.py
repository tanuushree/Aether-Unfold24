from fastapi import FastAPI
from pydantic import BaseModel
from datetime import datetime
import json
import requests
from groq import Groq
import urllib
import snscrape.modules.twitter as sntwitter



app = FastAPI()

apikeygnews = "700a81009679b83ba578edd88ace6e6a"
apikeygroq = "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"
client = Groq(
    api_key=apikeygroq,
)

def get_sentiment(query):
    API_URL = "https://api-inference.huggingface.co/models/cardiffnlp/twitter-roberta-base-sentiment-latest"
    headers = {"Authorization": "Bearer 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"}

    response = requests.post(API_URL, headers=headers, json={"inputs": query})
    ex = response.json()
    sent = ex[0]

    sentiment_values = {'positive': 1, 'neutral': 0, 'negative': -1}
    weighted_score = sum(sentiment_values[item['label']] * item['score'] for item in sent)

    return weighted_score

def getoutput(topic):
    print(datetime.now())
    url = f"https://gnews.io/api/v4/search?q={topic}&lang=en&max=5&apikey={apikeygnews}&from=2024-11-01T00:00:00Z".replace(" ", "%20")
    print(url)
    with urllib.request.urlopen(url) as response:
        data = json.loads(response.read().decode("utf-8"))
        values = []
        sentiments = []
        overall = 0
        articles = data["articles"]
        for i in range(len(articles)):
            print(articles[i])
            print(f"Title: {articles[i]['title']}")
            print(f"Description: {articles[i]['description']}")
            chat_completion = client.chat.completions.create(
                messages=[
                    {
                        "role": "user",
                        "content": f"{articles[i]['title']}:  {articles[i]['description']}  is a news article description on the topic of {topic}. Give a number which is either 0 or 1 to denote how relevant or influential it is on the stock value of {topic}. Give nothing else other than 0 or 1",
                    }
                ],
                model="llama3-8b-8192",
                stream=False,
            )
            sentiment = get_sentiment(articles[i]['description'])
            sentiments.append(sentiment)
            print(f"Sentiment: {sentiment}")
            print(f"Relevance: {chat_completion.choices[0].message.content}")
            values.append(int(chat_completion.choices[0].message.content))
            overall = overall + int(chat_completion.choices[0].message.content) * sentiment
        #relevance_overall = sum(values) / len(values)
        #sentiment_overall = sum(sentiments) / len(sentiments)
        c = sum(values)
        if c==0:
            c = 1
        overall = overall / c
        print(overall)
        if overall > 0.65:
            return "buy"
        elif overall < -0.65:
            return "sell"
        else: 
            return "hold"
        
def attempt(query):
    for tweet in sntwitter.TwitterSearchScraper(query).get_items():
        print(vars(tweet))

@app.get("/analyze-topic/")
def analyze_topic(topic: str):
    """
    Endpoint to analyze a topic.
    """
    try:
        #result = getoutput(topic)
        #return {"topic": topic, "result": result}
        attempt(topic)
    except Exception as e:
        return {"error": str(e)}
