from rest_framework import serializers
from websites.models import Website, Page

class WebsiteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Website
        fields = ['id', 'domain', 'created_at']
        read_only_fields = ['created_at']


class PageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Page
        fields = ['id', 'website', 'url', 'last_checked']
        read_only_fields = ['last_checked']
