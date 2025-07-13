import swaggerJSDoc from 'swagger-jsdoc';

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'E-commerce White Label API',
    version: '1.0.0',
    description: 'Documentação da API do sistema de e-commerce white label',
  },
  servers: [
    {
      url: 'http://localhost:3000',
      description: 'Servidor local',
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
    },
  },
  security: [{ bearerAuth: [] }],
};

const options = {
  swaggerDefinition,
  apis: [
    './src/routes/*.ts',
    './src/models/*.ts',
    './src/swaggerDocs/*.ts',
  ],
};

export const swaggerSpec = swaggerJSDoc(options); 