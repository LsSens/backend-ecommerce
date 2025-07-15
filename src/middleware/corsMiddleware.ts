import { Request, Response, NextFunction } from 'express';
import { Company } from '../models/Company';
import { logger } from '../utils/logger';

export interface AuthenticatedRequest extends Request {
  companyId?: string;
  company?: any;
}

/**
 * Middleware de CORS personalizado que verifica o domínio na tabela company
 * e previne domínios duplicados
 */
export const corsMiddleware = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const origin = req.headers.host;
    
    if (!origin) {
      return next();
    }

    const publicRoutes = ['/health'];
    if (publicRoutes.some(route => req.originalUrl.startsWith(route))) {
      res.header('Access-Control-Allow-Origin', origin);
      res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
      res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
      res.header('Access-Control-Allow-Credentials', 'true');
      
      if (req.method === 'OPTIONS') {
        return res.status(200).end();
      }
      
      return next();
    }

    const domain = extractDomain(origin);
    
    if (!domain) {
      logger.warn(`Origin inválido: ${origin}`);
      return res.status(400).json({
        success: false,
        message: 'Origin inválido'
      });
    }

    // Log para debug
    logger.info(`Procurando domínio: ${domain}`);
    
    const company = await Company.findOne({
      $or: [
        { domains: { $in: [domain] } },
        { domains: { $in: [`http://${domain}`] } },
        { domains: { $in: [`https://${domain}`] } },
        { domains: { $in: [domain.replace('http://', '').replace('https://', '')] } }
      ]
    });

    if (!company) {
      logger.warn(`Domínio não autorizado: ${domain}`);
      return res.status(403).json({
        success: false,
        message: 'Domínio não autorizado'
      });
    }

    req.companyId = company._id.toString();
    req.company = company;

    res.header('Access-Control-Allow-Origin', origin);
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    res.header('Access-Control-Allow-Credentials', 'true');

    if (req.method === 'OPTIONS') {
      return res.status(200).end();
    }

    return next();
  } catch (error) {
    logger.error('Erro no middleware de CORS:', error);
    return res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
};

/**
 * Extrai o domínio de uma URL
 */
function extractDomain(url: string): string | null {
  try {
    const urlWithProtocol = url.startsWith('http://') || url.startsWith('https://') 
      ? url 
      : `http://${url}`;
    
    const urlObj = new URL(urlWithProtocol);
    // Retorna apenas o hostname (host + port se existir)
    return urlObj.host;
  } catch (error) {
    return null;
  }
}

/**
 * Middleware para verificar se um domínio já existe antes de criar/atualizar uma company
 */
export const validateUniqueDomains = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { domains } = req.body;
    
    if (!domains || !Array.isArray(domains)) {
      return res.status(400).json({
        success: false,
        message: 'Domínios são obrigatórios e devem ser um array'
      });
    }

    const uniqueDomains = [...new Set(domains)];
    if (uniqueDomains.length !== domains.length) {
      return res.status(400).json({
        success: false,
        message: 'Domínios duplicados não são permitidos'
      });
    }

    const existingCompany = await Company.findOne({
      domains: { $in: domains },
      ...(req.params.id && { _id: { $ne: req.params.id } })
    });

    if (existingCompany) {
      const conflictingDomains = domains.filter(domain => 
        existingCompany.domains.includes(domain)
      );
      
      return res.status(409).json({
        success: false,
        message: 'Domínios já existem em outra empresa',
        conflictingDomains
      });
    }

    return next();
  } catch (error) {
    logger.error('Erro na validação de domínios únicos:', error);
    return res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
}; 