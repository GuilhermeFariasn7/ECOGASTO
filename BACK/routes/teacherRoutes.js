const router = require('express').Router();
const TeacherController = require('../controllers/teacherController');

//---------------------------------------------------------------------------

/**
 * @swagger
 * components:
 *   schemas:
 *     Teacher:
 *       type: object
 *       required:
 *         - name
 *         - school_disciplines
 *         - contact
 *         - phone_number
 *         - status
 *       properties:
 *         id:
 *           type: string
 *           description: O id é gerado automaticamente pelo cadastro do professor
 *         name:
 *           type: string
 *           description: Nome do professor
 *         school_disciplines:
 *           type: string
 *           description: Nome da disciplina do professor
 *         contact:
 *           type: string
 *           description: Contato do professor
 *         phone_number:
 *           type: integer
 *           description: Número de telefone do professor
 *         status:
 *           type: string
 *           description: Status do professor
 *       example:
 *         id: "0467b4a5-9f02-4a40-9057-986ce36784c1"
 *         name: "Paulo Matos"
 *         school_disciplines: "Matemática"
 *         contact: "paulo@gmail.com"
 *         phone_number: 988595645
 *         status: "true"
 */

/**
 * @swagger
 * tags:
 *   name: Teachers
 *   description: API para gerenciamento de professores
 */


/**
 * @swagger
 * /teacher:
 *   post:
 *     summary: Cria um novo professor
 *     tags: [Teachers]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Teacher'
 *              
 *                  
 *     responses:
 *       200:
 *         description: Professor criado com sucesso
 *       404:
 *         description: Dados inválidos
 */

/**
 * @swagger
 * /teacher:
 *   get:
 *     summary: Retorna todos os professores
 *     tags: [Teachers]
 *     responses:
 *       200:
 *         description: Lista de professores
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Teacher'
 */

/**
 * @swagger
 * /teacher/{id}:
 *   get:
 *     summary: Retorna um professor pelo ID
 *     tags: [Teachers]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID do professor
 *     responses:
 *       200:
 *         description: Um professor pelo ID
 *         contens:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Teacher'
 *       404:
 *         description: Professor não encontrado
 */

/**
 * @swagger
 * /teacher/name/{nome}:
 *   get:
 *     summary: Retorna um professor pelo Nome
 *     tags: [Teachers]
 *     parameters:
 *       - in: path
 *         name: nome
 *         schema:
 *           type: string
 *         required: true
 *         description: Nome do professor
 *     responses:
 *       200:
 *         description: Um professor pelo nome
 *         contens:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Teacher'
 *       404:
 *         description: professor não encontrado
 */


/**
 * @swagger
 * /teacher/{id}:
 *   delete:
 *     summary: Remove um professor pelo ID
 *     tags: [Teachers]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID do professor
 *     responses:
 *       200:
 *         description: O professor foi removido com sucesso
 *         content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Teacher'
 *       404:
 *         description: professor não encontrado
 */

/**
 * @swagger
 * /teacher/{id}:
 *  put:
 *    summary: Atualiza um professor pelo ID
 *    tags: [Teachers]
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *        required: true
 *        description: ID do professor
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/Teacher'
 *    responses:
 *      200:
 *        description: O professor foi atualizado com sucesso
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Teacher'
 *      404:
 *        description: Professor não encontrado
 */

//---------------------------------------------------------------------------

router
.route('/teacher')
.post((req, res) => TeacherController.create(req, res));

router
.route('/teacher')
.get((req, res) => TeacherController.getAll(req, res));

router
.route('/teacher/:id')
.get((req, res) => TeacherController.getId(req, res));

router
.route('/teacher/name/:name')
.get((req, res) => TeacherController.getName(req, res));

router.route('/teacher/:id')
.delete((req, res) => TeacherController.delete(req, res));

router.route('/teacher/:id')
.put((req, res) => TeacherController.update(req, res));

module.exports = router;