from django.shortcuts import render
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from websites.models import Website
from backlinks.models import Backlink
from backlinks.utils import extract_backlinks
from backlinks.serializer import BacklinkSerializer  # Make sure this exists

@api_view(["POST"])
@permission_classes([IsAuthenticated])
def scan_backlinks(request):

    website_id = request.data.get("website_id")

    try:
        website = Website.objects.get(id=website_id, user=request.user)
    except Website.DoesNotExist:
        return Response({"error":"Website not found"}, status=404)

    # delete old backlinks
    Backlink.objects.filter(website=website).delete()

    # extract backlinks
    links = extract_backlinks(website.domain)

    for url, status in links:

        Backlink.objects.create(
            website=website,
            url=url,
            status=status
        )

    return Response({"message": "Backlink scan completed"})
@api_view(["GET"])
@permission_classes([IsAuthenticated])
def list_backlinks(request, website_id):
    """
    List all backlinks for a given website.
    """
    try:
        website = Website.objects.get(id=website_id, user=request.user)
    except Website.DoesNotExist:
        return Response({"error": "Website not found"}, status=404)

    backlinks = Backlink.objects.filter(website=website)
    serializer = BacklinkSerializer(backlinks, many=True)
    return Response(serializer.data)
