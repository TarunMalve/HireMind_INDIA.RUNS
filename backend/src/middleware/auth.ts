import { Request, Response, NextFunction } from 'express';
import { clerkMiddleware, getAuth, requireAuth } from '@clerk/express';
import prisma from '../config/database';

// Extend Express Request to include our user info
declare global {
  namespace Express {
    interface Request {
      userId?: string;
      userRole?: string;
      clerkUserId?: string;
    }
  }
}

/**
 * Initialize Clerk middleware — must be mounted early in the middleware chain.
 * This sets up the auth context on every request.
 */
export const clerkAuth = clerkMiddleware();

/**
 * Require authentication — returns 401 if no valid session.
 */
export const requireAuthentication = requireAuth();

/**
 * After Clerk verifies the JWT, this middleware resolves the Clerk user ID
 * to our internal User record and attaches userId + role to the request.
 */
export async function attachUser(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const auth = getAuth(req);
    const clerkUserId = auth.userId;

    if (!clerkUserId) {
      res.status(401).json({ error: 'Not authenticated' });
      return;
    }

    req.clerkUserId = clerkUserId;

    // Look up internal user by Clerk ID
    const user = await prisma.user.findUnique({
      where: { clerkId: clerkUserId },
      select: { id: true, role: true },
    });

    if (user) {
      req.userId = user.id;
      req.userRole = user.role;
    }

    next();
  } catch (error) {
    next(error);
  }
}

/**
 * Role-based authorization middleware factory.
 */
export function requireRole(...roles: string[]) {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.userRole || !roles.includes(req.userRole)) {
      res.status(403).json({ error: 'Insufficient permissions' });
      return;
    }
    next();
  };
}
