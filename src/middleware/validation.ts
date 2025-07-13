import { Request, Response, NextFunction } from 'express';
import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';

export const validateDto = (dtoClass: any) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const dtoObject = plainToClass(dtoClass, req.body);
      const errors = await validate(dtoObject);

      if (errors.length > 0) {
        const validationErrors = errors.map(error => ({
          field: error.property,
          constraints: error.constraints
        }));

        res.status(400).json({
          success: false,
          message: 'Erro de validação',
          errors: validationErrors
        });
        return;
      }

      req.body = dtoObject;
      next();
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor'
      });
      return;
    }
  };
}; 