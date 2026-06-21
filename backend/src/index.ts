import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { env, isDev } from './config/env';
import { prisma } from './config/database';
import { clerkAuth } from './middleware/auth';
import { apiLimiter } from './middleware/rateLimiter';
import { notFoundHandler, globalErrorHandler } from './middleware/errorHandler';
import routes from './routes';

const app = express();

// ─── Security ────────────────────────────────────────────────
app.use(helmet());

// ─── CORS ────────────────────────────────────────────────────
app.use(
  cors({
    origin: isDev
      ? [env.FRONTEND_URL, 'http://localhost:3000', 'http://localhost:5173']
      : env.FRONTEND_URL,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// ─── Body Parsing ────────────────────────────────────────────
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ─── Logging ─────────────────────────────────────────────────
app.use(morgan(isDev ? 'dev' : 'combined'));

// ─── Clerk Auth (initializes auth context on every request) ──
app.use(clerkAuth);

// ─── Rate Limiting ───────────────────────────────────────────
app.use('/api', apiLimiter);

// ─── Routes ──────────────────────────────────────────────────
app.use('/api', routes);

// ─── 404 & Error Handling ────────────────────────────────────
app.use(notFoundHandler);
app.use(globalErrorHandler);

// ─── Server Start ────────────────────────────────────────────
const PORT = env.PORT;

const server = app.listen(PORT, () => {
  console.log(`
  🚀 HireMind AI Backend v2.0.0
  ─────────────────────────────────
  🌍 Environment : ${env.NODE_ENV}
  🔗 Server      : http://localhost:${PORT}
  📡 API Base    : http://localhost:${PORT}/api
  ❤️  Health      : http://localhost:${PORT}/api/health
  ─────────────────────────────────
  `);
});

// ─── Graceful Shutdown ───────────────────────────────────────
async function gracefulShutdown(signal: string) {
  console.log(`\n📦 ${signal} received. Shutting down gracefully...`);

  server.close(async () => {
    console.log('🔌 HTTP server closed.');

    await prisma.$disconnect();
    console.log('🗄️  Database connection closed.');

    process.exit(0);
  });

  // Force shutdown after 10s
  setTimeout(() => {
    console.error('⚠️  Forced shutdown after timeout.');
    process.exit(1);
  }, 10_000);
}

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

export default app;
