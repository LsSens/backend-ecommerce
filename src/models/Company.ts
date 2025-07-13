import mongoose, { Document, Schema } from 'mongoose';

export interface ICompany extends Document {
  name: string;
  cnpj: string;
  address: string;
  userId?: mongoose.Types.ObjectId;
  domains: string[];
  createdAt: Date;
  updatedAt: Date;
}

const companySchema = new Schema<ICompany>({
  name: {
    type: String,
    required: [true, 'Nome da empresa é obrigatório'],
    trim: true,
    minlength: [2, 'Nome deve ter pelo menos 2 caracteres'],
    maxlength: [200, 'Nome deve ter no máximo 200 caracteres']
  },
  cnpj: {
    type: String,
    required: [true, 'CNPJ é obrigatório'],
    unique: true,
    trim: true,
    match: [/^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/, 'CNPJ deve estar no formato XX.XXX.XXX/XXXX-XX']
  },
  address: {
    type: String,
    required: [true, 'Endereço é obrigatório'],
    trim: true
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: false
  },
  domains: {
    type: [String],
    required: [true, 'Domínios são obrigatórios'],
    trim: true,
    minlength: [1, 'Pelo menos um domínio é obrigatório'],
    validate: {
      validator: function(domains: string[]) {
        const uniqueDomains = [...new Set(domains)];
        return uniqueDomains.length === domains.length;
      },
      message: 'Domínios duplicados não são permitidos'
    }
  }
}, {
  timestamps: true
});

export const Company = mongoose.model<ICompany>('Company', companySchema); 