from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from django.utils import timezone

from pages.models import Page
from content_optimizer.models import ContentOptimization
from content_optimizer.serializers import ContentOptimizationSerializer
from content_optimizer.utils import generate_content_suggestion


# Generate SEO suggestion
@api_view(["POST"])
@permission_classes([IsAuthenticated])
def generate_suggestion(request):

    page_id = request.data.get("page_id")
    keyword = request.data.get("keyword")

    if not page_id or not keyword:
        return Response(
            {"error": "page_id and keyword required"},
            status=status.HTTP_400_BAD_REQUEST
        )

    try:
        page = Page.objects.get(id=page_id, website__user=request.user)
    except Page.DoesNotExist:
        return Response(
            {"error": "Page not found"},
            status=status.HTTP_404_NOT_FOUND
        )

    suggestion = generate_content_suggestion(
        page.title,
        page.meta_description,
        page.content,
        keyword
    )

    record = ContentOptimization.objects.create(
        website=page.website,
        page=page,
        original_title=page.title,
        original_meta=page.meta_description,
        original_content=page.content,
        suggested_title=suggestion["title"],
        suggested_meta=suggestion["meta"],
        suggested_content=suggestion["content"]
    )

    return Response(
        ContentOptimizationSerializer(record).data,
        status=status.HTTP_201_CREATED
    )


# Edit suggestion
@api_view(["PUT"])
@permission_classes([IsAuthenticated])
def edit_suggestion(request, opt_id):

    try:
        optimization = ContentOptimization.objects.get(
            id=opt_id,
            website__user=request.user
        )
    except ContentOptimization.DoesNotExist:
        return Response(
            {"error": "Optimization record not found"},
            status=status.HTTP_404_NOT_FOUND
        )

    optimization.final_title = request.data.get("title")
    optimization.final_meta = request.data.get("meta")
    optimization.final_content = request.data.get("content")
    optimization.status = "edited"
    optimization.save()

    return Response({
        "message": "Suggestion updated successfully"
    })


# Approve and apply content
@api_view(["POST"])
@permission_classes([IsAuthenticated])
def approve_and_apply(request, opt_id):

    try:
        optimization = ContentOptimization.objects.get(
            id=opt_id,
            website__user=request.user
        )
    except ContentOptimization.DoesNotExist:
        return Response(
            {"error": "Optimization not found"},
            status=status.HTTP_404_NOT_FOUND
        )

    page = optimization.page

    page.title = optimization.final_title or optimization.suggested_title
    page.meta_description = optimization.final_meta or optimization.suggested_meta
    page.content = optimization.final_content or optimization.suggested_content
    page.save()

    optimization.status = "applied"
    optimization.approved_by = request.user
    optimization.approved_at = timezone.now()
    optimization.save()

    return Response({
        "message": "Content applied successfully"
    })


# Approve suggestion
@api_view(["POST"])
@permission_classes([IsAuthenticated])
def approve_optimization(request):

    optimization_id = request.data.get("id")

    if not optimization_id:
        return Response(
            {"error": "Optimization ID required"},
            status=status.HTTP_400_BAD_REQUEST
        )

    try:
        optimization = ContentOptimization.objects.get(
            id=optimization_id,
            website__user=request.user
        )
    except ContentOptimization.DoesNotExist:
        return Response(
            {"error": "Optimization not found"},
            status=status.HTTP_404_NOT_FOUND
        )

    optimization.final_title = optimization.suggested_title
    optimization.final_meta = optimization.suggested_meta
    optimization.final_content = optimization.suggested_content

    optimization.status = "approved"
    optimization.approved_by = request.user
    optimization.save()

    return Response({
        "message": "Content approved successfully"
    })