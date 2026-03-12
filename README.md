# R-B-Workspace

[![CI Testing](https://github.com/JJuan-Gon03/R-B-Workspace/actions/workflows/ci-testing.yml/badge.svg)](https://github.com/JJuan-Gon03/R-B-Workspace/actions/workflows/ci-testing.yml)

**Storyboard Link:** https://www.figma.com/design/E5hnluttzqtcKV8THtMqco/R-B?node-id=0-1&p=f&t=OmpvLWKPNUZihtAd-0

**UML Design**: https://drive.google.com/file/d/1EPChNcvHQsLU-triosukWGCwV4YevZjO/view?usp=sharing

**Tech Spec**: https://docs.google.com/document/d/1KV_gmDjXDH_APVD4Cr4z7WUGW1sjlT35H7f8GYYq-uQ/edit?tab=t.0#heading=h.9b0i6jpuww9w

---

## Project Links (Deployed)

**Frontend:** https://jjuan-gon03.github.io/R-B-Workspace/  
**Backend:** https://thriftr-affjdacjg4fecuha.westus3-01.azurewebsites.net/

---

# How to Collaborate

## Clone the Repository

```bash
git clone https://github.com/JJuan-Gon03/R-B-Workspace.git
cd R-B-Workspace
```

## Install All Dependencies (Root)

```bash
npm install
```

This installs dependencies for both frontend and backend workspaces.

---

# Running the Project Locally

## Backend

```bash
cd packages/express-backend
npm install
npm run dev
```

Backend runs on:

```
http://localhost:PORT
```

## Frontend

```bash
cd packages/react-frontend
npm install
npm run dev
```

Frontend runs on:

```
http://localhost:5173
```

---

# Environment Variables

## Frontend (.env in packages/react-frontend)

```
VITE_API_BASE=http://localhost:PORT
```

## Backend (.env in packages/express-backend)

```
GEMINI_API_KEY=your_gemini_key
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_key
CLOUDINARY_API_SECRET=your_cloudinary_secret
PORT=5000
```

---

# Linting & Formatting

## Lint

Backend:

```bash
npm run -w express-backend lint
```

Frontend:

```bash
npm run -w react-frontend lint
```

## Format

Format everything:

```bash
npm run format
```

Check formatting:

```bash
npm run format:check
```

---

# Testing

## Backend Tests (Jest)

```bash
npm run -w express-backend test
```

## Backend Coverage

```bash
npm run -w express-backend test -- --coverage
```

Minimum requirement: 80% branch coverage on business logic (services/models).

## Frontend Tests (Vitest)

```bash
npm run -w react-frontend test
```

## Cypress Acceptance Tests

```bash
npx cypress open
```

or

```bash
npx cypress run
```

---

# Continuous Integration (CI/CD)

This project uses:

- GitHub Actions for CI
- Azure for backend deployment
- GitHub Pages for frontend deployment

Every push to main:

- Runs backend tests
- Runs frontend tests
- Runs lint checks
- Runs prettier format check
- Deploys automatically if build passes

---

# Coverage Report

Backend Coverage Screenshot:

## ✅ Backend Test Coverage

All backend services, controllers, models, and routes are fully covered.

**Coverage Summary:**

- Statements: 100%
- Branches: 100%
- Functions: 100%
- Lines: 100%

<img width="640" alt="Backend Coverage 100%" src="https://github.com/user-attachments/assets/31f91200-7c10-4ef6-831a-438c87533fa2" />

---

# Contribution Workflow

1. Create a new branch:

```bash
git checkout -b feature/your-feature
```

2. Make changes.
3. Ensure:
   - All tests pass
   - Lint passes
   - Format check passes

4. Commit and push:

```bash
git add .
git commit -m "Describe your changes"
git push
```

5. Create a Pull Request.

---

Make sure there are no linting/formatting issues and all tests pass before attempting a merge.
