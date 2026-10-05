from pytrends.request import TrendReq
import time


def get_related_keywords(base_keyword, limit=10):
    try:
        time.sleep(2)   # delay to avoid blocking

        pytrends = TrendReq(hl='en-US', tz=360)
        pytrends.build_payload([base_keyword], timeframe='today 12-m')

        related_queries = pytrends.related_queries()

        if base_keyword in related_queries:
            top = related_queries[base_keyword]['top']

            if top is not None:
                return top['query'].tolist()[:limit]

        return []

    except Exception as e:
        print("Keyword suggestion error:", e)
        return []