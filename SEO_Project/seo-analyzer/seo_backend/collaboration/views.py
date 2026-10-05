from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import get_object_or_404
from websites.models import Website
from collaboration.models import TeamMember, CollaborationNote
from django.contrib.auth import get_user_model

User = get_user_model()

# Allowed roles for team members
ALLOWED_ROLES = ["admin", "editor", "viewer"]


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def add_team_member(request):
    """
    Add a user as a team member to a website.
    Only the owner of the website can add members.
    """
    website_id = request.data.get("website_id")
    user_id = request.data.get("user_id")
    role = request.data.get("role")

    if not website_id or not user_id or not role:
        return Response(
            {"error": "website_id, user_id, and role are required"},
            status=status.HTTP_400_BAD_REQUEST
        )

    if role not in ALLOWED_ROLES:
        return Response(
            {"error": f"Role must be one of {ALLOWED_ROLES}"},
            status=status.HTTP_400_BAD_REQUEST
        )

    # Validate website ownership
    website = get_object_or_404(Website, id=website_id, user=request.user)
    user = get_object_or_404(User, id=user_id)

    if TeamMember.objects.filter(website=website, user=user).exists():
        return Response(
            {"error": "User is already a team member"},
            status=status.HTTP_400_BAD_REQUEST
        )

    team_member = TeamMember.objects.create(
        website=website,
        user=user,
        role=role
    )

    return Response({
        "message": "Team member added",
        "team_member_id": team_member.id,
        "website": website.domain,  # Use the correct field from Website model
        "user": user.username,
        "role": role
    }, status=status.HTTP_201_CREATED)


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def add_note(request):
    website_id = request.data.get("website_id")
    note = request.data.get("note")

    if not website_id or not note:
        return Response({"error": "website_id and note are required"},
                        status=status.HTTP_400_BAD_REQUEST)

    website = get_object_or_404(Website, id=website_id)

    # Only owner or team member can add notes
    if website.user != request.user and not TeamMember.objects.filter(website=website, user=request.user).exists():
        return Response({"error": "You are not allowed to add notes to this website"},
                        status=status.HTTP_403_FORBIDDEN)

    collab_note = CollaborationNote.objects.create(
        website=website,
        user=request.user,
        note=note
    )

    return Response({
        "message": "Note added",
        "note_id": collab_note.id,
        "website": str(website),  # safer way
        "user": request.user.username,
        "note": note
    }, status=status.HTTP_201_CREATED)

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def list_notes(request, website_id):
    website = get_object_or_404(Website, id=website_id)

    # Only owner or team member can view notes
    if website.user != request.user and not TeamMember.objects.filter(website=website, user=request.user).exists():
        return Response({"error": "You are not allowed to view notes for this website"},
                        status=status.HTTP_403_FORBIDDEN)

    notes = CollaborationNote.objects.filter(website=website).order_by("-created_at")

    data = [
        {
            "user": n.user.username if n.user else "Deleted",
            "note": n.note,
            "date": n.created_at.strftime("%Y-%m-%d %H:%M:%S")
        }
        for n in notes
    ]

    return Response({"website": str(website), "notes": data}, status=status.HTTP_200_OK)