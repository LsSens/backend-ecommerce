import 'reflect-metadata';
import 'module-alias/register';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';

import { connectDatabase } from './config/database';
import { errorHandler, notFoundHandler } from './middleware/errorHandler';
import { corsMiddleware } from './middleware/corsMiddleware';
import { logger } from './utils/logger';

import userRoutes from './routes/userRoutes';
import productRoutes from './routes/productRoutes';
import categoryRoutes from './routes/categoryRoutes';
import orderRoutes from './routes/orderRoutes';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './swagger';
import serverless from 'serverless-http';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(helmet());

startServer();

app.use('/api', corsMiddleware);

app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? false
    : ['http://localhost:3000', 'http://localhost:3001'],
  credentials: true
}));

const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'),
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100'),
  message: {
    success: false,
    message: 'Muitas requisições, tente novamente mais tarde'
  }
});
app.use(limiter);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

app.use((req, res, next) => {
  logger.info(`${req.method} ${req.path} - ${req.ip}`);
  next();
});

app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/orders', orderRoutes);

app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'API funcionando corretamente',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

app.use(notFoundHandler);
app.use(errorHandler);

const isPortAvailable = (port: number): Promise<boolean> => {
  return new Promise((resolve) => {
    const net = require('net');
    const server = net.createServer();
    server.listen(port, () => {
      server.close();
      resolve(true);
    });
    server.on('error', () => {
      resolve(false);
    });
  });
};

const findAvailablePort = async (startPort: number): Promise<number> => {
  let port = startPort;
  while (!(await isPortAvailable(port))) {
    port++;
    if (port > startPort + 10) {
      throw new Error('Não foi possível encontrar uma porta disponível');
    }
  }
  return port;
};

async function startServer() {
  try {

    await connectDatabase();
    
    const availablePort = await findAvailablePort(parseInt(PORT.toString()));
    
    const server = app.listen(availablePort, () => {
      logger.info(`🚀 Servidor rodando na porta ${availablePort}`);
      logger.info(`📊 Ambiente: ${process.env.NODE_ENV || 'development'}`);
      logger.info(`🔗 Health check: http://localhost:${availablePort}/health`);
      logger.info(`📚 Swagger docs: http://localhost:${availablePort}/api/docs`);
    });

    server.on('close', () => {
      logger.info('Servidor fechado');
    });

  } catch (error) {
    logger.error('❌ Erro ao iniciar servidor:', error);
    process.exit(1);
  }
};

process.on('SIGTERM', () => {
  logger.info('SIGTERM recebido, encerrando servidor...');
  process.exit(0);
});

process.on('SIGINT', () => {
  logger.info('SIGINT recebido, encerrando servidor...');
  process.exit(0);
});

process.on('uncaughtException', (error) => {
  logger.error('Erro não capturado:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  logger.error('Promise rejeitada não tratada:', reason);
  process.exit(1);
});

export const handler = serverless(app);