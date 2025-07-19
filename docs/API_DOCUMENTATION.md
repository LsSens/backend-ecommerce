# Documentação Completa da API - E-commerce Backend

## Visão Geral

Esta é uma API REST para um sistema de e-commerce com autenticação JWT, controle de permissões por empresa e funcionalidades de carrinho de compras.

**Base URL:** `http://localhost:3000/api`
**Documentação Swagger:** `http://localhost:3000/api/docs`

## Autenticação

A API usa JWT (JSON Web Tokens) para autenticação. Para rotas protegidas, inclua o header:
```
Authorization: Bearer <seu_token_jwt>
```

## Estruturas de Dados

### User (Usuário)
```typescript
interface User {
  _id: string;
  name: string;
  email: string;
  cpf?: string;
  phone?: string;
  address?: string;
  role: 'Admin' | 'Customer' | 'Operator';
  companyId?: string;
  cart?: {
    products: {
      productId: string;
      quantity: number;
    }[];
  };
  createdAt: Date;
  updatedAt: Date;
}
```

### Product (Produto)
```typescript
interface Product {
  _id: string;
  name: string;
  companyId: string;
  description: string;
  price: number;
  category?: {
    _id: string,
    name: string
  };
  images?: string[];
  variables?: ProductVariable[];
  quantity: number;
  createdAt: Date;
  updatedAt: Date;
}

interface ProductVariable {
  quantity: number;
  price: number;
  image: string;
  name: string;
  // Campos dinâmicos podem ser adicionados (color, size, etc.)
}
```

### Category (Categoria)
```typescript
interface Category {
  _id: string;
  name: string;
  companyId: string;
  createdAt: Date;
  updatedAt: Date;
}
```

### Company (Empresa)
```typescript
interface Company {
  _id: string;
  name: string;
  cnpj: string;
  address: string;
  domains: string[];
  createdAt: Date;
  updatedAt: Date;
}
```

## Rotas da API

### 1. Autenticação e Usuários (`/api/users`)

#### POST `/api/users/register`
**Criar novo usuário**

**Request Body:**
```json
{
  "name": "string (2-100 chars)",
  "email": "string (email válido)",
  "password": "string (mín 6 chars)",
  "cpf": "string (opcional)",
  "phone": "string (opcional)",
  "address": "string (opcional)",
  "role": "Admin|Customer|Operator (opcional, default: Customer)"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Usuário criado com sucesso",
  "data": {
    "_id": "string",
    "name": "string",
    "email": "string",
    "cpf": "string",
    "phone": "string",
    "address": "string",
    "role": "string",
    "companyId": "string",
    "cart": { "products": [] },
    "createdAt": "date",
    "updatedAt": "date"
  }
}
```

#### POST `/api/users/login`
**Realizar login**

**Request Body:**
```json
{
  "email": "string",
  "password": "string"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Login realizado com sucesso",
  "data": {
    "user": {
      "_id": "string",
      "name": "string",
      "email": "string",
      "role": "string",
      "companyId": "string",
      "cart": { "products": [] },
      "createdAt": "date",
      "updatedAt": "date"
    },
    "token": "jwt_token_string"
  }
}
```

#### GET `/api/users`
**Listar todos os usuários (requer autenticação + permissão Operator)**

**Headers:** `Authorization: Bearer <token>`

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "_id": "string",
      "name": "string",
      "email": "string",
      "role": "string",
      "companyId": "string",
      "createdAt": "date",
      "updatedAt": "date"
    }
  ]
}
```

#### GET `/api/users/:id`
**Buscar usuário por ID (requer autenticação + permissão Operator)**

**Headers:** `Authorization: Bearer <token>`

**Response (200):**
```json
{
  "success": true,
  "data": {
    "_id": "string",
    "name": "string",
    "email": "string",
    "role": "string",
    "companyId": "string",
    "createdAt": "date",
    "updatedAt": "date"
  }
}
```

#### PUT `/api/users/:id`
**Atualizar usuário (requer autenticação + permissão Operator)**

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "name": "string (opcional)",
  "email": "string (opcional)",
  "password": "string (opcional)",
  "cpf": "string (opcional)",
  "phone": "string (opcional)",
  "address": "string (opcional)",
  "role": "Admin|Customer|Operator (opcional)"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Usuário atualizado com sucesso",
  "data": {
    "_id": "string",
    "name": "string",
    "email": "string",
    "role": "string",
    "companyId": "string",
    "createdAt": "date",
    "updatedAt": "date"
  }
}
```

#### DELETE `/api/users/:id`
**Deletar usuário (requer autenticação + permissão Admin)**

**Headers:** `Authorization: Bearer <token>`

**Response (200):**
```json
{
  "success": true,
  "message": "Usuário deletado com sucesso"
}
```

### 2. Carrinho de Compras (`/api/users/:id/cart`)

#### GET `/api/users/:id/cart`
**Buscar carrinho do usuário (requer autenticação)**

**Headers:** `Authorization: Bearer <token>`

**Response (200):**
```json
{
  "success": true,
  "data": {
    "products": [
      {
        "productId": "string",
        "quantity": "number",
        "product": {
          "_id": "string",
          "name": "string",
          "price": "number",
          "image": "string"
        }
      }
    ]
  }
}
```

#### POST `/api/users/:id/cart`
**Adicionar produto ao carrinho (requer autenticação)**

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "productId": "string",
  "quantity": "number"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Produto adicionado ao carrinho com sucesso",
  "data": {
    "products": [
      {
        "productId": "string",
        "quantity": "number",
        "product": {
          "_id": "string",
          "name": "string",
          "price": "number",
          "image": "string"
        }
      }
    ]
  }
}
```

#### DELETE `/api/users/:id/cart`
**Remover produto do carrinho (requer autenticação)**

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "productId": "string"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Produto removido do carrinho com sucesso",
  "data": {
    "products": [
      {
        "productId": "string",
        "quantity": "number",
        "product": {
          "_id": "string",
          "name": "string",
          "price": "number",
          "image": "string"
        }
      }
    ]
  }
}
```

### 3. Produtos (`/api/products`)

#### GET `/api/products`
**Listar todos os produtos da empresa (requer autenticação)**

**Headers:** `Authorization: Bearer <token>`

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "_id": "string",
      "name": "string",
      "companyId": {
        "_id": "string",
        "name": "string",
        "cnpj": "string"
      },
      "description": "string",
      "price": "number",
      "categoryId": {
        "_id": "string",
        "name": "string"
      },
      "images": ["string"],
      "variables": [
        {
          "quantity": "number",
          "price": "number",
          "image": "string",
          "name": "string"
        }
      ],
      "quantity": "number",
      "createdAt": "date",
      "updatedAt": "date"
    }
  ]
}
```

#### POST `/api/products`
**Criar novo produto (requer autenticação)**

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "name": "string (2-200 chars)",
  "description": "string (10-1000 chars)",
  "price": "number (>= 0)",
  "categoryId": "string (opcional)",
  "images": ["string"] (opcional),
  "variables": [
    {
      "quantity": "number",
      "price": "number",
      "image": "string",
      "name": "string"
    }
  ] (opcional),
  "quantity": "number (>= 0)"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Produto criado com sucesso",
  "data": {
    "_id": "string",
    "name": "string",
    "companyId": "string",
    "description": "string",
    "price": "number",
    "categoryId": "string",
    "image": "string",
    "variables": [],
    "quantity": "number",
    "createdAt": "date",
    "updatedAt": "date"
  }
}
```

#### GET `/api/products/search`
**Buscar produtos por termo (requer autenticação)**

**Headers:** `Authorization: Bearer <token>`

**Query Parameters:**
- `q`: string (termo de busca)

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "_id": "string",
      "name": "string",
      "companyId": {
        "_id": "string",
        "name": "string",
        "cnpj": "string"
      },
      "description": "string",
      "price": "number",
      "categoryId": {
        "_id": "string",
        "name": "string"
      },
      "image": "string",
      "variables": [],
      "quantity": "number",
      "createdAt": "date",
      "updatedAt": "date"
    }
  ]
}
```

#### GET `/api/products/:id`
**Buscar produto por ID (requer autenticação)**

**Headers:** `Authorization: Bearer <token>`

**Response (200):**
```json
{
  "success": true,
  "data": {
    "_id": "string",
    "name": "string",
    "companyId": {
      "_id": "string",
      "name": "string",
      "cnpj": "string"
    },
    "description": "string",
    "price": "number",
    "categoryId": {
      "_id": "string",
      "name": "string"
    },
    "image": "string",
    "variables": [],
    "quantity": "number",
    "createdAt": "date",
    "updatedAt": "date"
  }
}
```

#### PUT `/api/products/:id`
**Atualizar produto (requer autenticação)**

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "name": "string (opcional)",
  "description": "string (opcional)",
  "price": "number (opcional)",
  "categoryId": "string (opcional)",
  "image": "string (opcional)",
  "variables": [] (opcional),
  "quantity": "number (opcional)"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Produto atualizado com sucesso",
  "data": {
    "_id": "string",
    "name": "string",
    "companyId": "string",
    "description": "string",
    "price": "number",
    "categoryId": "string",
    "image": "string",
    "variables": [],
    "quantity": "number",
    "createdAt": "date",
    "updatedAt": "date"
  }
}
```

#### DELETE `/api/products/:id`
**Deletar produto (requer autenticação)**

**Headers:** `Authorization: Bearer <token>`

**Response (200):**
```json
{
  "success": true,
  "message": "Produto deletado com sucesso"
}
```

#### GET `/api/products/variables`
**Buscar todas as variáveis dos produtos (requer autenticação)**

**Headers:** `Authorization: Bearer <token>`

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "quantity": "number",
      "price": "number",
      "image": "string",
      "name": "string",
      "productId": "string"
    }
  ]
}
```

### 4. Categorias (`/api/categories`)

#### GET `/api/categories`
**Listar todas as categorias**

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "_id": "string",
      "name": "string",
      "companyId": "string",
      "createdAt": "date",
      "updatedAt": "date"
    }
  ]
}
```

#### POST `/api/categories`
**Criar nova categoria (requer autenticação)**

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "name": "string (2-100 chars)"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Categoria criada com sucesso",
  "data": {
    "_id": "string",
    "name": "string",
    "companyId": "string",
    "createdAt": "date",
    "updatedAt": "date"
  }
}
```

#### GET `/api/categories/search`
**Buscar categorias por termo**

**Query Parameters:**
- `q`: string (termo de busca)

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "_id": "string",
      "name": "string",
      "companyId": "string",
      "createdAt": "date",
      "updatedAt": "date"
    }
  ]
}
```

#### GET `/api/categories/:id`
**Buscar categoria por ID**

**Response (200):**
```json
{
  "success": true,
  "data": {
    "_id": "string",
    "name": "string",
    "companyId": "string",
    "createdAt": "date",
    "updatedAt": "date"
  }
}
```

#### PUT `/api/categories/:id`
**Atualizar categoria (requer autenticação)**

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "name": "string (2-100 chars)"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Categoria atualizada com sucesso",
  "data": {
    "_id": "string",
    "name": "string",
    "companyId": "string",
    "createdAt": "date",
    "updatedAt": "date"
  }
}
```

#### DELETE `/api/categories/:id`
**Deletar categoria (requer autenticação)**

**Headers:** `Authorization: Bearer <token>`

**Response (200):**
```json
{
  "success": true,
  "message": "Categoria deletada com sucesso"
}
```

## Códigos de Status HTTP

- **200**: Sucesso
- **201**: Criado com sucesso
- **400**: Erro de validação ou requisição inválida
- **401**: Não autorizado (token inválido ou ausente)
- **403**: Acesso negado (sem permissão)
- **404**: Recurso não encontrado
- **429**: Muitas requisições (rate limit)

## Respostas de Erro

Todas as respostas de erro seguem o padrão:
```json
{
  "success": false,
  "message": "Descrição do erro"
}
```

## Middleware de Autenticação

Para rotas protegidas, o token JWT deve ser incluído no header:
```
Authorization: Bearer <token>
```

O token contém informações do usuário e empresa, que são automaticamente adicionadas ao objeto `req`:
- `req.user`: Dados do usuário autenticado
- `req.companyId`: ID da empresa do usuário

## Permissões

- **Admin**: Acesso total ao sistema
- **Operator**: Pode gerenciar usuários e produtos
- **Customer**: Pode apenas visualizar produtos e gerenciar carrinho

## Rate Limiting

A API implementa rate limiting para prevenir abuso:
- **Window**: 15 minutos
- **Max Requests**: 100 por janela
- **Message**: "Muitas requisições, tente novamente mais tarde"

## Health Check

**GET `/health`**

**Response (200):**
```json
{
  "success": true,
  "message": "API funcionando corretamente",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "environment": "development"
}
``` 