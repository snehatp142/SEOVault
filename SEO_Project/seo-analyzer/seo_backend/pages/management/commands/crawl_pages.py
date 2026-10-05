# import requests
# from bs4 import BeautifulSoup
# from django.core.management.base import BaseCommand
# from pages.models import Page
# from websites.models import Website
# from urllib.parse import urljoin

# class Command(BaseCommand):

#     def handle(self, *args, **kwargs):

#         website = Website.objects.first()
#         start_url = website.domain

#         visited = set()
#         urls_to_visit = [start_url]

#         while urls_to_visit:

#             url = urls_to_visit.pop()

#             if url in visited:
#                 continue

#             visited.add(url)

#             try:
#                 response = requests.get(url)
#                 soup = BeautifulSoup(response.text, "html.parser")

#                 title = soup.title.string if soup.title else ""

#                 meta = soup.find("meta", attrs={"name": "description"})
#                 meta_desc = meta["content"] if meta else ""

#                 content = soup.get_text()

#                 Page.objects.create(
#                     website=website,
#                     url=url,
#                     title=title,
#                     meta_description=meta_desc,
#                     content=content
#                 )

#                 for link in soup.find_all("a", href=True):
#                     next_url = urljoin(url, link["href"])

#                     if website.domain in next_url:
#                         urls_to_visit.append(next_url)

#             except Exception as e:
#                 print("Error:", e)

#         print("Crawling completed")




import requests
from bs4 import BeautifulSoup
from django.core.management.base import BaseCommand
from pages.models import Page
from websites.models import Website
from urllib.parse import urljoin

class Command(BaseCommand):

    def handle(self, *args, **kwargs):
        website = Website.objects.first()
        start_url = website.domain

        # Add your token here
        headers = {
            "Authorization": "Token abcd1234efgh5678"
        }

        visited = set()
        urls_to_visit = [start_url]

        while urls_to_visit:
            url = urls_to_visit.pop()
            if url in visited:
                continue
            visited.add(url)

            try:
                response = requests.get(url, headers=headers)
                soup = BeautifulSoup(response.text, "html.parser")

                title = soup.title.string if soup.title else ""
                meta = soup.find("meta", attrs={"name": "description"})
                meta_desc = meta["content"] if meta else ""
                content = soup.get_text()

                Page.objects.create(
                    website=website,
                    url=url,
                    title=title,
                    meta_description=meta_desc,
                    content=content
                )

                for link in soup.find_all("a", href=True):
                    next_url = urljoin(url, link["href"])
                    if website.domain in next_url:
                        urls_to_visit.append(next_url)

            except Exception as e:
                print("Error:", e)

        print("Crawling completed")