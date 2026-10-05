from rest_framework import serializers
from seo_audit.models import SEOAudit

class SEOAuditSerializer(serializers.ModelSerializer):
    class Meta:
        model = SEOAudit
        fields = "__all__"
