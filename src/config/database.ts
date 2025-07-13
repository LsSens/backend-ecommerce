import mongoose from 'mongoose';
import { logger } from '../utils/logger';

export const connectDatabase = async (): Promise<void> => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/ecommerce_white_label';
    
    await mongoose.connect(mongoUri);
    
    logger.info('✅ Conectado ao MongoDB com sucesso');
    
    mongoose.connection.on('error', (error) => {
      logger.error('❌ Erro na conexão com MongoDB:', error);
    });
    
    mongoose.connection.on('disconnected', () => {
      logger.warn('⚠️ Desconectado do MongoDB');
    });
    
  } catch (error) {
    logger.error('❌ Erro ao conectar com MongoDB:', error);
    process.exit(1);
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