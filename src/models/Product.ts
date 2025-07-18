import mongoose, { Document, Schema } from 'mongoose';

// Interface para a estrutura de uma variável
interface ProductVariable {
  quantity: number;
  price: number;
  image: string;
  name: string;
}

export interface IProduct extends Document {
  name: string;
  companyId: mongoose.Types.ObjectId;
  description: string;
  price: number;
  categoryId?: mongoose.Types.ObjectId;
  image?: string;
  variables?: ProductVariable[];
  quantity: number;
  createdAt: Date;
  updatedAt: Date;
}

const productSchema = new Schema<IProduct>({
  name: {
    type: String,
    required: [true, 'Nome do produto é obrigatório'],
    trim: true,
    minlength: [2, 'Nome deve ter pelo menos 2 caracteres'],
    maxlength: [200, 'Nome deve ter no máximo 200 caracteres']
  },
  companyId: {
    type: Schema.Types.ObjectId,
    ref: 'Company',
    required: [true, 'ID da empresa é obrigatório']
  },
  description: {
    type: String,
    required: [true, 'Descrição é obrigatória'],
    trim: true,
    minlength: [10, 'Descrição deve ter pelo menos 10 caracteres'],
    maxlength: [1000, 'Descrição deve ter no máximo 1000 caracteres']
  },
  price: {
    type: Number,
    required: [true, 'Preço é obrigatório'],
    min: [0, 'Preço não pode ser negativo']
  },
  categoryId: {
    type: Schema.Types.ObjectId,
    ref: 'Category',
    required: false
  },
  image: {
    type: String,
    required: false
  },
  variables: {
    type: [{
      quantity: { type: Number, required: true },
      price: { type: Number, required: true },
      image: { type: String, required: true },
      name: { type: String, required: true }
    }],
    required: false
  },
  quantity: {
    type: Number,
    required: [true, 'Quantidade é obrigatória'],
    min: [0, 'Quantidade não pode ser negativa']
  }
}, {
  timestamps: true
});

export const Product = mongoose.model<IProduct>('Product', productSchema); 