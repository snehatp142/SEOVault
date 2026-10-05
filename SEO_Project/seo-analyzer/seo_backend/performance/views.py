from django.shortcuts import render
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from websites.models import Website
from performance.models import Performance
from performance.utils import check_page_speed


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def track_performance(request):
    website_id = request.data.get("website_id")

    try:
        website = Website.objects.get(
            id=website_id,
            user=request.user
        )
    except Website.DoesNotExist:
        return Response({"error": "Website not found"}, status=404)

    # Get page speed
    speed = check_page_speed(website.domain)

    # Temporary SEO score
    seo_score = 75

    # Decide status
    if seo_score >= 80:
        status = "good"
    elif seo_score >= 50:
        status = "average"
    else:
        status = "poor"

    # Save performance
    Performance.objects.create(
        website=website,
        page_speed=speed,
        seo_score=seo_score,
        status=status
    )

    return Response({
        "speed": speed,
        "seo_score": seo_score,
        "status": status
    })


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def performance_history(request, website_id):

    data = Performance.objects.filter(
        website__id=website_id,
        website__user=request.user
    ).order_by("-checked_at")

    result = []

    for p in data:
        result.append({
            "speed": p.page_speed,
            "seo_score": p.seo_score,
            "status": p.status,
            "date": p.checked_at
        })

    return Response(result)