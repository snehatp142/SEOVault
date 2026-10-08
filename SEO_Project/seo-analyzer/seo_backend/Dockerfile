FROM python:3.12-slim

WORKDIR /app

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

COPY production-requirements.txt .

RUN pip install --no-cache-dir -r production-requirements.txt

COPY . .

RUN python manage.py migrate

EXPOSE 8000

CMD ["gunicorn", "seo_backend.wsgi:application", "--bind", "0.0.0.0:8000", "--workers", "3"]