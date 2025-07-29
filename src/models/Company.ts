import mongoose, { Document, Schema } from 'mongoose';

export interface ICompanyCustomizations {
  homeBanners: string[];
  brandColors: string[];
  logo?: string;
}

export interface ICart {
  products: mongoose.Types.ObjectId[];
}

export interface ICompany extends Document {
  name: string;
  cnpj: string;
  address: string;
  domains: string[];
  customizations?: ICompanyCustomizations;
  cart?: ICart;
  createdAt: Date;
  updatedAt: Date;
}

const customizationsSchema = new Schema<ICompanyCustomizations>({
  homeBanners: {
    type: [String],
    default: [],
    validate: {
      validator: function(banners: string[]) {
        return banners.length <= 10;
      },
      message: 'Máximo de 10 banners permitidos'
    }
  },
  brandColors: {
    type: [String],
    default: [],
    validate: {
      validator: function(colors: string[]) {
        const hexColorRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
        return colors.every(color => hexColorRegex.test(color)) && colors.length <= 5;
      },
      message: 'Cores devem estar em formato hexadecimal (#FFFFFF) e máximo 5 cores'
    }
  },
  logo: {
    type: String,
    default: null,
    validate: {
      validator: function(url: string) {
        if (!url) return true;
        const urlRegex = /^https?:\/\/.+\.(jpg|jpeg|png|gif|webp)$/i;
        return urlRegex.test(url);
      },
      message: 'Logo deve ser uma URL válida de imagem (jpg, jpeg, png, gif, webp)'
    }
  }
}, { _id: false });

const cartSchema = new Schema<ICart>({  
  products: {
    type: [Schema.Types.ObjectId],
    ref: 'Product',
    default: []
  }
}, { _id: false });

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
  },
  cart: {
    type: cartSchema,
    default: null
  },
  customizations: {
    type: customizationsSchema,
    default: () => ({
      homeBanners: [],
      brandColors: [],
      logo: null
    })
  }
}, {  
  timestamps: true
});

export const Company = mongoose.model<ICompany>('Company', companySchema); 