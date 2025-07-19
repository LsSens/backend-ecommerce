import dotenv from 'dotenv';
import { logger } from '../utils/logger';
import { connectDatabase, disconnectDatabase, runMigrations } from '../config/database';

dotenv.config();

const runMigration = async (): Promise<void> => {
  try {
    logger.info('🚀 Iniciando script de migração...');
    
    await connectDatabase();
    
    await runMigrations();
    
  } catch (error) {
    logger.error('❌ Erro durante a migração:', error);
    process.exit(1);
  } finally {
    await disconnectDatabase();
    process.exit(0);
  }
};

// Executar migração se o script for chamado diretamente
if (require.main === module) {
  runMigration();
}

export { runMigration }; 