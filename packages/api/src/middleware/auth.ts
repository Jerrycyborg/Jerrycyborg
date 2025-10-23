import type { Request, Response, NextFunction } from 'express';
import createHttpError from 'http-errors';
import type { ApiContextUser } from '@pariconnect/types';

export interface AuthenticatedRequest extends Request {
  user?: ApiContextUser;
}

export function mockAuth(req: AuthenticatedRequest, _res: Response, next: NextFunction) {
  const role = (req.headers['x-user-role'] as string) || 'CHILD';
  const userId = (req.headers['x-user-id'] as string) || 'seed-child';

  req.user = {
    id: userId,
    role: role as ApiContextUser['role'],
    email: `${role.toLowerCase()}@example.com`
  };

  next();
}

export function requireRole(...roles: ApiContextUser['role'][]) {
  return (req: AuthenticatedRequest, _res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(createHttpError(401, 'Unauthenticated'));
    }
    if (!roles.includes(req.user.role)) {
      return next(createHttpError(403, 'Insufficient permissions'));
    }
    next();
  };
}
