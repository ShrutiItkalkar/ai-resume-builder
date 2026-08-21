# High Level Design (HLD) — AI Resume Builder

## 1. System Architecture Diagram

```
+-------------------------------------------------------------------+
|                        CLIENT LAYER                               |
|   React 19 + Vite 8 SPA (Client-Side Rendering)                    |
|   - React Router (Navigation & Protected Routes)                  |
|   - AuthContext & Token Storage Utility                          |
|   - Resume Editor & Standalone Resume Preview                     |
+-------------------------------------------------------------------+
                                 │
                   HTTPS / JSON API Requests
                   Authorization: Bearer <JWT>
                                 ▼
+-------------------------------------------------------------------+
|                        SERVER LAYER                               |
|   Node.js + Express 5 Application Server                          |
|   - CORS & Body-Parser Middleware                                 |
|   - JWT Auth Middleware (authMiddleware.js)                       |
|   - Zod Schema Validation (validateRequest.js)                    |
|   - Controller Layer (auth.controller, resume.controller)          |
|   - AI Service Layer (aiService.js)                               |
+-------------------------------------------------------------------+
            │                                         │
            │ Prisma ORM / SQL                        │ HTTPS API
            ▼                                         ▼
+-----------------------+                 +-------------------------+
|   DATABASE LAYER      |                 |   EXTERNAL AI LAYER     |
|  Neon PostgreSQL DB   |                 |  Google Gemini REST API |
| (Serverless Pooler)   |                 |  (Secret API Key)       |
+-----------------------+                 +-------------------------+
```

## 2. Data Flow Architecture

### 2.1 User Authentication Flow
1. User submits credentials at `/login` or `/signup`.
2. Server validates input using Zod -> hashes password with `bcrypt` (signup) or compares hash (login).
3. Server issues 7-day JWT signed with `JWT_SECRET`.
4. Client stores JWT in localStorage via `token.js` helper and updates `AuthContext`.
5. Subsequent requests pass `Authorization: Bearer <JWT>`.

### 2.2 AI Resume Tailoring Flow
1. User clicks "Generate AI Tailoring" in Resume Editor.
2. Client posts request to `POST /api/resumes/:id/generate`.
3. Express server authenticates request & verifies resume ownership (`resume.userId === req.user.id`).
4. Backend `aiService.js` constructs structured prompt with candidate details and job description.
5. `aiService.js` sends HTTPS payload with `AI_API_KEY` to AI Provider REST endpoint.
6. Backend parses and validates JSON response from AI.
7. Backend saves generated result to `GeneratedContent` table and returns JSON response to client.
8. Client reactively renders tailored suggestions and enables 1-click application into active resume.
