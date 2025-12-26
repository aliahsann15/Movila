import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import UserModel from '../models/user.js';

const getSecret = () => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw Object.assign(new Error('JWT secret not configured'), { statusCode: 500 });
  }
  return secret;
};

const signToken = (id: string) => {
  return jwt.sign({ id }, getSecret(), { expiresIn: '7d' });
};

export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { fullName, email, password, bio, profilePictureUrl } = req.body;

    if (!fullName || !email || !password) {
      res.status(400).json({ success: false, error: 'Missing required fields' });
      return;
    }

    const existing = await UserModel.findOne({ email });
    if (existing) {
      res.status(409).json({ success: false, error: 'Email already in use' });
      return;
    }

    const hashed = await bcrypt.hash(password, 10);
    const user = await UserModel.create({
      fullName,
      email,
      password: hashed,
      bio: bio || '',
      profilePictureUrl: profilePictureUrl || ''
    });

    const token = signToken(user._id.toString());
    const sanitized = user.toObject();
    delete (sanitized as any).password;

    res.status(201).json({ success: true, data: { user: sanitized, token } });
  } catch (err) {
    next(err);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(400).json({ success: false, error: 'Missing email or password' });
      return;
    }

    const user = await UserModel.findOne({ email });
    if (!user) {
      res.status(400).json({ success: false, error: 'Invalid credentials' });
      return;
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      res.status(400).json({ success: false, error: 'Invalid credentials' });
      return;
    }

    const token = signToken(user._id.toString());
    const sanitized = user.toObject();
    delete (sanitized as any).password;

    res.status(200).json({ success: true, data: { user: sanitized, token } });
  } catch (err) {
    next(err);
  }
};

export const me = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = (req as any).user;
    if (!user) {
      res.status(401).json({ success: false, error: 'Unauthorized' });
      return;
    }
    res.status(200).json({ success: true, data: user });
  } catch (err) {
    next(err);
  }
};
