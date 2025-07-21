import { Router } from 'express';
import { CategoryController } from '../controllers/CategoryController';
import { authenticateToken } from '../middleware/auth';
import { validateDto } from '../middleware/validation';
import { CreateCategoryDto, UpdateCategoryDto } from '../dto/Category';

/**
 * @swagger
 * tags:
 *   name: Categories
 *   description: Gerenciamento de categorias
 */

/**
 * @swagger
 * /categories:
 *   get:
 *     summary: Lista todas as categorias
 *     tags: [Categories]
 *     responses:
 *       200:
 *         description: Lista de categorias
 *   post:
 *     summary: Cria uma nova categoria
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *     responses:
 *       201:
 *         description: Categoria criada com sucesso
 *       400:
 *         description: Erro de validação
 */

/**
 * @swagger
 * /categories/search:
 *   get:
 *     summary: Busca categorias por termo
 *     tags: [Categories]
 *     parameters:
 *       - in: query
 *         name: q
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Lista de categorias encontradas
 */

/**
 * @swagger
 * /categories/{id}:
 *   get:
 *     summary: Busca categoria por ID
 *     tags: [Categories]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Categoria encontrada
 *       404:
 *         description: Categoria não encontrada
 *   put:
 *     summary: Atualiza categoria por ID
 *     tags: [Categories]
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
 *     responses:
 *       200:
 *         description: Categoria atualizada
 *       404:
 *         description: Categoria não encontrada
 *   delete:
 *     summary: Remove categoria por ID
 *     tags: [Categories]
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
 *         description: Categoria removida
 *       404:
 *         description: Categoria não encontrada
 */

const router = Router();
const categoryController = new CategoryController();

// Rotas públicas para visualização
router.get('/', categoryController.getAllCategories.bind(categoryController));
router.get('/search', categoryController.searchCategories.bind(categoryController));
router.get('/:id', categoryController.getCategoryById.bind(categoryController));

// Rotas protegidas para CRUD
router.post('/', authenticateToken, validateDto(CreateCategoryDto), categoryController.createCategory.bind(categoryController));
router.put('/:id', authenticateToken, validateDto(UpdateCategoryDto), categoryController.updateCategory.bind(categoryController));
router.delete('/:id', authenticateToken, categoryController.deleteCategory.bind(categoryController));

export default router; 