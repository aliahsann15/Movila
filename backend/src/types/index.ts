import { Request, Response, NextFunction } from 'express';

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  count?: number;
  error?: string;
  details?: any;
  statusCode?: number;
  stack?: string;
}

export interface PaginationParams {
  page: number;
  limit: number;
  skip: number;
}

export interface QueryParams {
  page?: string;
  limit?: string;
  sort?: string;
  order?: 'asc' | 'desc';
}

export interface ErrorResponse {
  success: false;
  error: string;
  details?: any;
  stack?: string;
}

export interface RequestWithUser extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
  };
}
