# SEOVault — Complete SEO Analyzer

A polished Angular + Django REST full-stack SEO analytics project based on the supplied project.

## Stack
- Angular 21 / TypeScript
- Django 4.2+ / Django REST Framework
- JWT authentication
- SQLite for local development
- BeautifulSoup + Requests for crawling and SEO checks
- ReportLab for PDF reports

## Project structure
- `seo_Frontend/seo-frontend` — Angular frontend
- `SEO_Project/seo-analyzer/seo_backend` — Django backend
- `SEO_Project/seo-analyzer/requirements.txt` — Python dependencies

## Run backend

```bash
cd SEO_Project/seo-analyzer
python -m venv venv

# Windows
venv\Scripts\activate

# macOS/Linux
source venv/bin/activate

pip install -r requirements.txt
cd seo_backend
python manage.py migrate
python manage.py runserver
```

Backend API: `http://127.0.0.1:8000/api/`

## Run frontend

Use Node.js 20+ (or the Angular-compatible current LTS version).

```bash
cd seo_Frontend/seo-frontend
npm install
npm start
```

Frontend: `http://localhost:4200/`

## Main workflow

1. Register an account.
2. Sign in.
3. Add a website.
4. Run a crawl.
5. Run an SEO audit.
6. Check performance.
7. Generate keyword suggestions and track keywords.
8. Open a page in the project view and generate SEO content suggestions.
9. Export PDF/CSV audit reports.

## Important development notes

- The frontend API base URL is currently `http://127.0.0.1:8000/api` in `src/app/services/api.ts`.
- The delivered package intentionally excludes `node_modules`, Angular cache/build output, Python virtual environments and the local SQLite database. Run `npm install` and `pip install -r requirements.txt`.
- The uploaded source contained Windows-specific `node_modules`; those were not included because they are not portable to Linux/macOS.
- Django production settings should use environment variables for the secret key, allowed hosts and OpenAI key.
