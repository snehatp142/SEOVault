import requests
from bs4 import BeautifulSoup
from urllib.parse import urlparse

def extract_backlinks(site_url):

    response = requests.get(site_url, timeout=10, verify=False)
    soup = BeautifulSoup(response.text, "html.parser")

    base_domain = urlparse(site_url).netloc
    backlinks = []

    for tag in soup.find_all("a", href=True):

        link = tag["href"]

        if link.startswith("http"):

            domain = urlparse(link).netloc

            if domain != base_domain:

                try:
                    r = requests.head(link, timeout=5, verify=False)

                    status = "valid" if r.status_code == 200 else "broken"

                except:
                    status = "broken"

                backlinks.append((link, status))

    return backlinks