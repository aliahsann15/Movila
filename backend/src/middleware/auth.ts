import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import UserModel from '../models/user.js';

const getSecret = () => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw Object.assign(new Error('JWT secret not configured'), { statusCode: 500 });
  }
  return secret;
};

export const requireAuth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const header = req.headers.authorization || '';
    const [scheme, token] = header.split(' ');

    if (scheme !== 'Bearer' || !token) {
      res.status(401).json({ success: false, error: 'Authorization token missing' });
      return;
    }

    const payload = jwt.verify(token, getSecret()) as { id: string };
    const user = await UserModel.findById(payload.id).select('-password');
    if (!user) {
      res.status(401).json({ success: false, error: 'Invalid token user' });
      return;
    }

    (req as any).user = user;
    next();
  } catch (err) {
    next(err as any);
  }
};

export default requireAuth;
