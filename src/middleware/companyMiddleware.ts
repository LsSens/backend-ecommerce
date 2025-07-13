import { Request, Response, NextFunction } from 'express';
import { AuthenticatedRequest } from './corsMiddleware';
import { logger } from '../utils/logger';

/**
 * Middleware para garantir que o companyId esteja disponível.
 * Em rotas que precisam de contexto de empresa.
 */
export const requireCompany = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  if (!req.companyId) {
    logger.warn('Tentativa de acessar rota protegida sem companyId');
    return res.status(403).json({
      success: false,
      message: 'Acesso negado: domínio não autorizado'
    });
  }
  
  next();
};

/**
 * Middleware opcional para adicionar companyId quando disponível.
 * Não é necessário para rotas públicas.
 */
export const optionalCompany = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  next();
}; 