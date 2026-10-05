
from rest_framework import serializers
from pages.models import Page
class PageSerializer(serializers.ModelSerializer):
    class Meta:
        model=Page
        fields="__all__"
        read_only_fields=["id","created_at","website"]
