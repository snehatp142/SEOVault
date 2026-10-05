from django.shortcuts import render

# Create your views here.
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status

from websites.models import Website
from keywords.models import Keyword
from keywords.serializers import KeywordSerializer
from keywords.utils import get_related_keywords  # For automatic suggestions

# Add keyword manually
@api_view(["POST"])
@permission_classes([IsAuthenticated])
def add_keyword(request):
    website_id = request.data.get("website_id")
    keyword_text = request.data.get("keyword")

    if not website_id or not keyword_text:
        return Response({"error": "website_id and keyword are required"}, status=status.HTTP_400_BAD_REQUEST)

    try:
        website = Website.objects.get(id=website_id, user=request.user)
    except Website.DoesNotExist:
        return Response({"error": "Website not found"}, status=status.HTTP_404_NOT_FOUND)

    keyword = Keyword.objects.create(website=website, keyword=keyword_text)
    return Response(KeywordSerializer(keyword).data, status=status.HTTP_201_CREATED)

# List keywords
@api_view(["GET"])
@permission_classes([IsAuthenticated])
def list_keywords(request, website_id):
    keywords = Keyword.objects.filter(website__id=website_id, website__user=request.user)
    serializer = KeywordSerializer(keywords, many=True)
    return Response(serializer.data)

# Automatic suggestions
# @api_view(["GET"])
# @permission_classes([IsAuthenticated])
# def suggest_keywords(request):
#     base_keyword = request.query_params.get("keyword")
#     if not base_keyword:
#         return Response({"error": "keyword parameter is required"}, status=status.HTTP_400_BAD_REQUEST)

#     suggestions = get_related_keywords(base_keyword)
#     return Response({"suggestions": suggestions})
from rest_framework.decorators import api_view
from rest_framework.response import Response
from keywords.utils import get_related_keywords



    
    
# @api_view(["POST"])
# def suggest_keywords(request):
#     keyword = request.data.get("keyword")

#     if not keyword:
#         return Response({"error": "keyword required"})

#     suggestions = get_related_keywords(keyword)

#     return Response({
#         "keyword": keyword,
#         "suggestions": suggestions
#     })




@api_view(["POST"])
@permission_classes([IsAuthenticated])
def suggest_keywords(request):

    website_id = request.data.get("website_id")
    keyword = request.data.get("keyword")

    if not website_id or not keyword:
        return Response({"error": "website_id and keyword required"}, status=400)

    try:
        website = Website.objects.get(id=website_id, user=request.user)
    except Website.DoesNotExist:
        return Response({"error": "Website not found"}, status=404)

    suggestions = get_related_keywords(keyword)

    saved_keywords = []

    for k in suggestions:
        obj = Keyword.objects.create(
            website=website,
            keyword=k
        )
        saved_keywords.append(obj.keyword)

    return Response({
        "keyword": keyword,
        "saved_keywords": saved_keywords
    })
    
    
    
    