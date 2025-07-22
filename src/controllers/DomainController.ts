import { Request, Response } from 'express';
import { DomainService } from "../services/DomainService";

export class DomainController {
    private domainService: DomainService;
  
    constructor() {
      this.domainService = new DomainService();
    }

    async postVerifyDomain(req: Request, res: Response): Promise<void> {
        try {
          const { domain } = req.body;
    
          const data = await this.domainService.verifyCompanyDomain(domain);
    
          res.status(data.status).json({
            success: true,
            message: 'Domínio verificado',
            data
          });
        } catch (error) {
          res.status(400).json({
            success: false,
            message: error instanceof Error ? error.message : 'Erro ao verificar domínio'
          });
        }
      }
    }