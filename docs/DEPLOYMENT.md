# Production Deployment Guide — HireMind Elite

This document explains how to deploy the HireMind Elite platform to production environments, including cloud configurations, docker setups, and logging practices.

---

## 1. Cloud Architecture Setup

For optimal performance, scalability, and security, we recommend the following production layout:
- **Frontend SPA**: Deployed to **Vercel** or **Netlify** for global CDN edge delivery.
- **Backend API**: Hosted on **Railway**, **Render**, or **AWS Elastic Beanstalk** (Node/Express runtime).
- **Database Layer**: Managed **Supabase PostgreSQL** or **AWS RDS PostgreSQL** instance.

---

## 2. Frontend Deployment (Vercel)

Vercel detects the Next.js workspace structure automatically:

1.  Connect your GitHub repository to Vercel.
2.  Set the **Root Directory** as `frontend/`.
3.  Ensure the Build & Development Settings are configured:
    - **Build Command**: `next build`
    - **Output Directory**: `.next`
    - **Install Command**: `npm install`
4.  Deploy. Vercel will build the SPA assets and serve them globally.
5.  Add the rewrite config in Vercel to route traffic appropriately.

---

## 3. Backend Deployment (Railway or Render)

1.  Create a new Web Service on Railway/Render.
2.  Set the build parameters:
    - **Root Directory**: `backend/`
    - **Build Command**: `npm run build`
    - **Start Command**: `npm start`
3.  Inject the Environment Variables in the project settings panel:
    - `DATABASE_URL` (your production PostgreSQL URI)
    - `GEMINI_API_KEY`
    - `OPENAI_API_KEY`
    - `PORT` = `5000`
    - `NODE_ENV` = `production`
4.  Trigger deploy. Railway will compile the TypeScript files and start the Express daemon.

---

## 4. Docker Self-Hosting Containerization

You can containerize the entire application stack using the following multi-stage `Dockerfile` located in the root of the workspace:

```dockerfile
# Stage 1: Build Frontend SPA
FROM node:20-alpine AS frontend-builder
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ ./
RUN npm run build

# Stage 2: Build Backend Server
FROM node:20-alpine AS backend-builder
WORKDIR /app/backend
COPY backend/package*.json ./
RUN npm install
COPY backend/ ./
RUN npm run build

# Stage 3: Runner Stage
FROM node:20-alpine
WORKDIR /app
COPY --from=backend-builder /app/backend/dist ./backend/dist
COPY --from=backend-builder /app/backend/node_modules ./backend/node_modules
COPY --from=backend-builder /app/backend/package.json ./backend/package.json
COPY --from=frontend-builder /app/frontend/public ./frontend/public

ENV PORT=5000
ENV NODE_ENV=production
EXPOSE 5000

CMD ["node", "backend/dist/index.js"]
```

Build and run your container locally or push to Amazon ECR / Google Artifact Registry:
```bash
docker build -t hiremind-elite .
docker run -p 5000:5000 --env-file backend/.env hiremind-elite
```

---

## 5. Security & Monitoring Logs

### Secrets Management
- Never commit `.env` files to git repositories.
- Use cloud provider vaults (Railway Variables, Vercel Environment Variables, AWS Secrets Manager) to secure LLM API keys and database strings.

### Monitoring & Metrics
- Use **Sentry** integration to catch runtime frontend crashes.
- Monitor Express server load and memory spikes using **PM2** or **Datadog** agents in Docker containers.
- View real-time endpoint logs:
```bash
# PM2 Logs if self-hosted
pm2 logs hiremind-backend
```