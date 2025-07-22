import { Router } from 'express';
import { DomainController } from '../controllers/DomainController';

/**
 * @swagger
 * /domains/verify:
 *   post:
 *     summary: Verifica se um domínio está configurado corretamente
 *     tags: [Domains]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               domain:
 *                 type: string
 *                 description: O domínio a ser verificado
 *             required:
 *               - domain
 * 
 *     responses:
 *       200:
 *         description: Domínio verificado com sucesso
 *       400:
 *         description: Erro ao verificar domínio
 */

const router = Router();
const domainController = new DomainController();

router.post('/verify', domainController.postVerifyDomain.bind(domainController));

export default router;