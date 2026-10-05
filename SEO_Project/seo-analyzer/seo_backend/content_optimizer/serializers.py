from rest_framework import serializers
from content_optimizer.models import ContentOptimization

class ContentOptimizationSerializer(serializers.ModelSerializer):
    class Meta:
        model = ContentOptimization
        fields = "__all__"
