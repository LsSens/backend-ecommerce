import { Request, Response } from 'express';
import { UserService } from '../services/UserService';
import { CreateUserDto, UpdateUserDto, LoginDto } from '../dto/User';

export class UserController {
  private userService: UserService;

  constructor() {
    this.userService = new UserService();
  }

  async register(req: Request, res: Response): Promise<void> {
    try {
      const userData: CreateUserDto = req.body;
      const companyId = (req as any).companyId;
      
      const userDataWithCompany = { ...userData, companyId };
      const user = await this.userService.createUser(userDataWithCompany);

      res.status(201).json({
        success: true,
        message: 'Usuário criado com sucesso',
        data: user
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error instanceof Error ? error.message : 'Erro ao criar usuário'
      });
    }
  }

  async login(req: Request & { companyId?: string }, res: Response): Promise<void> {
    try {
      const companyId = req.companyId;
      const loginData: LoginDto = { ...req.body };
      const { user, token } = await this.userService.login(loginData, companyId);

      res.status(200).json({
        success: true,
        message: 'Login realizado com sucesso',
        data: {
          user,
          token
        }
      });
    } catch (error) {
      res.status(401).json({
        success: false,
        message: error instanceof Error ? error.message : 'Erro no login'
      });
    }
  }

  async updateUser(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const userData: UpdateUserDto = req.body;
      const companyId = (req as any).companyId;
      
      const user = await this.userService.updateUser(id, userData, companyId);
      
      if (!user) {
        res.status(404).json({
          success: false,
          message: 'Usuário não encontrado'
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: 'Usuário atualizado com sucesso',
        data: user
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error instanceof Error ? error.message : 'Erro ao atualizar usuário'
      });
    }
  }

  async deleteUser(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const companyId = (req as any).companyId;
      
      const deleted = await this.userService.deleteUser(id, companyId);
      
      if (!deleted) {
        res.status(404).json({
          success: false,
          message: 'Usuário não encontrado'
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: 'Usuário deletado com sucesso'
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error instanceof Error ? error.message : 'Erro ao deletar usuário'
      });
    }
  }

  async getUserById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const companyId = (req as any).companyId;
      
      const user = await this.userService.getUserById(id, companyId);
      
      if (!user) {
        res.status(404).json({
          success: false,
          message: 'Usuário não encontrado'
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: user
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error instanceof Error ? error.message : 'Erro ao buscar usuário'
      });
    }
  }

  async getAllUsers(req: Request, res: Response): Promise<void> {
    try {
      const companyId = (req as any).companyId;
      
      const users = await this.userService.getAllUsers(companyId);

      res.status(200).json({
        success: true,
        data: users
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error instanceof Error ? error.message : 'Erro ao buscar usuários'
      });
    }
  }

  async getUserCart(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const companyId = (req as any).companyId;

      const cart = await this.userService.getUserCart(id, companyId);
      
      res.status(200).json({
        success: true,
        data: cart
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error instanceof Error ? error.message : 'Erro ao buscar carrinho de compras'
      });
    }
  }

  async addProductToCart(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { productId, quantity } = req.body;
      const companyId = (req as any).companyId;

      const cart = await this.userService.addProductToCart(id, productId, quantity, companyId);

      res.status(200).json({
        success: true,
        message: 'Produto adicionado ao carrinho com sucesso',
        data: cart
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error instanceof Error ? error.message : 'Erro ao adicionar produto ao carrinho'
      });
    }
  }

  async removeProductFromCart(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { productId } = req.body;
      const companyId = (req as any).companyId;

      const cart = await this.userService.removeProductFromCart(id, productId, companyId);

      res.status(200).json({
        success: true,
        message: 'Produto removido do carrinho com sucesso',
        data: cart
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error instanceof Error ? error.message : 'Erro ao remover produto do carrinho'
      });
    }
  }
} 