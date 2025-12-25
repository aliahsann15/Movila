import { Request, Response, NextFunction } from 'express';
import { RequestWithUser } from '../types';

// Example: Request logging middleware
export const requestLogger = (req: Request, res: Response, next: NextFunction): void => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
};

// Example: Authentication middleware (placeholder)
export const authenticate = (req: RequestWithUser, res: Response, next: NextFunction): void => {
  // TODO: Implement authentication logic
  // Check for token in headers, verify it, attach user to req
  
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    res.status(401).json({
      success: false,
      error: 'No token provided'
    });
    return;
  }

  // TODO: Verify token and attach user to request
  // req.user = decodedUser;
  
  next();
};

// Example: Authorization middleware
export const authorize = (...roles: string[]) => {
  return (req: RequestWithUser, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({
        success: false,
        error: 'Authentication required'
      });
      return;
    }

    if (!roles.includes(req.user.role)) {
      res.status(403).json({
        success: false,
        error: 'Insufficient permissions'
      });
      return;
    }

    next();
  };
};
