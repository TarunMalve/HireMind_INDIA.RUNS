import dotenv from 'dotenv';
import path from 'path';

// Load .env file from project root
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

interface EnvConfig {
  // Database
  DATABASE_URL: string;

  // Clerk Auth
  CLERK_SECRET_KEY: string;
  CLERK_PUBLISHABLE_KEY: string;

  // OpenAI
  OPENAI_API_KEY: string;

  // Gemini
  GEMINI_API_KEY: string;

  // Pinecone
  PINECONE_API_KEY: string;
  PINECONE_INDEX: string;

  // Server
  PORT: number;
  NODE_ENV: string;
  FRONTEND_URL: string;
}

function getEnvVar(key: string, fallback?: string): string {
  const value = process.env[key] ?? fallback;
  if (value === undefined) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
}

export const env: EnvConfig = {
  DATABASE_URL: getEnvVar('DATABASE_URL'),

  CLERK_SECRET_KEY: getEnvVar('CLERK_SECRET_KEY'),
  CLERK_PUBLISHABLE_KEY: getEnvVar('CLERK_PUBLISHABLE_KEY'),

  OPENAI_API_KEY: getEnvVar('OPENAI_API_KEY', ''),
  GEMINI_API_KEY: getEnvVar('GEMINI_API_KEY', ''),

  PINECONE_API_KEY: getEnvVar('PINECONE_API_KEY', ''),
  PINECONE_INDEX: getEnvVar('PINECONE_INDEX', 'hiremind-embeddings'),

  PORT: parseInt(getEnvVar('PORT', '4000'), 10),
  NODE_ENV: getEnvVar('NODE_ENV', 'development'),
  FRONTEND_URL: getEnvVar('FRONTEND_URL', 'http://localhost:3000'),
};

export const isDev = env.NODE_ENV === 'development';
export const isProd = env.NODE_ENV === 'production';
