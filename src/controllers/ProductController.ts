import { Request, Response } from 'express';
import { ProductService } from '../services/ProductService';
import { CreateProductDto, UpdateProductDto } from '../dto/ProductDto';

export class ProductController {
  private productService: ProductService;

  constructor() {
    this.productService = new ProductService();
  }

  async createProduct(req: Request, res: Response): Promise<void> {
    try {
      const productData: CreateProductDto = req.body;
      const companyId = (req as any).companyId;
      
      if (!companyId) {
        res.status(400).json({
          success: false,
          message: 'Usuário não está associado a uma empresa'
        });
        return;
      }

      const product = await this.productService.createProduct(productData, companyId);

      res.status(201).json({
        success: true,
        message: 'Produto criado com sucesso',
        data: product
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error instanceof Error ? error.message : 'Erro ao criar produto'
      });
    }
  }

  async updateProduct(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const productData: UpdateProductDto = req.body;
      const companyId = (req as any).companyId;
      
      if (!companyId) {
        res.status(400).json({
          success: false,
          message: 'Usuário não está associado a uma empresa'
        });
        return;
      }
      
      const product = await this.productService.updateProduct(id, productData, companyId);
      
      if (!product) {
        res.status(404).json({
          success: false,
          message: 'Produto não encontrado'
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: 'Produto atualizado com sucesso',
        data: product
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error instanceof Error ? error.message : 'Erro ao atualizar produto'
      });
    }
  }

  async deleteProduct(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const companyId = (req as any).companyId;
      
      if (!companyId) {
        res.status(400).json({
          success: false,
          message: 'Usuário não está associado a uma empresa'
        });
        return;
      }
      
      const deleted = await this.productService.deleteProduct(id, companyId);
      
      if (!deleted) {
        res.status(404).json({
          success: false,
          message: 'Produto não encontrado'
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: 'Produto deletado com sucesso'
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error instanceof Error ? error.message : 'Erro ao deletar produto'
      });
    }
  }

  async getProductById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const companyId = (req as any).companyId;
      
      if (!companyId) {
        res.status(400).json({
          success: false,
          message: 'Usuário não está associado a uma empresa'
        });
        return;
      }
      
      const product = await this.productService.getProductById(id, companyId);
      
      if (!product) {
        res.status(404).json({
          success: false,
          message: 'Produto não encontrado'
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: product
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error instanceof Error ? error.message : 'Erro ao buscar produto'
      });
    }
  }

  async getAllProducts(req: Request, res: Response): Promise<void> {
    try {
      const companyId = (req as any).companyId;
      
      if (!companyId) {
        res.status(400).json({
          success: false,
          message: 'Usuário não está associado a uma empresa'
        });
        return;
      }
      
      const products = await this.productService.getAllProducts(companyId);

      res.status(200).json({
        success: true,
        data: products
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error instanceof Error ? error.message : 'Erro ao buscar produtos'
      });
    }
  }

  async getProductsByCategory(req: Request, res: Response): Promise<void> {
    try {
      const { categoryId } = req.params;
      const companyId = (req as any).companyId;
      
      if (!companyId) {
        res.status(400).json({
          success: false,
          message: 'Usuário não está associado a uma empresa'
        });
        return;
      }
      
      const products = await this.productService.getProductsByCategory(categoryId, companyId);

      res.status(200).json({
        success: true,
        data: products
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error instanceof Error ? error.message : 'Erro ao buscar produtos da categoria'
      });
    }
  }

  async getProductsByCompany(req: Request, res: Response): Promise<void> {
    try {
      const { companyId } = req.params;
      const products = await this.productService.getProductsByCompany(companyId);

      res.status(200).json({
        success: true,
        data: products
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error instanceof Error ? error.message : 'Erro ao buscar produtos da empresa'
      });
    }
  }

  async searchProducts(req: Request, res: Response): Promise<void> {
    try {
      const { q } = req.query;
      const companyId = (req as any).companyId;
      
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

      const products = await this.productService.searchProducts(q, companyId);

      res.status(200).json({
        success: true,
        data: products
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error instanceof Error ? error.message : 'Erro ao buscar produtos'
      });
    }
  }
} 