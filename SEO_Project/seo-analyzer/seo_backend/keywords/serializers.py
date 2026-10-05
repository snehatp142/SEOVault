from rest_framework import serializers
from keywords.models import Keyword

class KeywordSerializer(serializers.ModelSerializer):
    class Meta:
        model = Keyword
        fields = "__all__"
        read_only_fields = ["created_at"]
