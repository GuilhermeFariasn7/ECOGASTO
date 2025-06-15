const router = require('express').Router();
const ProfessionalController = require('../controllers/professionalController');

//---------------------------------------------------------------------------

/**
 * @swagger
 * components:
 *   schemas:
 *     Professional:
 *       type: object
 *       required:
 *         - id
 *         - name
 *         - specialty
 *         - contact
 *         - phone_number
 *         - status
 *       properties:
 *         id:
 *           type: string
 *           description: O id é gerado automaticamente pelo cadastro do profissional
 *         name:
 *           type: string
 *           description: Nome do Profissional
 *         specialty:
 *           type: number
 *           description: Especialidade do Profissional
 *         contact:
 *           type: string
 *           description: Contato do Profissional
 *         phone_number:
 *           type: number
 *           description: Telefone do Profissional
 *         status:
 *           type: string
 *           description: Status do Profissional
 *       example:
 *         id: "0467b4a5-9f02-4a40-9057-986ce36784c1"
 *         name: "Romeu Pereira"
 *         specialty: "Fisioterapeuta"
 *         contact: "romeu@gmail.com"
 *         phone_number: 988595645
 *         status: "true"
 */

/**
 * @swagger
 * tags:
 *   name: Professionals
 *   description: API para gerenciamento de profisssionais
 */

/**
 * @swagger
 * /professional:
 *   post:
 *     summary: Cria um novo profissional
 *     tags: [Professionals]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Professional'
 *              
 *                  
 *     responses:
 *       200:
 *         description: Profissional criado com sucesso
 *       404:
 *         description: Dados inválidos
 */

/**
 * @swagger
 * /professional:
 *   get:
 *     summary: Retorna todos os profissionais
 *     tags: [Professionals]
 *     responses:
 *       200:
 *         description: Lista de profissionais
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Professional'
 */

/**
 * @swagger
 * /professional/{id}:
 *   get:
 *     summary: Retorna um profissional pelo ID
 *     tags: [Professionals]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID do profissional
 *     responses:
 *       200:
 *         description: Um profissional pelo ID
 *         contens:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Professional'
 *       404:
 *         description: Estudante não encontrado
 */

/**
 * @swagger
 * /professional/name/{nome}:
 *   get:
 *     summary: Retorna um profissional pelo Nome
 *     tags: [Professionals]
 *     parameters:
 *       - in: path
 *         name: nome
 *         schema:
 *           type: string
 *         required: true
 *         description: Nome do profissional
 *     responses:
 *       200:
 *         description: Um profissional pelo nome
 *         contens:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Professional'
 *       404:
 *         description: Profissional não encontrado
 */

/**
 * @swagger
 * /professional/{id}:
 *   delete:
 *     summary: Remove um profissional pelo ID
 *     tags: [Professionals]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID do profissional
 *     responses:
 *       200:
 *         description: O profissional foi removido com sucesso
 *         content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Professional'
 *       404:
 *         description: Profissional não encontrado
 */

/**
 * @swagger
 * /professional/{id}:
 *  put:
 *    summary: Atualiza um profissional pelo ID
 *    tags: [Professionals]
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *        required: true
 *        description: ID do profissional
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/Professional'
 *    responses:
 *      200:
 *        description: O profissional foi atualizado com sucesso
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Professional'
 *      404:
 *        description: Profissional não encontrado
 */

//---------------------------------------------------------------------------


router
.route('/professional')
.post((req, res) => ProfessionalController.create(req, res));

router
.route('/professional')
.get((req, res) => ProfessionalController.getAll(req, res));

router
.route('/professional/:id')
.get((req, res) => ProfessionalController.getId(req, res));

router
.route('/professional/name/:name')
.get((req, res) => ProfessionalController.getName(req, res));

router
.route('/professional/:id')
.delete((req, res) => ProfessionalController.delete(req, res));

router
.route('/professional/:id')
.put((req, res) => ProfessionalController.update(req, res));

module.exports = router;