const router = require('express').Router();
const StudentController = require('../controllers/studentController');

//---------------------------------------------------------------------------

/**
 * @swagger
 * components:
 *   schemas:
 *     Student:
 *       type: object
 *       required:
 *         - id
 *         - name
 *         - age
 *         - parents
 *         - phone_number
 *         - special_needs
 *         - status
 *       properties:
 *         id:
 *           type: string
 *           description: O id é gerado automaticamente pelo cadastro do estudante
 *         name:
 *           type: string
 *           description: Nome do Estudante
 *         age:
 *           type: number
 *           description: Idade do Estudante
 *         parents:
 *           type: string
 *           description: Pais do Estudante
 *         phone_number:
 *           type: number
 *           description: Telefone do Estudante
 *         special_needs:
 *           type: string
 *           description: Deficiência especial do Estudante
 *         status:
 *           type: string
 *           description: Status do Estudante
 *       example:
 *         id: "0467b4a5-9f02-4a40-9057-986ce36784c1"
 *         name: "Paulo Matos"
 *         age: 6
 *         parents: "José Matos e Marina Matos"
 *         phone_number: 988595645
 *         special_needs: "Síndrome de Down"
 *         status: "true"
 */

/**
 * @swagger
 * tags:
 *   name: Students
 *   description: API para gerenciamento de estudantes
 */

/**
 * @swagger
 * /student:
 *   post:
 *     summary: Cria um novo estudante
 *     tags: [Students]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Student'
 *              
 *                  
 *     responses:
 *       200:
 *         description: Estudante criado com sucesso
 *       404:
 *         description: Dados inválidos
 */

/**
 * @swagger
 * /student:
 *   get:
 *     summary: Retorna todos os estudantes
 *     tags: [Students]
 *     responses:
 *       200:
 *         description: Lista de estudantes
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Student'
 */

/**
 * @swagger
 * /student/{id}:
 *   get:
 *     summary: Retorna um estudante pelo ID
 *     tags: [Students]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID do estudante
 *     responses:
 *       200:
 *         description: Um estudante pelo ID
 *         contens:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Student'
 *       404:
 *         description: Estudante não encontrado
 */

/**
 * @swagger
 * /student/name/{nome}:
 *   get:
 *     summary: Retorna um estudante pelo Nome
 *     tags: [Students]
 *     parameters:
 *       - in: path
 *         name: nome
 *         schema:
 *           type: string
 *         required: true
 *         description: Nome do estudante
 *     responses:
 *       200:
 *         description: Um estudante pelo nome
 *         contens:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Student'
 *       404:
 *         description: Estudante não encontrado
 */

/**
 * @swagger
 * /student/{id}:
 *   delete:
 *     summary: Remove um estudante pelo ID
 *     tags: [Students]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID do estudante
 *     responses:
 *       200:
 *         description: O estudante foi removido com sucesso
 *         content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Student'
 *       404:
 *         description: Estudante não encontrado
 */

/**
 * @swagger
 * /student/{id}:
 *  put:
 *    summary: Atualiza um estudante pelo ID
 *    tags: [Students]
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *        required: true
 *        description: ID do estudante
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/Student'
 *    responses:
 *      200:
 *        description: O estudante foi atualizado com sucesso
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Student'
 *      404:
 *        description: Estudante não encontrado
 */

//---------------------------------------------------------------------------

router
.route('/student')
.post((req, res) => StudentController.create(req, res));

router
.route('/student')
.get((req, res) => StudentController.getAll(req, res));

router
.route('/student/:id')
.get((req, res) => StudentController.getId(req, res));

router
.route('/student/name/:name')
.get((req, res) => StudentController.getName(req, res));

router.route('/student/:id')
.delete((req, res) => StudentController.delete(req, res));

router.route('/student/:id')
.put((req, res) => StudentController.update(req, res));

module.exports = router;