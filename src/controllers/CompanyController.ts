import { Request, Response } from 'express';
import { CompanyService } from '../services/CompanyService';
import { CreateCompanyDto, UpdateCompanyDto } from '../dto/CompanyDto';

export class CompanyController {
  private companyService: CompanyService;

  constructor() {
    this.companyService = new CompanyService();
  }

  async createCompany(req: Request, res: Response): Promise<void> {
    try {
      const companyData: CreateCompanyDto = req.body;
      const company = await this.companyService.createCompany(companyData);

      res.status(201).json({
        success: true,
        message: 'Empresa criada com sucesso',
        data: company
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error instanceof Error ? error.message : 'Erro ao criar empresa'
      });
    }
  }

  async updateCompany(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const companyData: UpdateCompanyDto = req.body;
      
      const company = await this.companyService.updateCompany(id, companyData);
      
      if (!company) {
        res.status(404).json({
          success: false,
          message: 'Empresa não encontrada'
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: 'Empresa atualizada com sucesso',
        data: company
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error instanceof Error ? error.message : 'Erro ao atualizar empresa'
      });
    }
  }

  async deleteCompany(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const deleted = await this.companyService.deleteCompany(id);
      
      if (!deleted) {
        res.status(404).json({
          success: false,
          message: 'Empresa não encontrada'
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: 'Empresa deletada com sucesso'
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error instanceof Error ? error.message : 'Erro ao deletar empresa'
      });
    }
  }

  async getCompanyById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const company = await this.companyService.getCompanyById(id);
      
      if (!company) {
        res.status(404).json({
          success: false,
          message: 'Empresa não encontrada'
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: company
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error instanceof Error ? error.message : 'Erro ao buscar empresa'
      });
    }
  }

  async getAllCompanies(req: Request, res: Response): Promise<void> {
    try {
      const companies = await this.companyService.getAllCompanies();

      res.status(200).json({
        success: true,
        data: companies
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error instanceof Error ? error.message : 'Erro ao buscar empresas'
      });
    }
  }

  async getCompaniesByUser(req: Request, res: Response): Promise<void> {
    try {
      const { userId } = req.params;
      const companies = await this.companyService.getCompaniesByUserId(userId);

      res.status(200).json({
        success: true,
        data: companies
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error instanceof Error ? error.message : 'Erro ao buscar empresas do usuário'
      });
    }
  }
} 