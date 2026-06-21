import { Request, Response, NextFunction } from 'express';
import { isDev } from '../config/env';

/**
 * Custom application error with HTTP status code.
 */
export class AppError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean;

  constructor(message: string, statusCode: number = 500, isOperational = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    Object.setPrototypeOf(this, AppError.prototype);
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * 404 handler — catches requests that don't match any route.
 */
export function notFoundHandler(
  req: Request,
  _res: Response,
  next: NextFunction
): void {
  next(new AppError(`Route not found: ${req.method} ${req.originalUrl}`, 404));
}

/**
 * Global error handler — must be the last middleware.
 */
export function globalErrorHandler(
  err: Error | AppError,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  // Default values
  let statusCode = 500;
  let message = 'Internal Server Error';
  let details: unknown = undefined;

  if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
  } else if (err.name === 'ZodError') {
    // Zod validation errors
    statusCode = 400;
    message = 'Validation Error';
    details = (err as any).issues;
  } else if (err.name === 'PrismaClientKnownRequestError') {
    const prismaErr = err as any;
    switch (prismaErr.code) {
      case 'P2002':
        statusCode = 409;
        message = `Unique constraint violation on: ${prismaErr.meta?.target}`;
        break;
      case 'P2025':
        statusCode = 404;
        message = 'Record not found';
        break;
      default:
        statusCode = 400;
        message = `Database error: ${prismaErr.code}`;
    }
  } else if (err.name === 'PrismaClientValidationError') {
    statusCode = 400;
    message = 'Invalid data provided';
  }

  // Log the error
  if (statusCode >= 500) {
    console.error('🔥 Server Error:', err);
  } else if (isDev) {
    console.warn('⚠️  Client Error:', err.message);
  }

  res.status(statusCode).json({
    success: false,
    error: {
      message,
      ...(details ? { details } : {}),
      ...(isDev ? { stack: err.stack } : {}),
    },
  });
}
