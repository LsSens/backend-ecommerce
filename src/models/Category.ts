import mongoose, { Document, Schema } from 'mongoose';

export interface ICategory extends Document {
  name: string;
  companyId: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const categorySchema = new Schema<ICategory>({
  name: {
    type: String,
    required: [true, 'Nome da categoria é obrigatório'],
    trim: true,
    minlength: [2, 'Nome deve ter pelo menos 2 caracteres'],
    maxlength: [100, 'Nome deve ter no máximo 100 caracteres']
  },
  companyId: {
    type: Schema.Types.ObjectId,
    ref: 'Company',
    required: [true, 'ID da empresa é obrigatório']
  }
}, {
  timestamps: true
});

export const Category = mongoose.model<ICategory>('Category', categorySchema); 