# SEOVault — SEO Analysis & Optimization Platform

SEOVault is a full-stack SEO analytics and optimization platform built with **Angular, Django REST Framework, and PostgreSQL**.

It allows users to manage websites, crawl web pages, perform SEO audits, track performance, manage keywords, analyze backlinks, generate AI-powered content suggestions, and export SEO reports.

## 🚀 Live Application

**Frontend:** https://seovault-frontend.onrender.com

**Backend API:** https://seovault.onrender.com

**GitHub:** https://github.com/snehatp142/SEOVault

---

## ✨ Features

- 🔐 User registration and JWT authentication
- 🌐 Website/project management
- 🕷️ Website crawling
- 🔎 SEO analysis and audit
- 📊 SEO audit history
- ⚡ Website performance tracking
- 🔑 Keyword management
- 💡 Keyword suggestions
- 🤖 AI-powered content generation
- 🔗 Backlink scanning
- 👥 Team collaboration
- 📝 Notes management
- 📄 PDF SEO reports
- 📊 CSV report export
- 📱 Responsive Angular interface

---

## 🛠️ Tech Stack

### Frontend

- Angular 21
- TypeScript
- HTML5
- CSS3
- RxJS
- Angular HTTP Client

### Backend

- Python
- Django 6.1.1
- Django REST Framework
- Simple JWT
- BeautifulSoup
- Requests
- Pandas
- ReportLab

### Database

- PostgreSQL
- SQLite for local development

### DevOps & Deployment

- Docker
- Nginx
- Gunicorn
- WhiteNoise
- Git
- GitHub
- Render

---

## 🏗️ Project Architecture

```text
SEOVault
│
├── SEO_Project
│   └── seo-analyzer
│       └── seo_backend
│           ├── accounts
│           ├── backlinks
│           ├── collaboration
│           ├── content_optimizer
│           ├── seo_backend
│           ├── manage.py
│           ├── Dockerfile
│           └── production-requirements.txt
│
├── seo_Frontend
│   └── seo-frontend
│       ├── src
│       ├── angular.json
│       ├── package.json
│       ├── Dockerfile
│       └── nginx.conf
│
├── .gitignore
└── README.md
```

---

## 🔄 Application Workflow

```text
User
  │
  ▼
Angular Frontend
  │
  │ REST API + JWT
  ▼
Django REST API
  │
  ├── Authentication
  ├── Website Management
  ├── Crawling
  ├── SEO Analysis
  ├── Keywords
  ├── Performance
  ├── AI Content
  └── Reports
  │
  ▼
PostgreSQL Database
```

---

## 🔐 Authentication

SEOVault uses **JWT authentication**.

After login, the access token is stored by the frontend and sent with protected API requests using:

```text
Authorization: Bearer <access-token>
```

Protected functionality includes website management, crawling, SEO analysis, keywords, performance tracking, and other user-specific operations.

---

# 💻 Local Development

## Backend Setup

Open Command Prompt and navigate to:

```cmd
cd C:\Users\SNEHA\Downloads\SEO_Analyzer_Pro_Complete\SEO_Analyzer_Pro\SEO_Project\seo-analyzer\seo_backend
```

Create a virtual environment:

```cmd
python -m venv venv
```

Activate it on Windows:

```cmd
venv\Scripts\activate
```

Install dependencies:

```cmd
pip install -r production-requirements.txt
```

Run migrations:

```cmd
python manage.py migrate
```

Start the Django server:

```cmd
python manage.py runserver
```

Backend:

```text
http://127.0.0.1:8000
```

API:

```text
http://127.0.0.1:8000/api/
```

---

## Frontend Setup

Navigate to the Angular project:

```cmd
cd seo_Frontend\seo-frontend
```

Install dependencies:

```cmd
npm install
```

Start Angular:

```cmd
npm start
```

Frontend:

```text
http://localhost:4200
```

---

# 🐳 Docker

SEOVault uses Docker containers for production deployment.

### Backend

The Django backend runs using:

```text
Python
+
Gunicorn
+
PostgreSQL
```

### Frontend

The Angular application is built and served using:

```text
Angular
+
Nginx
```

The frontend Docker image uses a multi-stage build:

```text
Node.js
   │
   ▼
Angular production build
   │
   ▼
Nginx
   │
   ▼
Production frontend
```

---

# ☁️ Production Deployment

SEOVault is deployed using **Render**.

### Frontend

```text
Angular → Docker → Nginx → Render
```

### Backend

```text
Django → Docker → Gunicorn → Render
```

### Database

```text
PostgreSQL → Render PostgreSQL
```

Environment variables are used for production configuration such as:

- Django secret key
- Database credentials
- Allowed hosts
- CORS configuration
- API configuration

Sensitive environment variables are **not stored in GitHub**.

---

# 🧪 Testing

The deployed application was tested through the production frontend and API.

Tested functionality includes:

- User authentication
- Website creation
- Website loading
- Website crawling
- Page retrieval
- SEO analysis
- AI content generation
- Keyword suggestions
- Keyword retrieval
- Performance tracking
- Performance history
- Angular routing
- Production API communication
- CORS configuration

Example successful production API responses included:

```text
Login              → 200
Website creation   → 201
Website retrieval  → 200
Crawl              → 200
SEO analysis       → 200
AI generation      → 201
Keyword suggestion → 200
Performance track  → 200
```

---

# 📊 Performance

The application was also checked using browser performance metrics.

Example production results:

```text
CLS  → 0
INP  → 88 ms
```

These results indicate good interaction and layout stability during the tested session.

---

# 🔒 Security

The project follows environment-based configuration for sensitive information.

The repository excludes files such as:

```text
.env
*.sqlite3
*.sqlite3.backup
data.json
venv/
node_modules/
dist/
```

Production secrets and database credentials are stored in Render environment variables rather than committed to GitHub.

---

# 📁 Important Files

### Backend

```text
seo_backend/manage.py
seo_backend/seo_backend/settings.py
seo_backend/seo_backend/wsgi.py
seo_backend/Dockerfile
seo_backend/production-requirements.txt
```

### Frontend

```text
seo-frontend/src/
seo-frontend/src/app/services/api.ts
seo-frontend/Dockerfile
seo-frontend/src/nginx.conf
seo-frontend/angular.json
seo-frontend/package.json
```

---

# 🔮 Future Improvements

Possible future improvements include:

- Advanced SEO keyword analytics
- Competitor analysis
- Improved backlink intelligence
- Scheduled website audits
- Advanced SEO dashboards
- More AI-powered optimization features
- Automated testing
- CI/CD pipeline
- Improved monitoring and logging

---

# 👩‍💻 Developer

**Sneha T.**

B.Tech Computer Science Engineering

### Profiles

- GitHub: https://github.com/snehatp142
- Portfolio: https://snehatp142.github.io/portfolio
- LinkedIn: https://www.linkedin.com/in/sneha-softwaredeveloper/

---

## 📌 Project Summary

SEOVault demonstrates a complete full-stack development workflow:

```text
Frontend Development
        ↓
REST API Integration
        ↓
Backend Development
        ↓
Database Integration
        ↓
Authentication
        ↓
Dockerization
        ↓
Git & GitHub
        ↓
Production Deployment
        ↓
Testing & Validation
```

This project was developed to demonstrate practical experience in **Angular, Python, Django REST Framework, PostgreSQL, Docker, Git, REST APIs, authentication, and cloud deployment**.
