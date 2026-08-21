# Low Level Design (LLD) — AI Resume Builder

## 1. Database Schema & Data Models (Prisma)

### User Model
```prisma
model User {
  id           String   @id @default(uuid())
  email        String   @unique
  passwordHash String
  name         String
  resumes      Resume[]
  createdAt    DateTime @default(now())
}
```

### Resume Model
```prisma
model Resume {
  id               String             @id @default(uuid())
  userId           String
  user             User               @relation(fields: [userId], references: [id])
  title            String
  summary          String?
  jobDescription   String?
  skills           String[]
  experiences      Experience[]
  education        Education[]
  generatedContent GeneratedContent[]
  createdAt        DateTime           @default(now())
  updatedAt        DateTime           @updatedAt
}
```

### Experience Model
```prisma
model Experience {
  id          String  @id @default(uuid())
  resumeId    String
  resume      Resume  @relation(fields: [resumeId], references: [id], onDelete: Cascade)
  company     String
  role        String
  startDate   String
  endDate     String?
  description String?
}
```

### Education Model
```prisma
model Education {
  id              String  @id @default(uuid())
  resumeId        String
  resume          Resume  @relation(fields: [resumeId], references: [id], onDelete: Cascade)
  institution     String
  degree          String
  graduationYear  Int
}
```

### GeneratedContent Model
```prisma
model GeneratedContent {
  id           String   @id @default(uuid())
  resumeId     String
  resume       Resume   @relation(fields: [resumeId], references: [id], onDelete: Cascade)
  bulletPoints Json
  coverLetter  String
  generatedAt  DateTime @default(now())
}
```

## 2. Server Controller & Middleware Specifications

### 2.1 Middleware
- `authMiddleware.js`: Extracts `Authorization: Bearer <token>`, verifies JWT using `jwt.verify(token, process.env.JWT_SECRET)`, attaches `req.user = { id: payload.userId }` or returns 401.
- `validateRequest.js`: Higher-order middleware taking a Zod schema (`schema.safeParse(req.body)`). Returns 400 with `{ success: false, error: 'Validation failed', details: [...] }` if validation fails; attaches `req.validatedData` if successful.

### 2.2 Controllers
- `auth.routes.js`:
  - `POST /signup`: Validates presence -> hashes password (`bcrypt.hash(password, 10)`) -> creates User -> issues 7-day JWT.
  - `POST /login`: Finds user by email -> compares hash (`bcrypt.compare`) -> returns generic 401 "Invalid credentials" on mismatch -> issues 7-day JWT.
  - `GET /me`: Authenticated endpoint returning user profile `{ id, email, name, createdAt }`.
- `resume.controller.js`:
  - `getResumes`: Returns user's resumes (`where: { userId: req.user.id }`).
  - `createResume`: Creates resume attached to `req.user.id`.
  - `getResumeById`: Performs ownership check (`resume.userId === req.user.id`), includes `experiences`, `education`, and latest `generatedContent`.
  - `updateResume` & `deleteResume`: Performs ownership check before mutating.
  - `addExperience`, `updateExperience`, `deleteExperience`: Checks parent resume ownership (`resume.userId === req.user.id`) and child item association before mutating.
  - `addEducation`, `updateEducation`, `deleteEducation`: Checks parent resume ownership and child item association before mutating.
  - `generateAiContent`: Calls `aiService.generateResumeContent()`, persists result into `GeneratedContent` table.

## 3. Frontend Client Specifications

### 3.1 `apiClient.js`
Unified HTTP client wrapper using `fetch()`:
- Automatically reads `import.meta.env.VITE_API_URL`.
- Attaches `Authorization: Bearer <token>` from `token.js` helper when available.
- Standardizes response handling and throws formatted errors for non-2xx statuses.

### 3.2 Key Components
- `AuthProvider` (`AuthContext.jsx`): Manages user state, login, signup, logout, and automatic session restoration via `GET /api/auth/me`.
- `ProtectedRoute.jsx`: Shields private routes (`/dashboard`, `/resume/*`), redirecting unauthenticated visitors to `/login`.
- `ResumeDashboard.jsx`: Displays resume cards, loading skeleton, delete modal, and resume count stats.
- `ResumeEditorPage.jsx`: Section-based editor (Details, AI Tailor, Summary, Skills, Experience, Education) with live Editor/Preview tab switcher and Print-to-PDF export handler.
- `ResumePreview.jsx`: Print-ready resume renderer using standard resume layout.
