
import requests,time,urllib3
urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)
def check_page_speed(url):
    start=time.time()
    try:
        response=requests.get(url,timeout=12,headers={"User-Agent":"SEOVaultBot/1.0"},verify=False)
        elapsed=time.time()-start
        if response.status_code>=400:return 0
        # Simple application-level score: lower response time => higher score.
        return max(1,min(100,round(100-(elapsed*20))))
    except requests.RequestException:return 0
