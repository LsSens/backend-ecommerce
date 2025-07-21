import { Request, Response } from 'express';
import { OrderService } from '../services/OrderService';
import { CreateOrderDto, UpdateOrderDto } from '../dto/Order';

export class OrderController {
  private orderService: OrderService;

  constructor() {
    this.orderService = new OrderService();
  }

  async createOrder(req: Request, res: Response): Promise<void> {
    try {
      const orderData: CreateOrderDto = req.body;
      const order = await this.orderService.createOrder(orderData);

      res.status(201).json({
        success: true,
        message: 'Pedido criado com sucesso',
        data: order
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message || 'Erro ao criar pedido',
        error: error.message
      });
    }
  }

  async getAllOrders(req: Request, res: Response): Promise<void> {
    try {
      const { companyId, userId, status } = req.query;
      
      const orders = await this.orderService.getAllOrders(
        companyId as string,
        userId as string,
        status as string
      );

      res.status(200).json({
        success: true,
        message: 'Pedidos encontrados com sucesso',
        data: orders,
        count: orders.length
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || 'Erro ao buscar pedidos',
        error: error.message
      });
    }
  }

  async getOrderById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const order = await this.orderService.getOrderById(id);

      if (!order) {
        res.status(404).json({
          success: false,
          message: 'Pedido não encontrado'
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: 'Pedido encontrado com sucesso',
        data: order
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || 'Erro ao buscar pedido',
        error: error.message
      });
    }
  }

  async getOrderByNumber(req: Request, res: Response): Promise<void> {
    try {
      const { orderNumber } = req.params;
      const order = await this.orderService.getOrderByNumber(orderNumber);

      if (!order) {
        res.status(404).json({
          success: false,
          message: 'Pedido não encontrado'
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: 'Pedido encontrado com sucesso',
        data: order
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || 'Erro ao buscar pedido',
        error: error.message
      });
    }
  }

  async updateOrder(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const updateData: UpdateOrderDto = req.body;

      const order = await this.orderService.updateOrder(id, updateData);

      if (!order) {
        res.status(404).json({
          success: false,
          message: 'Pedido não encontrado'
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: 'Pedido atualizado com sucesso',
        data: order
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message || 'Erro ao atualizar pedido',
        error: error.message
      });
    }
  }

  async deleteOrder(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const deleted = await this.orderService.deleteOrder(id);

      if (!deleted) {
        res.status(404).json({
          success: false,
          message: 'Pedido não encontrado'
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: 'Pedido removido com sucesso'
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || 'Erro ao remover pedido',
        error: error.message
      });
    }
  }

  async getOrdersByStatus(req: Request, res: Response): Promise<void> {
    try {
      const { status } = req.params;
      const { companyId } = req.query;

      const orders = await this.orderService.getOrdersByStatus(status, companyId as string);

      res.status(200).json({
        success: true,
        message: `Pedidos com status ${status} encontrados com sucesso`,
        data: orders,
        count: orders.length
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || 'Erro ao buscar pedidos por status',
        error: error.message
      });
    }
  }

  async getOrdersByUser(req: Request, res: Response): Promise<void> {
    try {
      const { userId } = req.params;
      const { companyId } = req.query;

      const orders = await this.orderService.getOrdersByUser(userId, companyId as string);

      res.status(200).json({
        success: true,
        message: 'Pedidos do usuário encontrados com sucesso',
        data: orders,
        count: orders.length
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || 'Erro ao buscar pedidos do usuário',
        error: error.message
      });
    }
  }

  async getOrderStatistics(req: Request, res: Response): Promise<void> {
    try {
      const { companyId } = req.query;
      const stats = await this.orderService.getOrderStatistics(companyId as string);

      res.status(200).json({
        success: true,
        message: 'Estatísticas dos pedidos encontradas com sucesso',
        data: stats
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || 'Erro ao buscar estatísticas dos pedidos',
        error: error.message
      });
    }
  }

  async updateOrderStatus(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { status } = req.body;

      if (!status) {
        res.status(400).json({
          success: false,
          message: 'Status é obrigatório'
        });
        return;
      }

      const order = await this.orderService.updateOrderStatus(id, status);

      if (!order) {
        res.status(404).json({
          success: false,
          message: 'Pedido não encontrado'
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: 'Status do pedido atualizado com sucesso',
        data: order
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message || 'Erro ao atualizar status do pedido',
        error: error.message
      });
    }
  }
} 