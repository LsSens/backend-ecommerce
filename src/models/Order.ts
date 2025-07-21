import mongoose, { Document, Schema } from 'mongoose';

// Interface para item do pedido
interface OrderItem {
  productId: mongoose.Types.ObjectId;
  productName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  productImage?: string;
}

// Interface para endereço de entrega
interface DeliveryAddress {
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
  zipCode: string;
}

export interface IOrder extends Document {
  orderNumber: string;
  userId: mongoose.Types.ObjectId;
  companyId: mongoose.Types.ObjectId;
  items: OrderItem[];
  subtotal: number;
  shippingCost: number;
  discount: number;
  total: number;
  status: 'pending' | 'confirmed' | 'preparing' | 'shipped' | 'delivered' | 'cancelled';
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  paymentMethod: 'credit_card' | 'debit_card' | 'pix' | 'bank_transfer' | 'cash';
  deliveryAddress: DeliveryAddress;
  deliveryInstructions?: string;
  estimatedDeliveryDate?: Date;
  actualDeliveryDate?: Date;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const orderItemSchema = new Schema<OrderItem>({
  productId: {
    type: Schema.Types.ObjectId,
    ref: 'Product',
    required: [true, 'ID do produto é obrigatório']
  },
  productName: {
    type: String,
    required: [true, 'Nome do produto é obrigatório']
  },
  quantity: {
    type: Number,
    required: [true, 'Quantidade é obrigatória'],
    min: [1, 'Quantidade deve ser pelo menos 1']
  },
  unitPrice: {
    type: Number,
    required: [true, 'Preço unitário é obrigatório'],
    min: [0, 'Preço unitário não pode ser negativo']
  },
  totalPrice: {
    type: Number,
    required: [true, 'Preço total é obrigatório'],
    min: [0, 'Preço total não pode ser negativo']
  },
  productImage: {
    type: String,
    required: false
  }
});

const deliveryAddressSchema = new Schema<DeliveryAddress>({
  street: {
    type: String,
    required: [true, 'Rua é obrigatória'],
    trim: true
  },
  number: {
    type: String,
    required: [true, 'Número é obrigatório'],
    trim: true
  },
  complement: {
    type: String,
    trim: true
  },
  neighborhood: {
    type: String,
    required: [true, 'Bairro é obrigatório'],
    trim: true
  },
  city: {
    type: String,
    required: [true, 'Cidade é obrigatória'],
    trim: true
  },
  state: {
    type: String,
    required: [true, 'Estado é obrigatório'],
    trim: true
  },
  zipCode: {
    type: String,
    required: [true, 'CEP é obrigatório'],
    trim: true
  }
});

const orderSchema = new Schema<IOrder>({
  orderNumber: {
    type: String,
    required: [true, 'Número do pedido é obrigatório'],
    unique: true,
    trim: true
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'ID do usuário é obrigatório']
  },
  companyId: {
    type: Schema.Types.ObjectId,
    ref: 'Company',
    required: [true, 'ID da empresa é obrigatório']
  },
  items: {
    type: [orderItemSchema],
    required: [true, 'Itens do pedido são obrigatórios'],
    validate: {
      validator: function(items: OrderItem[]) {
        return items && items.length > 0;
      },
      message: 'Pedido deve ter pelo menos um item'
    }
  },
  subtotal: {
    type: Number,
    required: [true, 'Subtotal é obrigatório'],
    min: [0, 'Subtotal não pode ser negativo']
  },
  shippingCost: {
    type: Number,
    required: [true, 'Custo de envio é obrigatório'],
    min: [0, 'Custo de envio não pode ser negativo'],
    default: 0
  },
  discount: {
    type: Number,
    required: [true, 'Desconto é obrigatório'],
    min: [0, 'Desconto não pode ser negativo'],
    default: 0
  },
  total: {
    type: Number,
    required: [true, 'Total é obrigatório'],
    min: [0, 'Total não pode ser negativo']
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'preparing', 'shipped', 'delivered', 'cancelled'],
    default: 'pending',
    required: [true, 'Status é obrigatório']
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'failed', 'refunded'],
    default: 'pending',
    required: [true, 'Status do pagamento é obrigatório']
  },
  paymentMethod: {
    type: String,
    enum: ['credit_card', 'debit_card', 'pix', 'bank_transfer', 'cash'],
    required: [true, 'Método de pagamento é obrigatório']
  },
  deliveryAddress: {
    type: deliveryAddressSchema,
    required: [true, 'Endereço de entrega é obrigatório']
  },
  deliveryInstructions: {
    type: String,
    trim: true
  },
  estimatedDeliveryDate: {
    type: Date
  },
  actualDeliveryDate: {
    type: Date
  },
  notes: {
    type: String,
    trim: true,
    maxlength: [500, 'Observações devem ter no máximo 500 caracteres']
  }
}, {
  timestamps: true
});

// Middleware para gerar número do pedido automaticamente
orderSchema.pre('save', async function(next) {
  if (this.isNew && !this.orderNumber) {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    
    // Buscar o último pedido do dia para gerar sequência
    const lastOrder = await Order.findOne({
      orderNumber: new RegExp(`^${year}${month}${day}`)
    }).sort({ orderNumber: -1 });
    
    let sequence = 1;
    if (lastOrder) {
      const lastSequence = parseInt(lastOrder.orderNumber.slice(-4));
      sequence = lastSequence + 1;
    }
    
    this.orderNumber = `${year}${month}${day}${String(sequence).padStart(4, '0')}`;
  }
  next();
});

// Índices para otimizar consultas
orderSchema.index({ userId: 1, companyId: 1 });
orderSchema.index({ status: 1, companyId: 1 });
orderSchema.index({ paymentStatus: 1, companyId: 1 });
orderSchema.index({ createdAt: -1 });
orderSchema.index({ orderNumber: 1 });

export const Order = mongoose.model<IOrder>('Order', orderSchema); 