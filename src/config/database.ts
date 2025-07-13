import mongoose from 'mongoose';
import { logger } from '../utils/logger';
import { Company } from '../models/Company';

export const connectDatabase = async (): Promise<void> => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/ecommerce';
    
    await mongoose.connect(mongoUri);
    
    logger.info('✅ Conectado ao MongoDB');
    
    await createUniqueIndexes();
    
  } catch (error) {
    logger.error('❌ Erro ao conectar ao MongoDB:', error);
    throw error;
  }
};

const createUniqueIndexes = async (): Promise<void> => {
  try {
    const existingIndexes = await Company.collection.listIndexes().toArray();
    const domainsIndexExists = existingIndexes.some(index => 
      index.name === 'domains_unique_index' || 
      (index.key && index.key.domains === 1)
    );

    if (!domainsIndexExists) {
      await Company.collection.createIndex(
        { domains: 1 }, 
        { 
          unique: true,
          sparse: true,
          background: true,
          name: 'domains_unique_index'
        }
      );
      
      logger.info('✅ Índices únicos criados com sucesso');
    } else {
      logger.info('✅ Índices únicos já existem');
    }
  } catch (error) {
    logger.error('❌ Erro ao criar índices únicos:', error);
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