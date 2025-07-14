import { Request, Response } from 'express';
import { CategoryService } from '../services/CategoryService';
import { CreateCategoryDto, UpdateCategoryDto } from '../dto/CategoryDto';

export class CategoryController {
  private categoryService: CategoryService;

  constructor() {
    this.categoryService = new CategoryService();
  }

  async createCategory(req: Request, res: Response): Promise<void> {
    try {
      const categoryData: CreateCategoryDto = req.body;
      const companyId = (req as any).user.companyId;
      
      if (!companyId) {
        res.status(400).json({
          success: false,
          message: 'Usuário não está associado a uma empresa'
        });
        return;
      }

      const category = await this.categoryService.createCategory(categoryData, companyId);

      res.status(201).json({
        success: true,
        message: 'Categoria criada com sucesso',
        data: category
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error instanceof Error ? error.message : 'Erro ao criar categoria'
      });
    }
  }

  async updateCategory(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const categoryData: UpdateCategoryDto = req.body;
      const companyId = (req as any).user.companyId;
      
      if (!companyId) {
        res.status(400).json({
          success: false,
          message: 'Usuário não está associado a uma empresa'
        });
        return;
      }
      
      const category = await this.categoryService.updateCategory(id, categoryData, companyId);
      
      if (!category) {
        res.status(404).json({
          success: false,
          message: 'Categoria não encontrada'
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: 'Categoria atualizada com sucesso',
        data: category
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error instanceof Error ? error.message : 'Erro ao atualizar categoria'
      });
    }
  }

  async deleteCategory(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const companyId = (req as any).user.companyId;
      
      if (!companyId) {
        res.status(400).json({
          success: false,
          message: 'Usuário não está associado a uma empresa'
        });
        return;
      }
      
      const deleted = await this.categoryService.deleteCategory(id, companyId);
      
      if (!deleted) {
        res.status(404).json({
          success: false,
          message: 'Categoria não encontrada'
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: 'Categoria deletada com sucesso'
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error instanceof Error ? error.message : 'Erro ao deletar categoria'
      });
    }
  }

  async getCategoryById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const companyId = (req as any).user.companyId;
      
      if (!companyId) {
        res.status(400).json({
          success: false,
          message: 'Usuário não está associado a uma empresa'
        });
        return;
      }
      
      const category = await this.categoryService.getCategoryById(id, companyId);
      
      if (!category) {
        res.status(404).json({
          success: false,
          message: 'Categoria não encontrada'
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: category
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error instanceof Error ? error.message : 'Erro ao buscar categoria'
      });
    }
  }

  async getAllCategories(req: Request, res: Response): Promise<void> {
    try {
      const companyId = (req as any).user.companyId;
      
      if (!companyId) {
        res.status(400).json({
          success: false,
          message: 'Usuário não está associado a uma empresa'
        });
        return;
      }
      
      const categories = await this.categoryService.getAllCategories(companyId);

      res.status(200).json({
        success: true,
        data: categories
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error instanceof Error ? error.message : 'Erro ao buscar categorias'
      });
    }
  }

  async searchCategories(req: Request, res: Response): Promise<void> {
    try {
      const { q } = req.query;
      const companyId = (req as any).user.companyId;
      
      if (!companyId) {
        res.status(400).json({
          success: false,
          message: 'Usuário não está associado a uma empresa'
        });
        return;
      }
      
      if (!q || typeof q !== 'string') {
        res.status(400).json({
          success: false,
          message: 'Parâmetro de busca é obrigatório'
        });
        return;
      }

      const categories = await this.categoryService.searchCategories(q, companyId);

      res.status(200).json({
        success: true,
        data: categories
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error instanceof Error ? error.message : 'Erro ao buscar categorias'
      });
    }
  }
} 