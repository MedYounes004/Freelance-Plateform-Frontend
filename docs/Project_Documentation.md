# Freelance Platform — Complete Project Documentation

**Version:** 1.0  
**Date:** May 2026  
**Status:** In Development  

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Objectives](#2-objectives)
3. [Features and Functionalities](#3-features-and-functionalities)
4. [System Architecture](#4-system-architecture)
5. [Technologies Used](#5-technologies-used)
6. [Installation and Setup](#6-installation-and-setup)
7. [Usage Guide](#7-usage-guide)
8. [API Endpoints](#8-api-endpoints)
9. [UI Descriptions](#9-ui-descriptions)
10. [Future Improvements](#10-future-improvements)

---

## 1. Project Overview

**Freelance Platform** is a modern, full-stack web and mobile application that connects freelancers with clients. It provides a seamless marketplace where clients can post projects and freelancers can submit competitive proposals.

Built with **Angular 20 / Ionic 8** on the frontend and **Flask** on the backend, with **MongoDB** as the database, the platform offers a responsive cross-platform experience accessible from web browsers and mobile devices (iOS and Android via Capacitor).

The project aims to replicate the core functionality of established platforms such as Upwork or Freelancer.com, tailored for academic and professional demonstration purposes.

---

## 2. Objectives

The primary objectives of this project are:

- **Connect clients and freelancers** through a structured project marketplace.
- **Streamline project management** with milestones, budgets, and deadlines.
- **Provide secure authentication** using JSON Web Tokens (JWT).
- **Enable proposal management** allowing freelancers to bid on projects.
- **Support messaging** between clients and freelancers.
- **Offer subscription tiers** for premium features and visibility.
- **Deliver a mobile-first experience** through Ionic/Capacitor for iOS and Android.
- **Demonstrate full-stack integration** between a modern frontend framework and a Python REST API.

---

## 3. Features and Functionalities

### 3.1 Implemented Features

#### Backend (Flask REST API)
- **14 REST Endpoints** fully documented and tested
- **Project CRUD** — Create, Read, Update, Delete projects
- **Proposal CRUD** — Submit, view, update, delete proposals
- **JWT Authentication** — Token-based endpoint protection
- **Search & Filtering** — Full-text search and filter by status/category/skill
- **Error Handling** — Structured JSON error responses
- **CORS Configuration** — Cross-origin resource sharing for frontend integration
- **MongoDB Integration** — Persistent data storage with PyMongo

#### Frontend (Angular / Ionic)
- **Onboarding Screen** — Introduction flow for new users
- **Authentication Pages** — Login and Sign-up screens
- **Home Dashboard** — Featured freelancers, categories, and quick navigation
- **Projects Listing** — Browse, search, and filter available projects
- **Project Details** — Full project information with proposal submissions
- **Create Project** — Form for clients to post new projects
- **Create Proposal** — Freelancers submit bids with cover letters
- **Profile Management** — View and edit user profile information
- **Edit Profile** — Update personal details and professional bio
- **CV Management** — Upload and manage curriculum vitae
- **Messaging** — Direct messaging between users (message list, recipients, chat screen)
- **Pricing / Subscription** — Plan selection and subscription success flow
- **JWT Interceptor** — Automatic token injection in HTTP headers
- **Loading States** — Spinners and skeleton loaders for async operations
- **Error Handling** — Intelligent user-facing error messages
- **TypeScript Strict Mode** — Fully typed codebase

### 3.2 In-Progress Features
- Full authentication flow (login/register/logout/refresh)
- Real-time notifications via WebSockets
- Rating and review system
- Integrated payments

### 3.3 Planned Features
- Admin panel and analytics dashboard
- Multi-language support (i18n)
- Offline mode and Progressive Web App (PWA)
- Native mobile builds (iOS / Android)

---

## 4. System Architecture

### 4.1 High-Level Architecture

```
┌──────────────────────────────────────────────────────────┐
│               Client Layer (Web / Mobile)                │
│                                                          │
│  ┌──────────────────────────────────────────────────┐   │
│  │         Frontend — Angular 20 / Ionic 8          │   │
│  │                                                  │   │
│  │  Pages: Home, Projects, Profile, Messaging, ...  │   │
│  │  Services: ProjectService, AuthService, ...      │   │
│  │  JWT Interceptor (auto-inject Bearer token)      │   │
│  │  Models / TypeScript Interfaces                  │   │
│  └──────────────────────────────────────────────────┘   │
│                          │                               │
│                  REST API (HTTP/JSON)                    │
│                   http://localhost:5000/api              │
│                          │                               │
│  ┌──────────────────────────────────────────────────┐   │
│  │             Backend — Flask (Python)             │   │
│  │                                                  │   │
│  │  Routes / Endpoints                              │   │
│  │  Business Logic                                  │   │
│  │  JWT Authentication Middleware                   │   │
│  │  MongoDB Models (Project, Proposal, User)        │   │
│  └──────────────────────────────────────────────────┘   │
│                          │                               │
│  ┌──────────────────────────────────────────────────┐   │
│  │              Database — MongoDB                  │   │
│  │                                                  │   │
│  │  Collections: users, projects, proposals         │   │
│  │  Local instance: mongodb://localhost:27017       │   │
│  └──────────────────────────────────────────────────┘   │
└──────────────────────────────────────────────────────────┘
```

### 4.2 Frontend Architecture

The frontend follows Angular's modular lazy-loading architecture:

```
src/
├── app/
│   ├── pages/                  ← Feature pages (lazy-loaded routes)
│   │   ├── onboarding/
│   │   ├── home/
│   │   ├── login/
│   │   ├── signup/
│   │   ├── projects-screen/
│   │   ├── project-details-screen/
│   │   ├── create-project-screen/
│   │   ├── create-proposal-screen/
│   │   ├── profile/
│   │   ├── edit-profile/
│   │   ├── cv-management/
│   │   ├── messaging-screen/
│   │   ├── message-list/
│   │   ├── message-recipients/
│   │   ├── pricing/
│   │   └── subscription-success/
│   ├── components/             ← Shared reusable UI components
│   ├── core/
│   │   └── services/           ← Singleton services (Auth, Projects, Users, ...)
│   ├── models/                 ← TypeScript interfaces and types
│   ├── interceptors/           ← HTTP interceptors (JWT)
│   └── app.routes.ts           ← Application routing
├── environments/               ← Environment-specific configuration
└── main.ts                     ← Application bootstrap
```

### 4.3 Backend Architecture

```
backend/
├── app/
│   ├── app.py          ← Flask application factory
│   ├── config.py       ← Configuration (env vars, secrets)
│   ├── models.py       ← MongoDB document models
│   └── routes.py       ← REST endpoint definitions
└── run.py              ← Application entry point
```

### 4.4 Data Flow

```
User Action (UI)
      │
      ▼
Angular Page Component
      │  (calls service method)
      ▼
Angular Service (HTTP)
      │  (JWT Interceptor adds Bearer token)
      ▼
Flask REST API Endpoint
      │  (validates JWT, processes logic)
      ▼
MongoDB (read/write)
      │
      ▼
JSON Response
      │
      ▼
Component updates UI
```

### 4.5 Authentication Flow

```
[Login Page] ──POST /api/auth/login──▶ [Flask Backend]
                                              │
                                      Validate credentials
                                              │
                                      Generate JWT token
                                              │
              ◀──── { token: "..." } ─────────┘
                        │
              Store in localStorage
                        │
              JwtInterceptor injects:
              Authorization: Bearer <token>
                        │
              Protected API calls succeed
```

---

## 5. Technologies Used

### 5.1 Frontend

| Technology | Version | Purpose |
|------------|---------|---------|
| Angular | 20.0 | Web application framework |
| Ionic Framework | 8.0 | Mobile-first UI components |
| Capacitor | 8.0 | Native mobile runtime (iOS/Android) |
| TypeScript | 5.9 | Statically typed JavaScript |
| RxJS | 7.8 | Reactive programming (Observables) |
| Angular HttpClient | 20.0 | HTTP communication |
| Ionicons | 7.0 | Icon library |

### 5.2 Backend

| Technology | Version | Purpose |
|------------|---------|---------|
| Python | 3.8+ | Backend runtime |
| Flask | 2.3.3 | Lightweight web framework |
| PyMongo | 4.5.0 | MongoDB driver for Python |
| PyJWT | 2.11.0 | JSON Web Token generation and validation |
| Flask-CORS | 4.0.0 | Cross-Origin Resource Sharing |

### 5.3 Database

| Technology | Version | Purpose |
|------------|---------|---------|
| MongoDB | 6.0+ | NoSQL document database |

### 5.4 Development Tools

| Tool | Purpose |
|------|---------|
| Angular CLI | Code generation, build, and serve |
| Ionic CLI | Ionic project management and preview |
| npm | Node.js package manager |
| pip | Python package manager |
| Git | Version control |
| VS Code | Recommended IDE |
| Postman | API testing |

---

## 6. Installation and Setup

### 6.1 Prerequisites

Ensure the following are installed on your machine:

| Requirement | Version | Download |
|-------------|---------|----------|
| Python | 3.8+ | https://www.python.org |
| Node.js | 16+ | https://nodejs.org |
| MongoDB | 6.0+ | https://www.mongodb.com |
| Git | Any | https://git-scm.com |

Verify installations:
```bash
python --version
node --version
npm --version
mongod --version
```

### 6.2 Clone the Repository

```bash
git clone https://github.com/sellami-mohammed-aziz/Freelance-Plateform.git
cd Freelance-Plateform
```

### 6.3 Backend Setup

```bash
cd backend

# Create virtual environment (recommended)
python -m venv venv
source venv/bin/activate      # Linux/Mac
# or
venv\Scripts\activate         # Windows

# Install dependencies
pip install -r requirements.txt

# Configure environment
cp .env.example .env
# Edit .env and set:
#   MONGO_URI=mongodb://localhost:27017/freelance_platform
#   JWT_SECRET_KEY=your-secure-secret-key
#   FLASK_ENV=development
```

### 6.4 Frontend Setup

```bash
# From project root
npm install -g @ionic/cli
npm install
```

### 6.5 Database Setup

```bash
# Start MongoDB service
mongod                          # Linux/Mac
# or
net start MongoDB               # Windows (as service)
```

MongoDB will automatically create the `freelance_platform` database and collections on first use.

### 6.6 Running the Application

#### Option A — Automatic (Recommended)

```bash
# Linux/Mac
./run.sh

# Windows
.\run.bat
```

This starts both backend and frontend simultaneously.

#### Option B — Manual

**Terminal 1 — Backend:**
```bash
cd backend
python run.py
# Backend running at: http://localhost:5000/api
```

**Terminal 2 — Frontend:**
```bash
ionic serve
# App running at: http://localhost:4200
```

---

## 7. Usage Guide

### 7.1 First Launch

1. Open your browser and navigate to `http://localhost:4200`
2. The app launches on the **Onboarding** screen
3. Proceed to **Sign Up** to create a new account, or **Login** if you already have one

### 7.2 Client Workflow

1. **Login** with client credentials
2. Navigate to **Home** dashboard
3. Go to **Projects** → click **New Project** (`/projects/new`)
4. Fill in the project form: title, description, budget, deadline, skills required
5. Submit — the project is published and visible to freelancers
6. Review incoming **Proposals** from your project details page
7. **Accept** the best proposal to begin work

### 7.3 Freelancer Workflow

1. **Login** with freelancer credentials
2. Browse **Projects** at `/projects`
3. Use the **Search** bar or **Category** filters to find relevant projects
4. Open a **Project Details** page to read full requirements
5. Click **Submit Proposal** and fill in bid amount, delivery time, and cover letter
6. Track your proposal status from your profile

### 7.4 Messaging

1. Navigate to the **Messages** section
2. Select a recipient from **Message Recipients**
3. Send and receive messages in the **Messaging Screen**

### 7.5 Profile Management

1. Navigate to **Profile** page
2. Click **Edit Profile** to update name, bio, skills, and contact info
3. Use **CV Management** to upload your resume (PDF/DOC)

### 7.6 Subscription

1. Navigate to **Pricing** (`/upgrade`)
2. Review available plans (Free, Pro, Enterprise)
3. Select a plan and complete checkout
4. View **Subscription Success** confirmation

---

## 8. API Endpoints

Base URL: `http://localhost:5000/api`

Authentication: Include `Authorization: Bearer <jwt_token>` header for protected routes.

### 8.1 Projects

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/projects` | No | List all projects (with pagination, filtering) |
| `POST` | `/projects` | ✅ JWT | Create a new project |
| `GET` | `/projects/<id>` | No | Get project details by ID |
| `PUT` | `/projects/<id>` | ✅ JWT | Update a project |
| `DELETE` | `/projects/<id>` | ✅ JWT | Delete a project |
| `PATCH` | `/projects/<id>/status` | ✅ JWT | Update project status |
| `GET` | `/projects/search?q=...` | No | Search projects by keyword |
| `GET` | `/projects/client/<id>` | No | Get projects by client ID |

**Query Parameters for `GET /projects`:**
- `page` (int, default: 1) — Page number
- `limit` (int, default: 10) — Results per page
- `status` (string) — Filter by `pending`, `in-progress`, `completed`
- `category` (string) — Filter by category name
- `skill` (string) — Filter by required skill

**Example — Create Project Request:**
```json
POST /api/projects
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Build an e-commerce website",
  "client": "John Doe",
  "budget": 2500,
  "deadline": "2026-06-30",
  "category": "Development",
  "description": ["Full-stack e-commerce site", "Payment integration required"],
  "skills": ["React", "Node.js", "MongoDB"]
}
```

**Example — Success Response:**
```json
{
  "message": "Project created successfully",
  "project": {
    "id": "664abc123",
    "title": "Build an e-commerce website",
    "status": "pending",
    "budget": 2500,
    "createdAt": "2026-05-05T10:00:00Z"
  }
}
```

### 8.2 Proposals

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/proposals/<project_id>` | No | List proposals for a project |
| `POST` | `/proposals` | ✅ JWT | Submit a new proposal |
| `GET` | `/proposals/<id>` | No | Get proposal details by ID |
| `PUT` | `/proposals/<id>` | ✅ JWT | Update a proposal |
| `DELETE` | `/proposals/<id>` | ✅ JWT | Withdraw/delete a proposal |
| `PATCH` | `/proposals/<id>/status` | ✅ JWT | Update proposal status |

**Example — Submit Proposal Request:**
```json
POST /api/proposals
Authorization: Bearer <token>
Content-Type: application/json

{
  "projectId": "664abc123",
  "coverLetter": "I have 5 years of experience building e-commerce platforms...",
  "bidAmount": 2200,
  "deliveryTime": "30 days"
}
```

### 8.3 Authentication (Planned)

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/auth/register` | Register a new user |
| `POST` | `/auth/login` | Login and receive JWT token |
| `POST` | `/auth/logout` | Invalidate current token |
| `POST` | `/auth/refresh-token` | Obtain a refreshed token |

### 8.4 Standard Error Responses

```json
// 400 Bad Request
{ "error": "Missing required field: title" }

// 401 Unauthorized
{ "error": "Token manquant" }

// 404 Not Found
{ "error": "Project not found" }

// 500 Internal Server Error
{ "error": "Internal server error" }
```

---

## 9. UI Descriptions

### 9.1 Onboarding Screen
An introductory carousel introducing the platform's value proposition. Users can skip or proceed to Sign Up / Login. Features animated illustrations and call-to-action buttons.

### 9.2 Home Dashboard
- **Header:** User greeting, location badge, notification bell
- **Category Bar:** Horizontal scrollable list (All, Design, Development, Writing, Marketing, Video, Music)
- **Featured Freelancers:** Cards displaying avatar, name, specialty, and rating
- **Guest Banner:** Shown to unauthenticated users encouraging sign-up
- **Bottom Navigation:** Persistent tab bar (Home, Projects, Messages, Profile)

### 9.3 Projects Screen
- **Search Bar:** Full-text search across project titles and descriptions
- **Filter Chips:** Quick filter by status (Pending, In Progress, Completed)
- **Project Cards:** Show title, client avatar, budget, deadline, category badge, and proposals count
- **Floating Action Button:** Create new project (clients only)

### 9.4 Project Details Screen
- **Header:** Project title, client info, status badge
- **Description Section:** Formatted description paragraphs
- **Skills Tags:** Required skill badges
- **Budget & Deadline:** Highlighted info cards
- **Milestones:** Timeline view with status indicators
- **Attachments:** Downloadable file list
- **Proposals Section:** List of submitted proposals
- **Submit Proposal Button:** Navigates to proposal creation form

### 9.5 Create Project Screen
Form with fields:
- Title, Category (dropdown), Budget (number input)
- Deadline (date picker), Duration estimate
- Description (multi-line text)
- Required Skills (tag input)
- Milestones (dynamic list: title, payment, status)
- Attachments (file upload)

### 9.6 Profile Screen
- **Avatar + Cover Image**
- **Name, Role, Bio**
- **Stats:** Projects completed, rating, reviews count
- **Skills Tags**
- **Action Buttons:** Edit Profile, Manage CV, View Proposals

### 9.7 Messaging Screen
- **Message List:** Conversation threads with last message preview and timestamp
- **Chat Screen:** Full conversation view with message bubbles, timestamps, and input bar
- **Recipients Screen:** Searchable contact list to start new conversations

### 9.8 Pricing Screen
Three-tier pricing cards:
- **Free:** Basic access, limited proposals
- **Pro:** Unlimited proposals, featured listing, priority support
- **Enterprise:** Custom contracts, dedicated account manager

---

## 10. Future Improvements

### 10.1 Short-Term (Next Quarter)

| Feature | Priority | Description |
|---------|----------|-------------|
| Complete Authentication | HIGH | Full login/register/logout/refresh token flow |
| User Roles | HIGH | Distinct permissions for Client vs. Freelancer |
| Profile Public Pages | HIGH | Public freelancer profile with portfolio |
| Notifications | MEDIUM | In-app and push notifications |
| Rating System | MEDIUM | 5-star ratings and written reviews after project completion |

### 10.2 Medium-Term

| Feature | Priority | Description |
|---------|----------|-------------|
| Payment Integration | HIGH | Stripe or PayPal for milestone payments |
| Real-Time Messaging | MEDIUM | WebSocket-powered live chat |
| Advanced Search | MEDIUM | Elasticsearch for full-text and semantic search |
| Analytics Dashboard | MEDIUM | Client and freelancer activity dashboards |
| Admin Panel | MEDIUM | Platform moderation and user management |

### 10.3 Long-Term

| Feature | Priority | Description |
|---------|----------|-------------|
| Native Mobile Apps | MEDIUM | iOS and Android builds via Capacitor |
| Progressive Web App | MEDIUM | Offline support and installable web app |
| Multi-Language Support | LOW | i18n for Arabic, French, and English |
| AI Matching | LOW | ML-based freelancer-to-project matching |
| Video Interviews | LOW | Integrated video calls for client-freelancer meetings |
| Escrow System | LOW | Secure milestone-based fund release |

### 10.4 Technical Improvements

- **Testing:** Unit tests for all services, E2E tests with Cypress
- **CI/CD Pipeline:** GitHub Actions for automated build and deployment
- **Docker Containerization:** Docker Compose for local development and production
- **Performance:** Redis caching, CDN for assets, lazy-loading optimization
- **Security:** Rate limiting, input sanitization, HTTPS enforcement, 2FA
- **Monitoring:** Application logging with ELK Stack or Sentry

---

## Appendix A — Project File Structure

```
Freelance-Plateform/
├── docs/
│   ├── Project_Documentation.md    ← This file
│   └── Project_Documentation.pdf   ← Generated PDF
│
├── src/                            ← Angular/Ionic frontend
│   ├── app/
│   │   ├── pages/                  ← 16 application screens
│   │   ├── components/             ← Reusable UI components
│   │   ├── core/services/          ← 7 service modules
│   │   ├── models/                 ← 7 TypeScript interfaces
│   │   ├── interceptors/           ← JWT interceptor
│   │   └── app.routes.ts           ← Route definitions
│   └── environments/
│
├── backend/                        ← Flask REST API
│   ├── app/
│   └── run.py
│
├── README.md
├── angular.json
├── package.json
└── ionic.config.json
```

## Appendix B — Environment Variables

```bash
# backend/.env
FLASK_ENV=development
FLASK_DEBUG=1
MONGO_URI=mongodb://localhost:27017/freelance_platform
JWT_SECRET_KEY=your-secure-random-secret-key
JWT_EXPIRATION_HOURS=24

# src/environments/environment.ts
export const environment = {
  production: false,
  apiUrl: 'http://localhost:5000/api'
};
```

---

*This document was generated for academic and professional submission purposes.*  
*© 2026 Freelance Platform — Sellami Mohammed Aziz*
