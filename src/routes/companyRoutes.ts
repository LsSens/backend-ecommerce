import { Router } from 'express';
import { CompanyController } from '../controllers/CompanyController';
import { authenticateToken } from '../middleware/auth';
import { validateDto } from '../middleware/validation';
import { requirePermissions } from '../middleware/permissions';
import { UpdateCompanyDto } from '../dto/Company';

/**
 * @swagger
 * tags:
 *   name: Companies
 *   description: Gerenciamento da empresa atual
 */

/**
 * @swagger
 * /companies/current:
 *   get:
 *     summary: Busca dados da empresa atual do usuário
 *     tags: [Companies]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dados da empresa atual
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     name:
 *                       type: string
 *                     cnpj:
 *                       type: string
 *                     address:
 *                       type: string
 *                     domains:
 *                       type: array
 *                       items:
 *                         type: string
 *                     customizations:
 *                       type: object
 *                       properties:
 *                         homeBanners:
 *                           type: array
 *                           items:
 *                             type: string
 *                           description: URLs das imagens de banner da home (S3)
 *                         brandColors:
 *                           type: array
 *                           items:
 *                             type: string
 *                           description: Cores da marca em hexadecimal
 *                         logoUrl:
 *                           type: string
 *                           description: URL da logo da empresa (S3)
 *       401:
 *         description: Não autorizado
 *       404:
 *         description: Empresa não encontrada
 *   put:
 *     summary: Atualiza dados da empresa atual com base64 (apenas Admin)
 *     tags: [Companies]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Nome da empresa
 *               cnpj:
 *                 type: string
 *                 description: CNPJ no formato XX.XXX.XXX/XXXX-XX
 *               address:
 *                 type: string
 *                 description: Endereço da empresa
 *               domains:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Lista de domínios da empresa
 *               customizations:
 *                 type: object
 *                 properties:
 *                   logo:
 *                     type: string
 *                     description: Logo em base64 (data:image/...;base64,...)
 *                   homeBanners:
 *                     type: array
 *                     items:
 *                       type: string
 *                     description: Banners em base64 (máximo 10)
 *                     maxItems: 10
 *                   brandColors:
 *                     type: array
 *                     items:
 *                       type: string
 *                       pattern: '^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$'
 *                     description: Cores da marca em hexadecimal (máximo 5)
 *                     maxItems: 5
 *     responses:
 *       200:
 *         description: Empresa atualizada com sucesso
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
 *                   description: Dados da empresa com URLs do S3
 *       400:
 *         description: Erro de validação ou upload
 *       403:
 *         description: Acesso negado - apenas Admin pode atualizar
 *       404:
 *         description: Empresa não encontrada
 */

const router = Router();
const companyController = new CompanyController();

router.get('/current', authenticateToken, companyController.getCurrentCompany.bind(companyController));
router.put('/current', 
  authenticateToken, 
  requirePermissions.Admin, 
  validateDto(UpdateCompanyDto),
  companyController.updateCompany.bind(companyController)
);

export default router;