# 🛒 Backend E-commerce White Label

Backend completo para sistema de e-commerce white label desenvolvido com Node.js, TypeScript, Express e MongoDB.

## 🚀 Tecnologias Utilizadas

- **Node.js** - Runtime JavaScript
- **TypeScript** - Linguagem de programação tipada
- **Express.js** - Framework web
- **MongoDB** - Banco de dados NoSQL
- **Mongoose** - ODM para MongoDB
- **JWT** - Autenticação via tokens
- **bcryptjs** - Criptografia de senhas
- **class-validator** - Validação de dados
- **Winston** - Sistema de logging
- **Helmet** - Segurança HTTP
- **CORS** - Cross-Origin Resource Sharing
- **Rate Limiting** - Proteção contra ataques

## 📋 Pré-requisitos

- Node.js (versão 16 ou superior)
- MongoDB (local ou Atlas)
- npm ou yarn

## 🛠️ Instalação

1. **Clone o repositório**
```bash
git clone <url-do-repositorio>
cd ecommerce-backend
```

2. **Instale as dependências**
```bash
npm install
```

3. **Configure as variáveis de ambiente**
```bash
cp .env.example .env
```

Edite o arquivo `.env` com suas configurações:
```env
# Configurações do Servidor
PORT=3000
NODE_ENV=development

# Configurações do MongoDB
MONGODB_URI=mongodb://localhost:27017/ecommerce_white_label

# Configurações do JWT
JWT_SECRET=sua_chave_secreta_muito_segura_aqui
JWT_EXPIRES_IN=24h

# Configurações de Log
LOG_LEVEL=info

# Configurações de Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

4. **Execute o projeto**
```bash
# Desenvolvimento
npm run dev

# Produção
npm run build
npm start
```

## 📁 Estrutura do Projeto

```
src/
├── config/          # Configurações (banco de dados)
├── controllers/     # Controladores da aplicação
├── dto/            # Data Transfer Objects (validação)
├── middleware/      # Middlewares (auth, validação, erro)
├── models/          # Modelos do Mongoose
├── routes/          # Definição das rotas
├── services/        # Lógica de negócio
├── types/           # Tipos TypeScript
├── utils/           # Utilitários (logger)
└── server.ts        # Arquivo principal
```

## 🗄️ Modelos de Dados

### User (Usuário)
- `id` - Identificador único
- `name` - Nome do usuário
- `email` - Email (único)
- `password` - Senha (criptografada)
- `phone` - Telefone (opcional)
- `address` - Endereço (opcional)

### Company (Empresa)
- `id` - Identificador único
- `name` - Nome da empresa
- `cnpj` - CNPJ (único)
- `address` - Endereço
- `userId` - ID do usuário proprietário (opcional)

### Product (Produto)
- `id` - Identificador único
- `name` - Nome do produto
- `companyId` - ID da empresa
- `description` - Descrição
- `price` - Preço
- `categoryId` - ID da categoria (opcional)

### Category (Categoria)
- `id` - Identificador único
- `name` - Nome da categoria

## 🔐 Autenticação

O sistema utiliza JWT (JSON Web Tokens) para autenticação.

### Endpoints de Autenticação

- `POST /api/users/register` - Cadastro de usuário
- `POST /api/users/login` - Login de usuário

### Como usar tokens

Adicione o header `Authorization: Bearer <token>` nas requisições protegidas.

## 📡 Endpoints da API

### Usuários
- `GET /api/users` - Listar todos os usuários (protegido)
- `GET /api/users/:id` - Buscar usuário por ID (protegido)
- `POST /api/users/register` - Cadastrar usuário
- `POST /api/users/login` - Login
- `PUT /api/users/:id` - Atualizar usuário (protegido)
- `DELETE /api/users/:id` - Deletar usuário (protegido)

### Empresas
- `GET /api/companies` - Listar todas as empresas (protegido)
- `GET /api/companies/:id` - Buscar empresa por ID (protegido)
- `POST /api/companies` - Criar empresa (protegido)
- `PUT /api/companies/:id` - Atualizar empresa (protegido)
- `DELETE /api/companies/:id` - Deletar empresa (protegido)
- `GET /api/companies/user/:userId` - Buscar empresas por usuário (protegido)

### Produtos
- `GET /api/products` - Listar todos os produtos
- `GET /api/products/:id` - Buscar produto por ID
- `GET /api/products/search?q=termo` - Buscar produtos
- `GET /api/products/company/:companyId` - Produtos por empresa
- `GET /api/products/category/:categoryId` - Produtos por categoria
- `POST /api/products` - Criar produto (protegido)
- `PUT /api/products/:id` - Atualizar produto (protegido)
- `DELETE /api/products/:id` - Deletar produto (protegido)

### Categorias
- `GET /api/categories` - Listar todas as categorias
- `GET /api/categories/:id` - Buscar categoria por ID
- `GET /api/categories/search?q=termo` - Buscar categorias
- `POST /api/categories` - Criar categoria (protegido)
- `PUT /api/categories/:id` - Atualizar categoria (protegido)
- `DELETE /api/categories/:id` - Deletar categoria (protegido)

### Health Check
- `GET /health` - Verificar status da API

## 🔧 Scripts Disponíveis

```bash
npm run dev      # Executar em modo desenvolvimento
npm run build    # Compilar TypeScript
npm start        # Executar em produção
npm test         # Executar testes
npm run lint     # Verificar código
npm run lint:fix # Corrigir problemas de lint
```

## 🧪 Exemplos de Uso

### 1. Cadastrar Usuário
```bash
curl -X POST http://localhost:3000/api/users/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "João Silva",
    "email": "joao@email.com",
    "password": "123456",
    "phone": "(11) 99999-9999",
    "address": "Rua das Flores, 123"
  }'
```

### 2. Fazer Login
```bash
curl -X POST http://localhost:3000/api/users/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "joao@email.com",
    "password": "123456"
  }'
```

### 3. Criar Empresa (com token)
```bash
curl -X POST http://localhost:3000/api/companies \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <seu-token>" \
  -d '{
    "name": "Empresa LTDA",
    "cnpj": "12.345.678/0001-90",
    "address": "Av. Paulista, 1000"
  }'
```

### 4. Criar Produto (com token)
```bash
curl -X POST http://localhost:3000/api/products \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <seu-token>" \
  -d '{
    "name": "Produto Teste",
    "companyId": "<id-da-empresa>",
    "description": "Descrição do produto",
    "price": 99.99,
    "categoryId": "<id-da-categoria>"
  }'
```

## 🔒 Segurança

- **Senhas criptografadas** com bcrypt
- **JWT** para autenticação
- **Rate limiting** para proteção contra ataques
- **Helmet** para headers de segurança
- **CORS** configurado
- **Validação** de dados com class-validator

## 📊 Logs

O sistema utiliza Winston para logging:
- Logs de erro em `logs/error.log`
- Logs combinados em `logs/combined.log`
- Logs no console em desenvolvimento

## 🚀 Deploy

### Variáveis de Ambiente para Produção
```env
NODE_ENV=production
PORT=3000
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/database
JWT_SECRET=chave_super_secreta_e_complexa
JWT_EXPIRES_IN=24h
LOG_LEVEL=error
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

### Docker (opcional)
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY dist ./dist
EXPOSE 3000
CMD ["npm", "start"]
```

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 📞 Suporte

Para dúvidas ou suporte, abra uma issue no repositório. 