import type { Response, NextFunction } from 'express';
import type { AuthenticatedRequest } from './auth';
import { prisma } from '@pariconnect/db';

export async function audit(action: string, req: AuthenticatedRequest, metadata?: Record<string, unknown>) {
  if (!req.user) return;
  await prisma.auditLog.create({
    data: {
      userId: req.user.id,
      action,
      metadata
    }
  });
}

export function auditMiddleware(action: string) {
  return async (req: AuthenticatedRequest, _res: Response, next: NextFunction) => {
    await audit(action, req, { path: req.path, method: req.method });
    next();
  };
}
