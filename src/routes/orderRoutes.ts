import { Router } from 'express';
import { OrderController } from '../controllers/OrderController';
import { authenticateToken } from '../middleware/auth';
import { validateDto } from '../middleware/validation';
import { CreateOrderDto, UpdateOrderDto } from '../dto/Order';

/**
 * @swagger
 * tags:
 *   name: Orders
 *   description: Gerenciamento de pedidos
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     OrderItem:
 *       type: object
 *       required:
 *         - productId
 *         - productName
 *         - quantity
 *         - unitPrice
 *         - totalPrice
 *       properties:
 *         productId:
 *           type: string
 *           description: ID do produto
 *         productName:
 *           type: string
 *           description: Nome do produto
 *         quantity:
 *           type: number
 *           description: Quantidade do produto
 *         unitPrice:
 *           type: number
 *           description: Preço unitário
 *         totalPrice:
 *           type: number
 *           description: Preço total do item
 *         productImage:
 *           type: string
 *           description: URL da imagem do produto
 *     DeliveryAddress:
 *       type: object
 *       required:
 *         - street
 *         - number
 *         - neighborhood
 *         - city
 *         - state
 *         - zipCode
 *       properties:
 *         street:
 *           type: string
 *           description: Nome da rua
 *         number:
 *           type: string
 *           description: Número do endereço
 *         complement:
 *           type: string
 *           description: Complemento do endereço
 *         neighborhood:
 *           type: string
 *           description: Bairro
 *         city:
 *           type: string
 *           description: Cidade
 *         state:
 *           type: string
 *           description: Estado
 *         zipCode:
 *           type: string
 *           description: CEP
 *     Order:
 *       type: object
 *       required:
 *         - userId
 *         - companyId
 *         - items
 *         - subtotal
 *         - total
 *         - paymentMethod
 *         - deliveryAddress
 *       properties:
 *         orderNumber:
 *           type: string
 *           description: Número único do pedido (gerado automaticamente)
 *         userId:
 *           type: string
 *           description: ID do usuário que fez o pedido
 *         companyId:
 *           type: string
 *           description: ID da empresa
 *         items:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/OrderItem'
 *           description: Lista de itens do pedido
 *         subtotal:
 *           type: number
 *           description: Subtotal do pedido
 *         shippingCost:
 *           type: number
 *           description: Custo de envio
 *         discount:
 *           type: number
 *           description: Desconto aplicado
 *         total:
 *           type: number
 *           description: Valor total do pedido
 *         status:
 *           type: string
 *           enum: [pending, confirmed, preparing, shipped, delivered, cancelled]
 *           description: Status atual do pedido
 *         paymentStatus:
 *           type: string
 *           enum: [pending, paid, failed, refunded]
 *           description: Status do pagamento
 *         paymentMethod:
 *           type: string
 *           enum: [credit_card, debit_card, pix, bank_transfer, cash]
 *           description: Método de pagamento
 *         deliveryAddress:
 *           $ref: '#/components/schemas/DeliveryAddress'
 *         deliveryInstructions:
 *           type: string
 *           description: Instruções especiais para entrega
 *         estimatedDeliveryDate:
 *           type: string
 *           format: date-time
 *           description: Data estimada de entrega
 *         actualDeliveryDate:
 *           type: string
 *           format: date-time
 *           description: Data real de entrega
 *         notes:
 *           type: string
 *           description: Observações do pedido
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Data de criação
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Data da última atualização
 */

/**
 * @swagger
 * /orders:
 *   get:
 *     summary: Lista todos os pedidos
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: companyId
 *         schema:
 *           type: string
 *         description: ID da empresa para filtrar pedidos
 *       - in: query
 *         name: userId
 *         schema:
 *           type: string
 *         description: ID do usuário para filtrar pedidos
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [pending, confirmed, preparing, shipped, delivered, cancelled]
 *         description: Status para filtrar pedidos
 *     responses:
 *       200:
 *         description: Lista de pedidos encontrada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Order'
 *                 count:
 *                   type: number
 *       401:
 *         description: Não autorizado
 *       500:
 *         description: Erro interno do servidor
 *   post:
 *     summary: Cria um novo pedido
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *               - companyId
 *               - items
 *               - subtotal
 *               - total
 *               - paymentMethod
 *               - deliveryAddress
 *             properties:
 *               userId:
 *                 type: string
 *               companyId:
 *                 type: string
 *               items:
 *                 type: array
 *                 items:
 *                   $ref: '#/components/schemas/OrderItem'
 *               subtotal:
 *                 type: number
 *               shippingCost:
 *                 type: number
 *               discount:
 *                 type: number
 *               total:
 *                 type: number
 *               paymentMethod:
 *                 type: string
 *                 enum: [credit_card, debit_card, pix, bank_transfer, cash]
 *               deliveryAddress:
 *                 $ref: '#/components/schemas/DeliveryAddress'
 *               deliveryInstructions:
 *                 type: string
 *               notes:
 *                 type: string
 *     responses:
 *       201:
 *         description: Pedido criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/Order'
 *       400:
 *         description: Erro de validação ou dados inválidos
 *       401:
 *         description: Não autorizado
 *       500:
 *         description: Erro interno do servidor
 */

/**
 * @swagger
 * /orders/statistics:
 *   get:
 *     summary: Obtém estatísticas dos pedidos
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: companyId
 *         schema:
 *           type: string
 *         description: ID da empresa para filtrar estatísticas
 *     responses:
 *       200:
 *         description: Estatísticas encontradas com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     totalOrders:
 *                       type: number
 *                     totalRevenue:
 *                       type: number
 *                     averageOrderValue:
 *                       type: number
 *                     pendingOrders:
 *                       type: number
 *                     confirmedOrders:
 *                       type: number
 *                     preparingOrders:
 *                       type: number
 *                     shippedOrders:
 *                       type: number
 *                     deliveredOrders:
 *                       type: number
 *                     cancelledOrders:
 *                       type: number
 *       401:
 *         description: Não autorizado
 *       500:
 *         description: Erro interno do servidor
 */

/**
 * @swagger
 * /orders/status/{status}:
 *   get:
 *     summary: Lista pedidos por status
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: status
 *         required: true
 *         schema:
 *           type: string
 *           enum: [pending, confirmed, preparing, shipped, delivered, cancelled]
 *         description: Status dos pedidos
 *       - in: query
 *         name: companyId
 *         schema:
 *           type: string
 *         description: ID da empresa para filtrar pedidos
 *     responses:
 *       200:
 *         description: Pedidos encontrados com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Order'
 *                 count:
 *                   type: number
 *       401:
 *         description: Não autorizado
 *       500:
 *         description: Erro interno do servidor
 */

/**
 * @swagger
 * /orders/user/{userId}:
 *   get:
 *     summary: Lista pedidos de um usuário específico
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do usuário
 *       - in: query
 *         name: companyId
 *         schema:
 *           type: string
 *         description: ID da empresa para filtrar pedidos
 *     responses:
 *       200:
 *         description: Pedidos do usuário encontrados com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Order'
 *                 count:
 *                   type: number
 *       401:
 *         description: Não autorizado
 *       500:
 *         description: Erro interno do servidor
 */

/**
 * @swagger
 * /orders/{id}:
 *   get:
 *     summary: Busca pedido por ID
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do pedido
 *     responses:
 *       200:
 *         description: Pedido encontrado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/Order'
 *       404:
 *         description: Pedido não encontrado
 *       401:
 *         description: Não autorizado
 *       500:
 *         description: Erro interno do servidor
 *   put:
 *     summary: Atualiza pedido por ID
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do pedido
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [pending, confirmed, preparing, shipped, delivered, cancelled]
 *               paymentStatus:
 *                 type: string
 *                 enum: [pending, paid, failed, refunded]
 *               shippingCost:
 *                 type: number
 *               discount:
 *                 type: number
 *               total:
 *                 type: number
 *               deliveryAddress:
 *                 $ref: '#/components/schemas/DeliveryAddress'
 *               deliveryInstructions:
 *                 type: string
 *               notes:
 *                 type: string
 *               estimatedDeliveryDate:
 *                 type: string
 *                 format: date-time
 *               actualDeliveryDate:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       200:
 *         description: Pedido atualizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/Order'
 *       400:
 *         description: Erro de validação ou dados inválidos
 *       404:
 *         description: Pedido não encontrado
 *       401:
 *         description: Não autorizado
 *       500:
 *         description: Erro interno do servidor
 *   delete:
 *     summary: Remove pedido por ID
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do pedido
 *     responses:
 *       200:
 *         description: Pedido removido com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *       404:
 *         description: Pedido não encontrado
 *       401:
 *         description: Não autorizado
 *       500:
 *         description: Erro interno do servidor
 */

/**
 * @swagger
 * /orders/number/{orderNumber}:
 *   get:
 *     summary: Busca pedido por número
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: orderNumber
 *         required: true
 *         schema:
 *           type: string
 *         description: Número do pedido
 *     responses:
 *       200:
 *         description: Pedido encontrado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/Order'
 *       404:
 *         description: Pedido não encontrado
 *       401:
 *         description: Não autorizado
 *       500:
 *         description: Erro interno do servidor
 */

/**
 * @swagger
 * /orders/{id}/status:
 *   patch:
 *     summary: Atualiza status do pedido
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do pedido
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [pending, confirmed, preparing, shipped, delivered, cancelled]
 *                 description: Novo status do pedido
 *     responses:
 *       200:
 *         description: Status do pedido atualizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/Order'
 *       400:
 *         description: Status inválido ou erro de validação
 *       404:
 *         description: Pedido não encontrado
 *       401:
 *         description: Não autorizado
 *       500:
 *         description: Erro interno do servidor
 */

const router = Router();
const orderController = new OrderController();

// Rotas públicas (se necessário)
router.get('/number/:orderNumber', orderController.getOrderByNumber.bind(orderController));

// Rotas protegidas
router.get('/', authenticateToken, orderController.getAllOrders.bind(orderController));
router.post('/', authenticateToken, validateDto(CreateOrderDto), orderController.createOrder.bind(orderController));
router.get('/statistics', authenticateToken, orderController.getOrderStatistics.bind(orderController));
router.get('/status/:status', authenticateToken, orderController.getOrdersByStatus.bind(orderController));
router.get('/user/:userId', authenticateToken, orderController.getOrdersByUser.bind(orderController));
router.get('/:id', authenticateToken, orderController.getOrderById.bind(orderController));
router.put('/:id', authenticateToken, validateDto(UpdateOrderDto), orderController.updateOrder.bind(orderController));
router.delete('/:id', authenticateToken, orderController.deleteOrder.bind(orderController));
router.patch('/:id/status', authenticateToken, orderController.updateOrderStatus.bind(orderController));

export default router;
