
from django.http import FileResponse,HttpResponse
from rest_framework.decorators import api_view,permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from websites.models import Website
from seo_audit.models import SEOAudit
from reports.utils import generate_pdf_report,generate_csv_report

def get_report_data(website):
    audit=SEOAudit.objects.filter(website=website).order_by("-created_at").first()
    if not audit:return None
    return {"Website":website.domain,"Title":audit.title,"Meta Description":audit.meta_description,"Has H1":audit.has_h1,"Total Images":audit.total_images,"Images Missing Alt":audit.images_missing_alt,"SEO Score":audit.seo_score}

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def pdf_report(request,website_id):
    try: website=Website.objects.get(id=website_id,user=request.user)
    except Website.DoesNotExist:return Response({"error":"Website not found"},status=404)
    data=get_report_data(website)
    if not data:return Response({"error":"Run an SEO audit before exporting a report."},status=400)
    return FileResponse(generate_pdf_report(data),as_attachment=True,filename="seo_report.pdf")

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def csv_report(request,website_id):
    try: website=Website.objects.get(id=website_id,user=request.user)
    except Website.DoesNotExist:return Response({"error":"Website not found"},status=404)
    data=get_report_data(website)
    if not data:return Response({"error":"Run an SEO audit before exporting a report."},status=400)
    response=HttpResponse(generate_csv_report(data),content_type="text/csv");response["Content-Disposition"]="attachment; filename=seo_report.csv";return response
