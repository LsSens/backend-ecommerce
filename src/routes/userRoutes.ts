import { Router } from 'express';
import { UserController } from '../controllers/UserController';
import { authenticateToken } from '../middleware/auth';
import { validateDto, validateCompanyId, validateUserExists, validateCartOperations } from '../middleware/validation';
import { requirePermissions } from '../middleware/permissions';
import { CreateUserDto, LoginDto, UpdateUserDto } from '../dto/User';

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: Gerenciamento de usuários
 */

/**
 * @swagger
 * /users/register:
 *   post:
 *     summary: Cria um novo usuário
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               phone:
 *                 type: string
 *               address:
 *                 type: string
 *               role:
 *                 type: string
 *                 enum: [Admin, Customer, Operator]
 *     responses:
 *       201:
 *         description: Usuário criado com sucesso
 *       400:
 *         description: Erro de validação
 */

/**
 * @swagger
 * /users/login:
 *   post:
 *     summary: Realiza login do usuário
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login realizado com sucesso
 *       401:
 *         description: Credenciais inválidas
 */

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Lista todos os usuários
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de usuários
 *       401:
 *         description: Não autorizado
 */

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Busca usuário por ID
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Usuário encontrado
 *       404:
 *         description: Usuário não encontrado
 *   put:
 *     summary: Atualiza usuário por ID
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               phone:
 *                 type: string
 *               address:
 *                 type: string
 *               role:
 *                 type: string
 *                 enum: [Admin, Customer, Operator]
 *     responses:
 *       200:
 *         description: Usuário atualizado
 *       404:
 *         description: Usuário não encontrado
 *   delete:
 *     summary: Remove usuário por ID
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Usuário removido
 *       404:
 *         description: Usuário não encontrado
 */

/**
 * @swagger
 * /users/{id}/cart:
 *   get:
 *     summary: Busca carrinho de compras do usuário
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Carrinho de compras encontrado
 *       404:
 *         description: Carrinho de compras não encontrado
 *       403:
 *         description: Usuário não autorizado
 *       400:
 *         description: Erro de validação
 *       401:
 *         description: Não autorizado
 *   post:
 *     summary: Adiciona produto ao carrinho de compras
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               productId:
 *                 type: string
 *               quantity:  
 *                 type: number
 *     responses:
 *       200:
 *         description: Produto adicionado ao carrinho
 *       404:
 *         description: Produto não encontrado
 *       403:
 *         description: Usuário não autorizado
 *       400:
 *         description: Erro de validação
 *       401:
 *         description: Não autorizado
 *   delete:
 *     summary: Remove produto do carrinho de compras
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               productId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Produto removido do carrinho
 *       404:
 *         description: Produto não encontrado
 *       403:
 *         description: Usuário não autorizado
 *       400:
 *         description: Erro de validação
 *       401:
 *         description: Não autorizado
 * 
 */

const router = Router();
const userController = new UserController();

router.post('/register', validateDto(CreateUserDto), userController.register.bind(userController));
router.post('/login', validateDto(LoginDto), userController.login.bind(userController));
router.get('/', authenticateToken, validateCompanyId, requirePermissions.Operator, userController.getAllUsers.bind(userController));
router.get('/:id', authenticateToken, validateCompanyId, validateUserExists, requirePermissions.Operator, userController.getUserById.bind(userController));
router.put('/:id', authenticateToken, validateCompanyId, validateUserExists, requirePermissions.Operator, validateDto(UpdateUserDto), userController.updateUser.bind(userController));
router.delete('/:id', authenticateToken, validateCompanyId, validateUserExists, requirePermissions.Admin, userController.deleteUser.bind(userController));
router.get('/:id/cart', authenticateToken, validateCartOperations, userController.getUserCart.bind(userController));
router.post('/:id/cart', authenticateToken, validateCartOperations, userController.addProductToCart.bind(userController));
router.delete('/:id/cart', authenticateToken, validateCartOperations, userController.removeProductFromCart.bind(userController));

export default router; 