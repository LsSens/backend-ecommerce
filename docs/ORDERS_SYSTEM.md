# Sistema de Pedidos (Orders)

## Visão Geral

O sistema de pedidos é um componente completo para gerenciamento de pedidos em ecommerce, incluindo controle de status, pagamentos, entrega e integração com produtos e usuários.

## Funcionalidades

### Status dos Pedidos
- **pending**: Pedido criado, aguardando confirmação
- **confirmed**: Pedido confirmado, aguardando preparação
- **preparing**: Pedido em preparação
- **shipped**: Pedido enviado
- **delivered**: Pedido entregue
- **cancelled**: Pedido cancelado

### Status de Pagamento
- **pending**: Pagamento pendente
- **paid**: Pagamento aprovado
- **failed**: Pagamento falhou
- **refunded**: Pagamento reembolsado

### Métodos de Pagamento
- **credit_card**: Cartão de crédito
- **debit_card**: Cartão de débito
- **pix**: PIX
- **bank_transfer**: Transferência bancária
- **cash**: Dinheiro

## Estrutura do Banco de Dados

### Collection: orders

```javascript
{
  _id: ObjectId,
  orderNumber: String, // Gerado automaticamente (YYYYMMDD0001)
  userId: ObjectId, // Referência ao usuário
  companyId: ObjectId, // Referência à empresa
  items: [
    {
      productId: ObjectId,
      productName: String,
      quantity: Number,
      unitPrice: Number,
      totalPrice: Number,
      productImage: String
    }
  ],
  subtotal: Number,
  shippingCost: Number,
  discount: Number,
  total: Number,
  status: String, // pending, confirmed, preparing, shipped, delivered, cancelled
  paymentStatus: String, // pending, paid, failed, refunded
  paymentMethod: String, // credit_card, debit_card, pix, bank_transfer, cash
  deliveryAddress: {
    street: String,
    number: String,
    complement: String,
    neighborhood: String,
    city: String,
    state: String,
    zipCode: String
  },
  deliveryInstructions: String,
  estimatedDeliveryDate: Date,
  actualDeliveryDate: Date,
  notes: String,
  createdAt: Date,
  updatedAt: Date
}
```

## APIs Disponíveis

### 1. Criar Pedido
```
POST /api/orders
Authorization: Bearer <token>
Content-Type: application/json

{
  "userId": "user_id",
  "companyId": "company_id",
  "items": [
    {
      "productId": "product_id",
      "productName": "Nome do Produto",
      "quantity": 2,
      "unitPrice": 100.00,
      "totalPrice": 200.00,
      "productImage": "url_da_imagem"
    }
  ],
  "subtotal": 200.00,
  "shippingCost": 15.00,
  "discount": 0,
  "total": 215.00,
  "paymentMethod": "credit_card",
  "deliveryAddress": {
    "street": "Rua das Flores",
    "number": "123",
    "complement": "Apto 45",
    "neighborhood": "Centro",
    "city": "São Paulo",
    "state": "SP",
    "zipCode": "01234-567"
  },
  "deliveryInstructions": "Entregar no portão principal",
  "notes": "Observações do pedido"
}
```

### 2. Listar Pedidos
```
GET /api/orders?companyId=company_id&userId=user_id&status=pending
Authorization: Bearer <token>
```

### 3. Buscar Pedido por ID
```
GET /api/orders/:id
Authorization: Bearer <token>
```

### 4. Buscar Pedido por Número
```
GET /api/orders/number/:orderNumber
Authorization: Bearer <token>
```

### 5. Atualizar Pedido
```
PUT /api/orders/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "status": "confirmed",
  "paymentStatus": "paid",
  "shippingCost": 20.00,
  "notes": "Pedido atualizado"
}
```

### 6. Atualizar Status do Pedido
```
PATCH /api/orders/:id/status
Authorization: Bearer <token>
Content-Type: application/json

{
  "status": "shipped"
}
```

### 7. Listar Pedidos por Status
```
GET /api/orders/status/:status?companyId=company_id
Authorization: Bearer <token>
```

### 8. Listar Pedidos por Usuário
```
GET /api/orders/user/:userId?companyId=company_id
Authorization: Bearer <token>
```

### 9. Estatísticas dos Pedidos
```
GET /api/orders/statistics?companyId=company_id
Authorization: Bearer <token>
```

### 10. Remover Pedido
```
DELETE /api/orders/:id
Authorization: Bearer <token>
```

## Funcionalidades Especiais

### Geração Automática de Número do Pedido
O sistema gera automaticamente números únicos para os pedidos no formato: `YYYYMMDD0001`

### Controle de Estoque
- Ao criar um pedido, o estoque dos produtos é automaticamente reduzido
- Ao cancelar um pedido, o estoque é restaurado
- Validação de estoque suficiente antes de criar o pedido

### Cálculo Automático de Datas
- Data estimada de entrega é definida automaticamente quando o status muda para "shipped"
- Data real de entrega é definida quando o status muda para "delivered"

### Populate de Dados Relacionados
- Usuário (nome, email, telefone, endereço)
- Empresa (nome)
- Produtos (nome, imagens, descrição)

## Índices do Banco de Dados

```javascript
// Índices para otimização de consultas
{ userId: 1, companyId: 1 } // Pedidos por usuário e empresa
{ status: 1, companyId: 1 } // Pedidos por status e empresa
{ paymentStatus: 1, companyId: 1 } // Pedidos por status de pagamento
{ createdAt: -1 } // Pedidos ordenados por data de criação
{ orderNumber: 1 } // Busca por número do pedido (único)
```

## Migração e Dados de Exemplo

### Executar Migração
```bash
npm run migrate:orders
# ou
npx ts-node src/scripts/runOrderMigration.ts
```

### Dados de Exemplo Criados
1. **Usuário**: João Silva (cliente@exemplo.com)
2. **Empresa**: Loja Exemplo
3. **Produtos**: 
   - Smartphone Galaxy S21 (R$ 2.999,99)
   - Fone de Ouvido Bluetooth (R$ 299,99)
   - Capa para Smartphone (R$ 49,99)
4. **Pedidos de Exemplo**:
   - Pedido confirmado com 3 itens
   - Pedido pendente com 1 item
   - Pedido enviado com 1 item

## Validações

### Validações de Entrada
- Todos os campos obrigatórios devem ser preenchidos
- Quantidade mínima de 1 por item
- Preços não podem ser negativos
- Endereço de entrega completo
- Método de pagamento válido

### Validações de Negócio
- Verificação de estoque suficiente
- Validação de usuário e empresa existentes
- Verificação de produtos existentes
- Controle de status válidos

## Tratamento de Erros

### Erros Comuns
- **400**: Dados inválidos ou validação falhou
- **401**: Não autorizado
- **404**: Pedido não encontrado
- **500**: Erro interno do servidor

### Mensagens de Erro
- "Usuário não encontrado"
- "Empresa não encontrada"
- "Produto não encontrado"
- "Estoque insuficiente"
- "Pedido não encontrado"

## Documentação Swagger

A documentação completa da API está disponível em:
```
GET /api/docs
```

Todas as rotas estão documentadas com exemplos de requisição e resposta.

## Segurança

- Todas as rotas (exceto busca por número) requerem autenticação
- Validação de DTOs com class-validator
- Sanitização de dados de entrada
- Controle de acesso por empresa

## Performance

- Índices otimizados para consultas frequentes
- Populate seletivo de dados relacionados
- Paginação implícita (pode ser implementada)
- Cache de consultas frequentes (pode ser implementado)

## Monitoramento

- Logs detalhados de todas as operações
- Métricas de performance
- Rastreamento de erros
- Alertas para pedidos com problemas

## Próximas Melhorias

1. **Sistema de Notificações**: Email/SMS para mudanças de status
2. **Rastreamento de Entrega**: Integração com transportadoras
3. **Cupons de Desconto**: Sistema de promoções
4. **Pagamentos**: Integração com gateways de pagamento
5. **Relatórios**: Dashboards e relatórios avançados
6. **Webhooks**: Notificações em tempo real
7. **API de Rastreamento**: Para clientes acompanharem pedidos 