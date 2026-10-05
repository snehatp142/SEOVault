
from rest_framework import viewsets, permissions, serializers
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from pages.models import Page
from pages.serializers import PageSerializer
from websites.models import Website
import requests, urllib3
from bs4 import BeautifulSoup
from urllib.parse import urljoin, urlparse
urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)

class PageViewSet(viewsets.ModelViewSet):
    serializer_class=PageSerializer
    permission_classes=[permissions.IsAuthenticated]
    def get_queryset(self):
        qs=Page.objects.filter(website__user=self.request.user)
        website=self.request.query_params.get("website")
        return qs.filter(website_id=website) if website else qs
    def perform_create(self,serializer):
        website_id=self.request.data.get("website")
        try: website=Website.objects.get(id=website_id,user=self.request.user)
        except Website.DoesNotExist: raise serializers.ValidationError({"website":"Invalid website"})
        serializer.save(website=website)

@api_view(["POST"])
@permission_classes([IsAuthenticated])
def fetch_pages(request):
    website_id=request.data.get("website_id")
    if not website_id:return Response({"error":"website_id required"},status=400)
    try: website=Website.objects.get(id=website_id,user=request.user)
    except Website.DoesNotExist:return Response({"error":"Website not found"},status=404)
    try:
        res=requests.get(website.domain,verify=False,timeout=12,headers={"User-Agent":"SEOVaultBot/1.0"})
        res.raise_for_status(); soup=BeautifulSoup(res.text,"html.parser")
        base_host=urlparse(website.domain).netloc
        seen=set(); added=0
        for link in soup.find_all("a",href=True):
            full=urljoin(website.domain,link["href"]).split("#")[0]
            parsed=urlparse(full)
            if parsed.scheme not in ("http","https") or parsed.netloc!=base_host or full in seen: continue
            seen.add(full)
            page=Page.objects.filter(website=website,url=full).first()
            if not page:
                Page.objects.create(website=website,url=full,title=link.get_text(" ",strip=True)[:255] or full,meta_description="",content="")
                added+=1
        # Always retain the homepage as a page.
        if not Page.objects.filter(website=website,url=website.domain).exists():
            Page.objects.create(website=website,url=website.domain,title=(soup.title.string.strip() if soup.title and soup.title.string else website.domain),meta_description=(soup.find("meta",attrs={"name":"description"}).get("content","") if soup.find("meta",attrs={"name":"description"}) else ""),content=soup.get_text(" ",strip=True)[:10000])
            added+=1
        return Response({"message":"Crawling completed","pages_added":added})
    except requests.RequestException as exc:
        return Response({"error":f"Could not reach website: {exc}"},status=502)
