from rest_framework import serializers
from backlinks.models import Backlink

class BacklinkSerializer(serializers.ModelSerializer):
    class Meta:
        model = Backlink
        fields = ['id', 'url', 'status', 'checked_at']