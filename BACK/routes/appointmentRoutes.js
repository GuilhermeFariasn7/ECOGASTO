const router = require('express').Router();
const AppointmentController = require('../controllers/appointmentController');

//---------------------------------------------------------------------------

/**
 * @swagger
 * components:
 *   schemas:
 *     Appointment:
 *       type: object
 *       required:
 *         - id
 *         - specialty
 *         - comments
 *         - date
 *         - student
 *         - professional
 *       properties:
 *         id:
 *           type: string
 *           description: O id é gerado automaticamente pelo cadastro do agendamento
 *         specialty:
 *           type: string
 *           description: Especialidade do agendamento
 *         comments:
 *           type: string
 *           description: Comentário do agendamento
 *         date:
 *           type: date
 *           description: Data do agendamento
 *         student:
 *           type: student
 *           description: Estudante do agendamento
 *         professional:
 *           type: professional
 *           description: Profissional do agendamento
 *       example:
 *         id: "64f8b1e4a3c4e1b234567892"
 *         specialty: "Cardiologia"
 *         comments: "Consulta de rotina"
 *         date: "2024-11-19"
 *         student: "Luan Ramos"
 *         professional: "Vitor Ramos"
 */

/**
 * @swagger
 * tags:
 *   name: Appointments
 *   description: API para gerenciamento de agendamentos
 */

/**
 * @swagger
 * /appointment:
 *   post:
 *     summary: Cria um novo agendamento
 *     tags: [Appointments]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Appointment'
 *              
 *                  
 *     responses:
 *       200:
 *         description: Agendamento criado com sucesso
 *       404:
 *         description: Dados inválidos
 */

/**
 * @swagger
 * /appointment:
 *   get:
 *     summary: Retorna todos os agendamentos
 *     tags: [Appointments]
 *     responses:
 *       200:
 *         description: Lista de agendamentos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Appointment'
 */

/**
 * @swagger
 * /appointment/{id}:
 *   get:
 *     summary: Retorna um agendamento pelo ID
 *     tags: [Appointments]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID do agendamento
 *     responses:
 *       200:
 *         description: Um agendamento pelo ID
 *         contens:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Appointment'
 *       404:
 *         description: Agendamento não encontrado
 */

/**
 * @swagger
 * /appointment/dateInterval/date-range:
 *   get:
 *     summary: Buscar agendamentos por intervalo de datas
 *     tags: [Appointments]
 *     parameters:
 *       - name: startDate
 *         in: query
 *         description: Data inicial para o filtro dos agendamentos
 *         required: true
 *         type: string
 *         format: date
 *         example: '2024-01-01'
 *       - name: endDate
 *         in: query
 *         description: Data final para o filtro dos agendamentos
 *         required: true
 *         type: string
 *         format: date
 *         example: '2024-12-31'
 *     responses:
 *       200:
 *         description: Lista de agendamentos encontrados dentro do intervalo de datas
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Appointment'
 *       400:
 *         description: Datas inválidas ou parâmetros ausentes
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   example: 'Datas inicial e final são obrigatórias'
 *       404:
 *         description: Nenhum agendamento encontrado no intervalo de datas
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   example: 'Nenhum agendamento encontrado nesse intervalo de datas'
 *       500:
 *         description: Erro interno ao buscar agendamento
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   example: 'Erro ao buscar agendamento'
 * 
 */

/**
 * @swagger
 * /appointment/{id}:
 *   delete:
 *     summary: Remove um agendamento pelo ID
 *     tags: [Appointments]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID do agendamento
 *     responses:
 *       200:
 *         description: O agendamento foi removido com sucesso
 *         content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Appointment'
 *       404:
 *         description: Agendamento não encontrado
 */

/**
 * @swagger
 * /appointment/{id}:
 *  put:
 *    summary: Atualiza um agendamento pelo ID
 *    tags: [Appointments]
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *        required: true
 *        description: ID do agendamento
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/Appointment'
 *    responses:
 *      200:
 *        description: O agendamento foi atualizado com sucesso
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Appointment'
 *      404:
 *        description: Agendamento não encontrado
 */

//---------------------------------------------------------------------------

router
.route('/appointment')
.post((req, res) => AppointmentController.create(req, res));

router
.route('/appointment')
.get((req, res) => AppointmentController.getAll(req, res));

router
.route('/appointment/:id')
.get((req, res) => AppointmentController.getId(req, res));

router
.route('/appointment/date/:date')
.get((req, res) => AppointmentController.getByDate(req, res));

router
.route('/appointment/dateInterval/date-range')
.get((req, res) => AppointmentController.getByDateRange(req, res));

router
.route('/appointment/:id')
.delete((req, res) => AppointmentController.delete(req, res));

router
.route('/appointment/:id')
.put((req, res) => AppointmentController.update(req, res));

module.exports = router;