# Product Requirements Document (PRD) — AI Resume Builder

## 1. Executive Summary
The **AI Resume Builder** application is built for B.Tech software engineering evaluation. It empowers job applicants to maintain multiple resume profiles and leverage artificial intelligence to tailor resume content specifically to target job descriptions.

## 2. Target Users & Problem Statement
- **Users:** Job seekers, students, and software engineers applying to multiple roles.
- **Problem:** Generic resumes fail ATS (Applicant Tracking System) screening because they lack role-specific keywords and targeted summaries matching specific job postings.

## 3. Core Functional Requirements

### 3.1 Authentication & User Session
- User signup with Name, Email, and Password.
- User login returning a 7-day JWT token.
- Page refresh auth persistence via `/api/auth/me`.
- Route protection redirecting unauthenticated users to `/login`.

### 3.2 Resume Management (CRUD)
- Dashboard displaying user's resume cards with titles, updated dates, skills tags, and resume count statistics.
- Creation of new resumes with Title, Target Job Description, and Skills.
- Full section-based editing:
  - Basic Details & Job Description
  - Professional Summary
  - Skills List
  - Work Experience entries (Add/Edit/Delete)
  - Education entries (Add/Edit/Delete)

### 3.3 AI Resume Tailoring
- AI service integration (`POST /api/resumes/:id/generate`).
- Takes candidate profile and target job description to generate:
  - Targeted Professional Summary
  - Recommended Skill set
  - Extracted ATS Keywords
  - Quantifiable bullet point suggestions
- Reactive one-click application of AI summary/skills directly to the active resume.

### 3.4 Preview & PDF Export
- Standalone print-formatted Resume Preview component.
- One-click native PDF export (`window.print()` engine with custom `@media print` CSS hiding editing UI).

## 4. Non-Functional & Security Requirements
- **Performance:** Sub-second page rendering, optimistic frontend state updates.
- **Security:** Bcrypt password hashing (cost factor 10), JWT Bearer authentication, hard IDOR checks (`resume.userId === req.user.id`), Zod schema validation.
- **Reliability:** Graceful error fallbacks for external AI provider timeouts or network interruptions.
