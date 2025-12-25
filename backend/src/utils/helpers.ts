import { ApiResponse, PaginationParams } from '../types';

/**
 * Create a standardized API response
 */
export const successResponse = <T>(data: T, message: string = 'Success', statusCode: number = 200): ApiResponse<T> => {
  return {
    success: true,
    message,
    data,
    statusCode
  };
};

/**
 * Create a standardized error response
 */
export const errorResponse = (message: string = 'Error', statusCode: number = 500): ApiResponse => {
  return {
    success: false,
    error: message,
    statusCode
  };
};

/**
 * Async handler wrapper to avoid try-catch in controllers
 */
export const asyncHandler = (fn: Function) => (req: any, res: any, next: any) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

/**
 * Pagination helper
 */
export const paginate = (page: string | number = 1, limit: string | number = 10): PaginationParams => {
  const parsedPage = typeof page === 'string' ? parseInt(page, 10) : page;
  const parsedLimit = typeof limit === 'string' ? parseInt(limit, 10) : limit;
  
  const skip = (parsedPage - 1) * parsedLimit;
  
  return {
    page: parsedPage,
    limit: parsedLimit,
    skip
  };
};
