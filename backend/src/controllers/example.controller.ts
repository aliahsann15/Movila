import { Request, Response, NextFunction } from 'express';
import { ApiResponse } from '../types';

interface ExampleItem {
  id: number | string;
  name: string;
}

// Example controller demonstrating basic CRUD operations
// Replace with your actual business logic

export const getAll = async (req: Request, res: Response<ApiResponse<ExampleItem[]>>, next: NextFunction): Promise<void> => {
  try {
    // TODO: Implement database query
    const data: ExampleItem[] = [
      { id: 1, name: 'Example 1' },
      { id: 2, name: 'Example 2' }
    ];

    res.status(200).json({
      success: true,
      count: data.length,
      data
    });
  } catch (error) {
    next(error);
  }
};

export const getById = async (req: Request, res: Response<ApiResponse<ExampleItem>>, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    
    // TODO: Implement database query
    const data: ExampleItem = { id, name: `Example ${id}` };

    if (!data) {
      res.status(404).json({
        success: false,
        error: 'Resource not found'
      });
      return;
    }

    res.status(200).json({
      success: true,
      data
    });
  } catch (error) {
    next(error);
  }
};

export const create = async (req: Request, res: Response<ApiResponse<ExampleItem>>, next: NextFunction): Promise<void> => {
  try {
    const { name } = req.body;

    // TODO: Implement database insert
    const data: ExampleItem = { id: Date.now(), name };

    res.status(201).json({
      success: true,
      data
    });
  } catch (error) {
    next(error);
  }
};

export const update = async (req: Request, res: Response<ApiResponse<ExampleItem>>, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    // TODO: Implement database update
    const data: ExampleItem = { id, name };

    res.status(200).json({
      success: true,
      data
    });
  } catch (error) {
    next(error);
  }
};

export const remove = async (req: Request, res: Response<ApiResponse>, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;

    // TODO: Implement database delete
    
    res.status(200).json({
      success: true,
      message: 'Resource deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};
