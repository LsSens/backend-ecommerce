import { Router } from 'express';
import { ProductController } from '../controllers/ProductController';
import { authenticateToken } from '../middleware/auth';
import { validateDto } from '../middleware/validation';
import { CreateProductDto, UpdateProductDto } from '../dto/Product';

/**
 * @swagger
 * tags:
 *   name: Products
 *   description: Gerenciamento de produtos
 */

/**
 * @swagger
 * /products:
 *   get:
 *     summary: Lista produtos com filtros opcionais
 *     tags: [Products]
 *     parameters:
 *       - in: query
 *         name: q
 *         schema:
 *           type: string
 *         description: Termo de busca para nome ou descrição do produto
 *       - in: query
 *         name: categoryId
 *         schema:
 *           type: string
 *         description: ID da categoria para filtrar produtos
 *       - in: query
 *         name: variables
 *         schema:
 *           type: boolean
 *         description: Se true, retorna apenas as variáveis dos produtos
 *     responses:
 *       200:
 *         description: Lista de produtos ou variáveis
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *   post:
 *     summary: Cria um novo produto
 *     tags: [Products]
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
 *               - companyId
 *               - description
 *               - price
 *             properties:
 *               name:
 *                 type: string
 *               companyId:
 *                 type: string
 *               description:
 *                 type: string
 *               price:
 *                 type: number
 *               category:
 *                 type: string
 *               variables:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     quantity:
 *                       type: number
 *                     price:
 *                       type: number
 *                     image:
 *                       type: string
 *                     name:
 *                       type: string
 *               quantity:
 *                 type: number
 *     responses:
 *       201:
 *         description: Produto criado com sucesso
 *       400:
 *         description: Erro de validação
 */

/**
 * @swagger
 * /products/{id}:
 *   get:
 *     summary: Busca produto por ID
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Produto encontrado
 *       404:
 *         description: Produto não encontrado
 *   put:
 *     summary: Atualiza produto por ID
 *     tags: [Products]
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
 *               description:
 *                 type: string
 *               price:
 *                 type: number
 *               category:
 *                 type: string
 *               variables:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     quantity:
 *                       type: number
 *                     price:
 *                       type: number
 *                     image:
 *                       type: string
 *                     name:
 *                       type: string
 *               quantity:
 *                 type: number
 *     responses:
 *       200:
 *         description: Produto atualizado
 *       404:
 *         description: Produto não encontrado
 *   delete:
 *     summary: Remove produto por ID
 *     tags: [Products]
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
 *         description: Produto removido
 *       404:
 *         description: Produto não encontrado
 */

const router = Router();
const productController = new ProductController();

// Endpoint principal consolidado que aceita parâmetros de filtro
router.get('/', productController.getAllProducts.bind(productController));
router.get('/:id', productController.getProductById.bind(productController));

router.post('/', authenticateToken, validateDto(CreateProductDto), productController.createProduct.bind(productController));
router.put('/:id', authenticateToken, validateDto(UpdateProductDto), productController.updateProduct.bind(productController));
router.delete('/:id', authenticateToken, productController.deleteProduct.bind(productController));

export default router; 