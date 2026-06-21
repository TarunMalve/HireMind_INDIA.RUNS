# Developer Installation Guide — HireMind Elite

This guide walks you through the step-by-step process of installing and running a local development environment for the HireMind Elite platform.

---

## 1. System Requirements

Ensure your machine meets the following prerequisites:
- **Node.js**: `v18.x` or `v20.x` (LTS versions)
- **NPM**: `v9.x` or newer
- **PostgreSQL**: `v14` or newer (local service or remote cloud instance)
- **Python**: `v3.10` or newer (optional, for validation utilities)
- **Git**: installed and configured

---

## 2. Environment Configurations

HireMind Elite requires environment parameters to map databases and call AI APIs. 

1.  Navigate to the `config/` directory.
2.  Copy `env.example` to `backend/.env` (Express server configuration).
3.  Fill in the values:

```ini
# Database Connection URI
DATABASE_URL="postgresql://postgres:password@localhost:5432/hiremind?schema=public"

# Express API Port
PORT=5000

# AI Provider API Keys
GEMINI_API_KEY="your_gemini_key_here"
OPENAI_API_KEY="your_openai_key_here"

# Environment Mode
NODE_ENV="development"
```

---

## 3. Local Installation Steps

### Step 1: Install Dependencies
From the repository root, install workspace node modules:
```bash
npm install
```

### Step 2: Initialize Database and Migrations
Create the database schema and run migrations using Prisma:
```bash
cd backend
npx prisma db push
```
This maps the schema definitions directly to your PostgreSQL database instance.

### Step 3: Seed Database Profiles
Seed mock candidate profiles (including Priya, Rohan, and Honeypot Vikram) into your database:
```bash
npm run db:seed
```
*(If the seed script is not configured, mock data is served from `frontend/public/mockData.js` as fallback).*

### Step 4: Run the Development Server
From the root directory, start both the Next.js frontend server and the Express API server concurrently:
```bash
npm run dev
```

The system will start:
- **Frontend SPA**: Served at `http://localhost:3000` (Next.js server)
- **Backend APIs**: Served at `http://localhost:5000`

---

## 4. Verification Check

Open your browser and navigate to `http://localhost:3000`. Verify that:
1.  The dark-theme landing page loads with animated Three.js constellations in the background.
2.  Clicking **Live Demo** takes you to the Recruiter Dashboard layout.
3.  Clicking **Sign In** opens the authentication modal overlay.
4.  Selecting **Vikram Sharma** in the Candidates page displays the **Zero-Killer Integrity Alert** (confirming the multiplicative scoring logic is running).