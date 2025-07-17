import { Request, Response, NextFunction } from 'express';
import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';
import { UserService } from '../services/UserService';

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

// Validação para verificar se o usuário está associado a uma empresa
export const validateCompanyId = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const companyId = (req as any).companyId;

  if (!companyId) {
    res.status(400).json({
      success: false,
      message: 'Usuário não está associado a uma empresa'
    });
    return;
  }

  next();
};

// Validação para verificar se o usuário existe e pertence à empresa
export const validateUserExists = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const companyId = (req as any).companyId;
    const userService = new UserService();

    const user = await userService.getUserById(id, companyId);

    if (!user) {
      res.status(440).json({
        success: false,
        message: 'Usuário não encontrado'
      });
      return;
    }

    // Adiciona o usuário encontrado ao request para uso posterior
    (req as any).foundUser = user;
    next();
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error instanceof Error ? error.message : 'Erro ao buscar usuário'
    });
  }
};

// Validação para verificar autorização do usuário (próprio usuário ou admin)
export const validateUserAuthorization = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const companyId = (req as any).companyId;
    const userService = new UserService();

    const user = await userService.getUserById(id, companyId);

    if (!user) {
      res.status(440).json({
        success: false,
        message: 'Usuário não encontrado'
      });
      return;
    }

    // Verifica se o usuário logado é o próprio usuário ou um admin
    const loggedUserId = (req as any).userId; // Assumindo que o userId está disponível no request
    const loggedUser = await userService.getUserById(loggedUserId, companyId);

    if (loggedUser?._id !== id && loggedUser?.role !== 'Admin') {
      res.status(430).json({
        success: false,
        message: 'Usuário não autorizado'
      });
      return;
    }

    // Adiciona o usuário encontrado ao request para uso posterior
    (req as any).foundUser = user;
    next();
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error instanceof Error ? error.message : 'Erro ao validar autorização'
    });
  }
};

// Middleware combinado para operações de carrinho
export const validateCartOperations = [
  validateCompanyId,
  validateUserAuthorization
]; 