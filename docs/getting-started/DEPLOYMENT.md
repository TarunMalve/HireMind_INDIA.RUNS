# Deployment Guide

> **Deploy HireMind Elite to production on any platform.** Covers Vercel, Railway, Render, Docker, VPS, and local server.

---

## Table of Contents

- [Architecture Overview](#architecture-overview)
- [Pre-Deployment Checklist](#pre-deployment-checklist)
- [Vercel (Frontend)](#vercel-frontend)
- [Railway (Backend + Database)](#railway-backend--database)
- [Render (Backend + Database)](#render-backend--database)
- [Docker](#docker)
- [VPS (Ubuntu)](#vps-ubuntu)
- [Local Server](#local-server)
- [Environment Variables Reference](#environment-variables-reference)
- [Post-Deployment Verification](#post-deployment-verification)

---

## Architecture Overview

HireMind Elite splits into two independently deployable services:

```mermaid
graph LR
    subgraph "Production"
        A["🌐 Frontend\nVercel / CDN\nlocalhost:3000"] -->|REST API| B["⚙️ Backend\nRailway / Render\nlocalhost:4000"]
        B -->|Prisma ORM| C["🗄️ PostgreSQL\nRailway / Supabase / Neon"]
        B -->|AI APIs| D["🤖 OpenAI / Gemini"]
        B -->|Vectors| E["📌 Pinecone"]
    end
```

| Layer | Recommended Platform | Alternative |
|---|---|---|
| **Frontend** | Vercel | Netlify, Cloudflare Pages |
| **Backend API** | Railway | Render, Fly.io |
| **Database** | Railway PostgreSQL | Supabase, Neon, ElephantSQL |
| **Auth** | Clerk (SaaS) | — |

---

## Pre-Deployment Checklist

- [ ] All environment variables configured in target platform
- [ ] Database connection string for production (not `localhost`)
- [ ] Clerk production keys (not test keys)
- [ ] OpenAI / Gemini production API keys
- [ ] `NODE_ENV=production` set
- [ ] CORS `FRONTEND_URL` set to your production frontend URL
- [ ] Database migration applied to production DB
- [ ] Build tested locally with `npm run build`

---

## Vercel (Frontend)

Vercel is the recommended platform for deploying the Next.js frontend. Zero configuration required for Next.js projects.

### Automatic Deployment (GitHub Integration)

1. Push your repository to GitHub
2. Visit [vercel.com](https://vercel.com) and sign in
3. Click **Add New → Project**
4. Import your GitHub repository `HireMind_INDIA.RUNS`
5. Set the **Root Directory** to `frontend`
6. Vercel auto-detects Next.js — leave framework preset as **Next.js**
7. Add environment variables:

```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY = pk_live_...
CLERK_SECRET_KEY                  = sk_live_...
NEXT_PUBLIC_API_URL               = https://your-backend.railway.app
```

8. Click **Deploy**

### Vercel CLI Deployment

```bash
npm install -g vercel

cd frontend
vercel login
vercel --prod
```

### Custom Domain

In Vercel Project Settings → Domains, add your custom domain (e.g., `app.hiremind.io`).

---

## Railway (Backend + Database)

Railway provides easy Node.js + PostgreSQL hosting with GitHub integration.

### Backend Deployment

1. Visit [railway.app](https://railway.app) and sign in
2. Click **New Project → Deploy from GitHub repo**
3. Select `HireMind_INDIA.RUNS`
4. In the service settings, set **Root Directory** to `backend`
5. Set the **Start Command**:

```bash
node dist/index.js
```

6. Set **Build Command**:

```bash
npm install && npm run build
```

7. Add environment variables in the **Variables** tab:

```
DATABASE_URL         = postgresql://...  (provided by Railway DB)
CLERK_SECRET_KEY     = sk_live_...
OPENAI_API_KEY       = sk-...
GEMINI_API_KEY       = ...
PINECONE_API_KEY     = ...
PINECONE_INDEX       = hiremind-embeddings
PORT                 = 4000
NODE_ENV             = production
FRONTEND_URL         = https://your-frontend.vercel.app
```

### PostgreSQL Database on Railway

1. In your Railway project, click **+ Add Service → Database → PostgreSQL**
2. Railway auto-provisions a PostgreSQL instance
3. Click the DB service → **Connect** to copy the `DATABASE_URL`
4. Paste into your backend service's `DATABASE_URL` variable

### Run Migrations on Railway

```bash
# Add a one-time start command or run via Railway CLI
railway run --service backend npx prisma migrate deploy
```

---

## Render (Backend + Database)

### Backend on Render

1. Visit [render.com](https://render.com) and create an account
2. Click **New → Web Service**
3. Connect your GitHub repository
4. Configure:
   - **Name**: `hiremind-backend`
   - **Root Directory**: `backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `node dist/index.js`
5. Add environment variables in the **Environment** section
6. Click **Create Web Service**

### PostgreSQL on Render

1. Click **New → PostgreSQL**
2. Name it `hiremind-db`
3. Copy the **Internal Database URL** to use as `DATABASE_URL` in your backend service

### Apply Migrations

```bash
render run --service hiremind-backend -- npx prisma migrate deploy
```

---

## Docker

HireMind can be containerized for reproducible deployments.

### Backend Dockerfile

Create `backend/Dockerfile`:

```dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/package.json ./package.json
EXPOSE 4000
CMD ["node", "dist/index.js"]
```

### docker-compose.yml (Full Stack)

Create at project root:

```yaml
version: '3.9'

services:
  postgres:
    image: postgres:16-alpine
    environment:
      POSTGRES_USER: hiremind
      POSTGRES_PASSWORD: secret
      POSTGRES_DB: hiremind
    ports:
      - "5432:5432"
    volumes:
      - pgdata:/var/lib/postgresql/data

  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    ports:
      - "4000:4000"
    environment:
      DATABASE_URL: postgresql://hiremind:secret@postgres:5432/hiremind
      NODE_ENV: production
      PORT: 4000
    depends_on:
      - postgres

  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
    ports:
      - "3000:3000"
    environment:
      NEXT_PUBLIC_API_URL: http://backend:4000
    depends_on:
      - backend

volumes:
  pgdata:
```

### Build and Run

```bash
docker-compose up --build

# Run migrations
docker-compose exec backend npx prisma migrate deploy
```

### Frontend Dockerfile

Create `frontend/Dockerfile`:

```dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV production
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public
EXPOSE 3000
CMD ["node", "server.js"]
```

> Ensure `output: 'standalone'` is set in `next.config.ts` for the standalone Docker image.

---

## VPS (Ubuntu)

For teams deploying on a VPS (DigitalOcean, Linode, Hetzner):

### Server Setup

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js 20
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Install PostgreSQL
sudo apt install -y postgresql postgresql-contrib

# Install PM2 (process manager)
npm install -g pm2

# Install nginx (reverse proxy)
sudo apt install -y nginx
```

### Deploy Application

```bash
# Clone repository
git clone https://github.com/TarunMalve/HireMind_INDIA.RUNS.git /var/www/hiremind
cd /var/www/hiremind

# Install dependencies and build
npm install && cd backend && npm install && npm run build && cd ..
cd frontend && npm install && npm run build && cd ..

# Set environment variables
nano /var/www/hiremind/backend/.env

# Run migrations
cd backend && npx prisma migrate deploy && cd ..
```

### Start with PM2

```bash
# Start backend
pm2 start backend/dist/index.js --name "hiremind-api"

# Start frontend
pm2 start "cd /var/www/hiremind/frontend && npm start" --name "hiremind-frontend"

# Save PM2 state
pm2 save
pm2 startup
```

### Nginx Reverse Proxy

Create `/etc/nginx/sites-available/hiremind`:

```nginx
server {
    server_name api.yourdomain.com;
    location / {
        proxy_pass http://localhost:4000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}

server {
    server_name app.yourdomain.com;
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
    }
}
```

```bash
sudo ln -s /etc/nginx/sites-available/hiremind /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx

# SSL with Certbot
sudo certbot --nginx -d app.yourdomain.com -d api.yourdomain.com
```

---

## Local Server

Run HireMind as a production build on your local machine:

```bash
# Build both services
npm run build

# Start backend
cd backend && node dist/index.js &

# Start frontend
cd frontend && npm start &

# Backend: http://localhost:4000
# Frontend: http://localhost:3000
```

---

## Environment Variables Reference

See [SECURITY.md](../architecture/SECURITY.md) for detailed variable descriptions.

| Variable | Required | Where |
|---|---|---|
| `DATABASE_URL` | ✅ | Backend |
| `CLERK_SECRET_KEY` | ✅ | Backend + Frontend |
| `CLERK_PUBLISHABLE_KEY` | ✅ | Backend + Frontend |
| `OPENAI_API_KEY` | ⚠️ | Backend |
| `GEMINI_API_KEY` | ⚠️ | Backend |
| `PINECONE_API_KEY` | ⚠️ | Backend |
| `PORT` | ✅ | Backend |
| `NODE_ENV` | ✅ | Backend |
| `FRONTEND_URL` | ✅ | Backend (CORS) |
| `NEXT_PUBLIC_API_URL` | ✅ | Frontend |

---

## Post-Deployment Verification

After deploying, verify everything is working:

```bash
# 1. Health check
curl https://your-api.railway.app/api/health

# Expected
{
  "success": true,
  "data": {
    "status": "healthy",
    "environment": "production"
  }
}

# 2. Test frontend loads at your domain
# 3. Complete a sign-up flow
# 4. Post a test job
# 5. Apply as a candidate
# 6. Verify rankings are generated
```

---

## Related Documentation

- [Installation Guide](INSTALLATION.md) — Local dev setup
- [Security Guide](../architecture/SECURITY.md) — Environment variable security
- [System Architecture](../architecture/SYSTEM_ARCHITECTURE.md) — Full architecture diagram
- [API Reference](../api/API_REFERENCE.md) — Endpoint documentation
