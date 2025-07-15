import mongoose from 'mongoose';
import { logger } from '../utils/logger';
import { Company } from '../models/Company';
import { User } from '../models/User';
import { Product } from '../models/Product';
import { Category } from '../models/Category';

export const connectDatabase = async (): Promise<void> => {
  try {
    const mongoUri = process.env.MONGODB_URI;
    
    await mongoose.connect(mongoUri);
    
    logger.info('✅ Conectado ao MongoDB');
    
  } catch (error) {
    logger.error('❌ Erro ao conectar ao MongoDB:', error);
    throw error;
  }
};

export const runMigrations = async (): Promise<void> => {
  try {
    logger.info('🔄 Iniciando migrações do banco de dados...');
    
    await createCollections();
    
    await createIndexes();
    
    await createInitialData();
    
    logger.info('✅ Migrações concluídas com sucesso');
  } catch (error) {
    logger.error('❌ Erro durante as migrações:', error);
    throw error;
  }
};

const createCollections = async (): Promise<void> => {
  try {
    const db = mongoose.connection.db;
    
    const collections = ['users', 'companies', 'products', 'categories'];
    
    for (const collectionName of collections) {
      const collections = await db.listCollections({ name: collectionName }).toArray();
      
      if (collections.length === 0) {
        await db.createCollection(collectionName);
        logger.info(`✅ Coleção '${collectionName}' criada`);
      } else {
        logger.info(`✅ Coleção '${collectionName}' já existe`);
      }
    }
  } catch (error) {
    logger.error('❌ Erro ao criar coleções:', error);
    throw error;
  }
};

const createIndexes = async (): Promise<void> => {
  try {
    // Índices para User
    await createIndexIfNotExists(User.collection, { email: 1, companyId: 1 }, { 
      unique: true, 
      sparse: true,
      background: true,
      name: 'email_company_unique'
    });
    
    await createIndexIfNotExists(User.collection, { cpf: 1, companyId: 1 }, { 
      sparse: true,
      background: true,
      name: 'cpf_company_index'
    });
    
    // Índices para Company
    await createIndexIfNotExists(Company.collection, { cnpj: 1 }, { 
      unique: true,
      background: true,
      name: 'cnpj_unique'
    });
    
    await createIndexIfNotExists(Company.collection, { domains: 1 }, { 
      unique: true,
      sparse: true,
      background: true,
      name: 'domains_unique_index'
    });
    
    // Índices para Product
    await createIndexIfNotExists(Product.collection, { companyId: 1 }, { 
      background: true,
      name: 'product_company_index'
    });
    
    await createIndexIfNotExists(Product.collection, { categoryId: 1 }, { 
      background: true,
      name: 'product_category_index'
    });
    
    await createIndexIfNotExists(Product.collection, { name: 1, companyId: 1 }, { 
      background: true,
      name: 'product_name_company_index'
    });
    
    // Índices para Category
    await createIndexIfNotExists(Category.collection, { companyId: 1 }, { 
      background: true,
      name: 'category_company_index'
    });
    
    await createIndexIfNotExists(Category.collection, { name: 1, companyId: 1 }, { 
      unique: true,
      background: true,
      name: 'category_name_company_unique'
    });
    
    logger.info('✅ Todos os índices criados com sucesso');
  } catch (error) {
    logger.error('❌ Erro ao criar índices:', error);
    throw error;
  }
};

const createIndexIfNotExists = async (collection: any, indexSpec: any, options: any): Promise<void> => {
  try {
    const existingIndexes = await collection.listIndexes().toArray();
    const indexName = options.name;
    
    // Verificar se o índice já existe
    const indexExists = existingIndexes.some(index => 
      index.name === indexName || 
      JSON.stringify(index.key) === JSON.stringify(indexSpec)
    );
    
    if (!indexExists) {
      await collection.createIndex(indexSpec, options);
      logger.info(`✅ Índice '${indexName}' criado`);
    } else {
      logger.info(`✅ Índice '${indexName}' já existe`);
    }
  } catch (error) {
    logger.warn(`⚠️ Erro ao criar índice '${options.name}':`, error);
    // Não vamos falhar a migração por causa de um índice
  }
};

const createInitialData = async (): Promise<void> => {
  try {
    let adminExists = await User.findOne({ role: 'Admin' });
      
    if (!adminExists) {
      adminExists = new User({
        name: 'Administrador',
        email: 'admin@ecommerce.com',
        password: 'admin123',
        role: 'Admin',
      });
      
      await adminExists.save();
      logger.info('✅ Usuário administrador padrão criado');
    }
    
    const companyExists = await Company.findOne();
    
    if (!companyExists) {
      const defaultCompany = new Company({
        name: 'Empresa Padrão',
        cnpj: '12.345.678/0001-90',
        address: 'Rua Exemplo, 123 - São Paulo, SP',
        domains: ['exemplo.com', 'www.exemplo.com', 'localhost:3000']
      });
      
      await defaultCompany.save();

      adminExists.companyId = defaultCompany._id.toString();
      await adminExists.save();

      logger.info('✅ Empresa padrão criada');
    }
    
  } catch (error) {
    logger.error('❌ Erro ao criar dados iniciais:', error);
    logger.warn('⚠️ Dados iniciais não puderam ser criados, mas a migração continuará');
  }
};

export const disconnectDatabase = async (): Promise<void> => {
  try {
    await mongoose.disconnect();
    logger.info('✅ Desconectado do MongoDB');
  } catch (error) {
    logger.error('❌ Erro ao desconectar do MongoDB:', error);
  }
}; 