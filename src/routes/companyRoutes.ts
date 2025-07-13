import { Router } from 'express';
import { CompanyController } from '../controllers/CompanyController';
import { authenticateToken } from '../middleware/auth';
import { validateDto } from '../middleware/validation';
import { CreateCompanyDto, UpdateCompanyDto } from '../dto/CompanyDto';

/**
 * @swagger
 * tags:
 *   name: Companies
 *   description: Gerenciamento de empresas
 */

/**
 * @swagger
 * /api/companies:
 *   post:
 *     summary: Cria uma nova empresa
 *     tags: [Companies]
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
 *               - cnpj
 *               - address
 *             properties:
 *               name:
 *                 type: string
 *               cnpj:
 *                 type: string
 *               address:
 *                 type: string
 *               userId:
 *                 type: string
 *     responses:
 *       201:
 *         description: Empresa criada com sucesso
 *       400:
 *         description: Erro de validação
 *   get:
 *     summary: Lista todas as empresas
 *     tags: [Companies]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de empresas
 *       401:
 *         description: Não autorizado
 */

/**
 * @swagger
 * /api/companies/{id}:
 *   get:
 *     summary: Busca empresa por ID
 *     tags: [Companies]
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
 *         description: Empresa encontrada
 *       404:
 *         description: Empresa não encontrada
 *   put:
 *     summary: Atualiza empresa por ID
 *     tags: [Companies]
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
 *               cnpj:
 *                 type: string
 *               address:
 *                 type: string
 *               userId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Empresa atualizada
 *       404:
 *         description: Empresa não encontrada
 *   delete:
 *     summary: Remove empresa por ID
 *     tags: [Companies]
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
 *         description: Empresa removida
 *       404:
 *         description: Empresa não encontrada
 */

/**
 * @swagger
 * /api/companies/user/{userId}:
 *   get:
 *     summary: Lista empresas por usuário
 *     tags: [Companies]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Lista de empresas do usuário
 *       404:
 *         description: Nenhuma empresa encontrada para o usuário
 */

const router = Router();
const companyController = new CompanyController();

// Todas as rotas de empresa requerem autenticação
router.use(authenticateToken);

router.post('/', validateDto(CreateCompanyDto), companyController.createCompany.bind(companyController));
router.get('/', companyController.getAllCompanies.bind(companyController));
router.get('/:id', companyController.getCompanyById.bind(companyController));
router.put('/:id', validateDto(UpdateCompanyDto), companyController.updateCompany.bind(companyController));
router.delete('/:id', companyController.deleteCompany.bind(companyController));
router.get('/user/:userId', companyController.getCompaniesByUser.bind(companyController));

export default router; 