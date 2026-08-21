# AI Resume Builder 📄🤖

Full-Stack AI-Powered Resume Tailoring & Management System for College Software Engineering Evaluation (Kalvium Assessor).

---

## 🌟 Project Overview
The **AI Resume Builder** is a modern full-stack web application designed to help job applicants create, organize, and tailor high-impact resumes for specific job descriptions using artificial intelligence. 

It provides an intuitive section-based editor, AI-assisted resume tailoring (generating ATS keywords, targeted summaries, and experience recommendations), live print-ready resume preview, and 1-click PDF export.

---

## 🛠️ Tech Stack & Architecture

### Frontend
- **Framework:** React 19 + Vite 8
- **Language:** JavaScript (ES Modules)
- **Routing:** React Router v7
- **Styling:** Vanilla CSS with print media support (`@media print`)

### Backend
- **Runtime:** Node.js + Express 5
- **ORM:** Prisma ORM 6.16
- **Database:** PostgreSQL (Neon Serverless PostgreSQL with HTTP adapter)
- **Authentication:** JSON Web Tokens (`jsonwebtoken`) + Password Hashing (`bcrypt`)
- **Validation:** Zod Schema Validation

### AI Engine
- **Provider:** Google Gemini / REST AI Service abstraction (`aiService.js`)
- **Security:** Strict backend proxy (API key never exposed to frontend)

---

## 📁 Repository Folder Structure

```
ai-resume-builder/
├── client/                     # React + Vite Frontend
│   ├── public/
│   ├── src/
│   │   ├── api/                # Unified API client (apiClient.js)
│   │   ├── components/         # Reusable UI components
│   │   │   ├── auth/           # ProtectedRoute.jsx
│   │   │   ├── common/         # Navbar.jsx, ConfirmModal.jsx
│   │   │   └── resume/         # Editor sections, AiGenerationSection, ResumePreview
│   │   ├── context/            # AuthContext.jsx
│   │   ├── pages/              # Landing, Login, Signup, Dashboard, ResumeEditor
│   │   ├── utils/              # Token storage helpers
│   │   ├── App.jsx             # React Router & AuthProvider root
│   │   └── main.jsx
│   ├── .env.example
│   └── package.json
│
├── server/                     # Express Backend
│   ├── prisma/
│   │   ├── migrations/         # Prisma migration history
│   │   └── schema.prisma       # Database models (User, Resume, Experience, Education, GeneratedContent)
│   ├── src/
│   │   ├── controllers/        # Express controllers (resume, auth)
│   │   ├── middleware/         # Auth JWT middleware, Zod validator middleware
│   │   ├── routes/             # Express API routes
│   │   ├── services/           # Backend AI service wrapper (aiService.js)
│   │   ├── utils/              # Zod validation schemas
│   │   ├── app.js              # Express app setup
│   │   └── prisma.js           # Prisma client instantiation with Neon HTTP adapter
│   ├── tests/                  # Automated API integration tests (Node native runner + Supertest)
│   ├── server.js               # Entry point server listener
│   ├── .env.example
│   └── package.json
│
├── .gitignore
├── PRD.md                      # Product Requirements Document
├── HLD.md                      # High Level Design Document
├── LLD.md                      # Low Level Design Document
└── README.md                   # System documentation
```

---

## 📊 Database Schema Summary

The database uses PostgreSQL with the following entities:

1. **User**: `id`, `email` (unique), `passwordHash`, `name`, `createdAt`
2. **Resume**: `id`, `userId` (FK), `title`, `summary`, `jobDescription`, `skills` (array), `createdAt`, `updatedAt`
3. **Experience**: `id`, `resumeId` (FK), `company`, `role`, `startDate`, `endDate`, `description` (Cascades on Resume delete)
4. **Education**: `id`, `resumeId` (FK), `institution`, `degree`, `graduationYear` (Cascades on Resume delete)
5. **GeneratedContent**: `id`, `resumeId` (FK), `bulletPoints` (JSON), `coverLetter`, `generatedAt` (Cascades on Resume delete)

---

## 🔌 API surface

### Auth Endpoints
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/signup` | Register new user & return JWT token | No |
| `POST` | `/api/auth/login` | Authenticate user & return JWT token | No |
| `GET` | `/api/auth/me` | Restore user session details | Yes |

### Resume Endpoints
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/resumes` | List resumes for logged-in user | Yes |
| `POST` | `/api/resumes` | Create new resume | Yes |
| `GET` | `/api/resumes/:id` | Fetch single resume with child entities | Yes |
| `PUT` | `/api/resumes/:id` | Update resume title, summary, skills, jobDesc | Yes |
| `DELETE` | `/api/resumes/:id` | Delete resume and all child records | Yes |

### Child Item & AI Endpoints
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/resumes/:id/experiences` | Add experience entry | Yes |
| `PUT` | `/api/resumes/:id/experiences/:experienceId` | Edit experience entry | Yes |
| `DELETE` | `/api/resumes/:id/experiences/:experienceId` | Delete experience entry | Yes |
| `POST` | `/api/resumes/:id/education` | Add education entry | Yes |
| `PUT` | `/api/resumes/:id/education/:educationId` | Edit education entry | Yes |
| `DELETE` | `/api/resumes/:id/education/:educationId` | Delete education entry | Yes |
| `POST` | `/api/resumes/:id/generate` | Trigger AI resume tailoring | Yes |

---

## ⚡ Environment Variables

### Server (`server/.env`)
```env
PORT=5000
DATABASE_URL=postgresql://user:password@host:5432/dbname?sslmode=require
JWT_SECRET=your_jwt_secret_key
AI_API_KEY=your_gemini_or_openai_key
```

### Client (`client/.env`)
```env
VITE_API_URL=http://localhost:5000/api
```

---

## 🚀 Local Setup & Installation

### 1. Prerequisites
- Node.js (v18 or higher)
- npm (v9 or higher)

### 2. Backend Setup
```bash
cd server
npm install
npx prisma generate
npm run start
```
Server starts on `http://localhost:5000`.

### 3. Frontend Setup
```bash
cd client
npm install
npm run dev
```
Client runs on `http://localhost:5173`.

### 4. Running Automated Tests
```bash
cd server
npm test
```

---

## 🔒 Security Practices Enforced
1. **Password Safety:** Hashed with `bcrypt` (10 rounds). Plaintext passwords or `passwordHash` are never logged, returned, or exposed.
2. **Strict Authorization (IDOR Prevention):** Every single mutating API route verifies that the parent resource `resume.userId === req.user.id`.
3. **API Key Protection:** `AI_API_KEY` is kept strictly on the backend inside `server/.env`.
4. **Validation:** All incoming request bodies are validated using `Zod` schemas before hitting database handlers.
