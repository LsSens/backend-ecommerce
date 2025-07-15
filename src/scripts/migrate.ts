import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { logger } from '../utils/logger';
import { connectDatabase, disconnectDatabase } from '../config/database';

dotenv.config();

const runMigration = async (): Promise<void> => {
  try {
    logger.info('🚀 Iniciando script de migração...');
    
    // Conectar ao banco de dados
    await connectDatabase();
    
    logger.info('✅ Migração concluída com sucesso!');
    
  } catch (error) {
    logger.error('❌ Erro durante a migração:', error);
    process.exit(1);
  } finally {
    // Desconectar do banco de dados
    await disconnectDatabase();
    process.exit(0);
  }
};

// Executar migração se o script for chamado diretamente
if (require.main === module) {
  runMigration();
}

export { runMigration }; 