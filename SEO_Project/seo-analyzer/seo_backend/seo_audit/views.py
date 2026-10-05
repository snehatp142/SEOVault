import requests
from bs4 import BeautifulSoup

from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status

from websites.models import Website
from seo_audit.models import SEOAudit
from seo_audit.serializers import SEOAuditSerializer


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def analyze_seo(request):
    website_id = request.data.get("website_id")

    if not website_id:
        return Response(
            {"error": "website_id is required"},
            status=status.HTTP_400_BAD_REQUEST
        )

    # Check website ownership
    try:
        website = Website.objects.get(
            id=website_id,
            user=request.user
        )
    except Website.DoesNotExist:
        return Response(
            {"error": "Website not found"},
            status=status.HTTP_404_NOT_FOUND
        )

    try:
        response = requests.get(
            website.domain,
            headers={"User-Agent": "Mozilla/5.0"},
            timeout=10
        )

        cloudflare_blocked = response.status_code in [403, 429]

        if cloudflare_blocked:
            audit = SEOAudit.objects.create(
                website=website,
                is_accessible=False,
                cloudflare_blocked=True,
                seo_score=0
            )
            return Response(SEOAuditSerializer(audit).data)

        soup = BeautifulSoup(response.text, "html.parser")

        # TITLE
        title = soup.title.text.strip() if soup.title else ""

        # META DESCRIPTION
        meta = soup.find("meta", attrs={"name": "description"})
        meta_description = meta.get("content", "").strip() if meta else ""

        # H1 CHECK
        has_h1 = bool(soup.find("h1"))

        # IMAGE ALT CHECK
        images = soup.find_all("img")
        total_images = len(images)
        images_missing_alt = sum(
            1 for img in images if not img.get("alt")
        )

        # SEO SCORE + SUGGESTIONS
        score = 0
        suggestions = []

        if title:
            score += 25
        else:
            suggestions.append("Add title tag")

        if meta_description:
            score += 25
        else:
            suggestions.append("Add meta description")

        if has_h1:
            score += 25
        else:
            suggestions.append("Add at least one H1 tag")

        if images_missing_alt == 0:
            score += 25
        else:
            suggestions.append("Add alt text to images")

        # Save audit
        audit = SEOAudit.objects.create(
            website=website,
            title=title,
            meta_description=meta_description,
            has_h1=has_h1,
            total_images=total_images,
            images_missing_alt=images_missing_alt,
            seo_score=score
        )

        return Response({
            "audit": SEOAuditSerializer(audit).data,
            "suggestions": suggestions,
            "status": "SEO analysis completed"
        })

    except requests.exceptions.RequestException:
        audit = SEOAudit.objects.create(
            website=website,
            is_accessible=False,
            seo_score=0
        )
        return Response(SEOAuditSerializer(audit).data)
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status

from websites.models import Website
from seo_audit.models import SEOAudit
from seo_audit.serializers import SEOAuditSerializer


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def seo_audit_history(request, website_id):
    try:
        website = Website.objects.get(
            id=website_id,
            user=request.user
        )
    except Website.DoesNotExist:
        return Response(
            {"error": "Website not found"},
            status=status.HTTP_404_NOT_FOUND
        )

    audits = SEOAudit.objects.filter(
        website=website
    ).order_by("-created_at")

    serializer = SEOAuditSerializer(audits, many=True)
    return Response(serializer.data)
