from django.urls import path
from reports.views import pdf_report, csv_report

urlpatterns = [
    path("reports/pdf/<int:website_id>/", pdf_report),
    path("reports/csv/<int:website_id>/", csv_report),
]
