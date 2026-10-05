from reportlab.lib.pagesizes import A4
from reportlab.pdfgen import canvas
from io import BytesIO

def generate_pdf_report(data):
    buffer = BytesIO()
    p = canvas.Canvas(buffer, pagesize=A4)

    y = 800
    for key, value in data.items():
        p.drawString(40, y, f"{key}: {value}")
        y -= 20

    p.showPage()
    p.save()

    buffer.seek(0)
    return buffer
import csv
from io import StringIO

def generate_csv_report(data):
    buffer = StringIO()
    writer = csv.writer(buffer)

    writer.writerow(["Metric", "Value"])
    for key, value in data.items():
        writer.writerow([key, value])

    buffer.seek(0)
    return buffer
