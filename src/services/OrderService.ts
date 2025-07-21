import { Order, IOrder } from '../models/Order';
import { Product } from '../models/Product';
import { User } from '../models/User';
import { Company } from '../models/Company';
import { CreateOrderDto, UpdateOrderDto } from '../dto/Order';
import mongoose from 'mongoose';

export class OrderService {
  async createOrder(orderData: CreateOrderDto): Promise<IOrder> {
    try {
      // Verificar se o usuário existe
      const user = await User.findById(orderData.userId);
      if (!user) {
        throw new Error('Usuário não encontrado');
      }

      // Verificar se a empresa existe
      const company = await Company.findById(orderData.companyId);
      if (!company) {
        throw new Error('Empresa não encontrada');
      }

      // Verificar se todos os produtos existem e têm estoque suficiente
      for (const item of orderData.items) {
        const product = await Product.findById(item.productId);
        if (!product) {
          throw new Error(`Produto ${item.productName} não encontrado`);
        }
        if (product.quantity < item.quantity) {
          throw new Error(`Estoque insuficiente para o produto ${item.productName}`);
        }
      }

      // Calcular valores se não fornecidos
      if (!orderData.shippingCost) {
        orderData.shippingCost = 0;
      }
      if (!orderData.discount) {
        orderData.discount = 0;
      }

      // Criar o pedido
      const order = new Order(orderData);
      const savedOrder = await order.save();

      // Atualizar estoque dos produtos
      for (const item of orderData.items) {
        await Product.findByIdAndUpdate(item.productId, {
          $inc: { quantity: -item.quantity }
        });
      }

      return savedOrder;
    } catch (error) {
      throw error;
    }
  }

  async getAllOrders(companyId?: string, userId?: string, status?: string): Promise<IOrder[]> {
    try {
      const filter: any = {};

      if (companyId) {
        filter.companyId = companyId;
      }

      if (userId) {
        filter.userId = userId;
      }

      if (status) {
        filter.status = status;
      }

      const orders = await Order.find(filter)
        .populate('userId', 'name email')
        .populate('companyId', 'name')
        .populate('items.productId', 'name images')
        .sort({ createdAt: -1 });

      return orders;
    } catch (error) {
      throw error;
    }
  }

  async getOrderById(id: string): Promise<IOrder | null> {
    try {
      const order = await Order.findById(id)
        .populate('userId', 'name email phone address')
        .populate('companyId', 'name')
        .populate('items.productId', 'name images description');

      return order;
    } catch (error) {
      throw error;
    }
  }

  async getOrderByNumber(orderNumber: string): Promise<IOrder | null> {
    try {
      const order = await Order.findOne({ orderNumber })
        .populate('userId', 'name email phone address')
        .populate('companyId', 'name')
        .populate('items.productId', 'name images description');

      return order;
    } catch (error) {
      throw error;
    }
  }

  async updateOrder(id: string, updateData: UpdateOrderDto): Promise<IOrder | null> {
    try {
      const order = await Order.findById(id);
      if (!order) {
        throw new Error('Pedido não encontrado');
      }

      // Se o status está sendo alterado para 'cancelled', restaurar estoque
      if (updateData.status === 'cancelled' && order.status !== 'cancelled') {
        for (const item of order.items) {
          await Product.findByIdAndUpdate(item.productId, {
            $inc: { quantity: item.quantity }
          });
        }
      }

      // Se o status está sendo alterado de 'cancelled' para outro, reduzir estoque novamente
      if (order.status === 'cancelled' && updateData.status && updateData.status !== 'cancelled') {
        for (const item of order.items) {
          await Product.findByIdAndUpdate(item.productId, {
            $inc: { quantity: -item.quantity }
          });
        }
      }

      const updatedOrder = await Order.findByIdAndUpdate(
        id,
        updateData,
        { new: true, runValidators: true }
      ).populate('userId', 'name email')
       .populate('companyId', 'name')
       .populate('items.productId', 'name images');

      return updatedOrder;
    } catch (error) {
      throw error;
    }
  }

  async deleteOrder(id: string): Promise<boolean> {
    try {
      const order = await Order.findById(id);
      if (!order) {
        throw new Error('Pedido não encontrado');
      }

      // Restaurar estoque se o pedido não estiver cancelado
      if (order.status !== 'cancelled') {
        for (const item of order.items) {
          await Product.findByIdAndUpdate(item.productId, {
            $inc: { quantity: item.quantity }
          });
        }
      }

      await Order.findByIdAndDelete(id);
      return true;
    } catch (error) {
      throw error;
    }
  }

  async getOrdersByStatus(status: string, companyId?: string): Promise<IOrder[]> {
    try {
      const filter: any = { status };

      if (companyId) {
        filter.companyId = companyId;
      }

      const orders = await Order.find(filter)
        .populate('userId', 'name email')
        .populate('companyId', 'name')
        .populate('items.productId', 'name images')
        .sort({ createdAt: -1 });

      return orders;
    } catch (error) {
      throw error;
    }
  }

  async getOrdersByUser(userId: string, companyId?: string): Promise<IOrder[]> {
    try {
      const filter: any = { userId };

      if (companyId) {
        filter.companyId = companyId;
      }

      const orders = await Order.find(filter)
        .populate('userId', 'name email')
        .populate('companyId', 'name')
        .populate('items.productId', 'name images')
        .sort({ createdAt: -1 });

      return orders;
    } catch (error) {
      throw error;
    }
  }

  async getOrderStatistics(companyId?: string): Promise<any> {
    try {
      const filter: any = {};
      if (companyId) {
        filter.companyId = companyId;
      }

      const stats = await Order.aggregate([
        { $match: filter },
        {
          $group: {
            _id: null,
            totalOrders: { $sum: 1 },
            totalRevenue: { $sum: '$total' },
            averageOrderValue: { $avg: '$total' },
            pendingOrders: {
              $sum: { $cond: [{ $eq: ['$status', 'pending'] }, 1, 0] }
            },
            confirmedOrders: {
              $sum: { $cond: [{ $eq: ['$status', 'confirmed'] }, 1, 0] }
            },
            preparingOrders: {
              $sum: { $cond: [{ $eq: ['$status', 'preparing'] }, 1, 0] }
            },
            shippedOrders: {
              $sum: { $cond: [{ $eq: ['$status', 'shipped'] }, 1, 0] }
            },
            deliveredOrders: {
              $sum: { $cond: [{ $eq: ['$status', 'delivered'] }, 1, 0] }
            },
            cancelledOrders: {
              $sum: { $cond: [{ $eq: ['$status', 'cancelled'] }, 1, 0] }
            }
          }
        }
      ]);

      return stats[0] || {
        totalOrders: 0,
        totalRevenue: 0,
        averageOrderValue: 0,
        pendingOrders: 0,
        confirmedOrders: 0,
        preparingOrders: 0,
        shippedOrders: 0,
        deliveredOrders: 0,
        cancelledOrders: 0
      };
    } catch (error) {
      throw error;
    }
  }

  async updateOrderStatus(id: string, status: string): Promise<IOrder | null> {
    try {
      const order = await Order.findById(id);
      if (!order) {
        throw new Error('Pedido não encontrado');
      }

      // Lógica específica para mudanças de status
      if (status === 'delivered' && order.status !== 'delivered') {
        order.actualDeliveryDate = new Date();
      }

      if (status === 'shipped' && order.status !== 'shipped') {
        // Definir data estimada de entrega (exemplo: 3-5 dias úteis)
        const estimatedDate = new Date();
        estimatedDate.setDate(estimatedDate.getDate() + 5);
        order.estimatedDeliveryDate = estimatedDate;
      }

      order.status = status as any;
      const updatedOrder = await order.save();

      return updatedOrder;
    } catch (error) {
      throw error;
    }
  }
} 