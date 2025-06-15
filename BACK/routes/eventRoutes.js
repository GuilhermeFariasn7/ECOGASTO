const router = require('express').Router();
const EventController = require('../controllers/eventController');

//---------------------------------------------------------------------------

/**
 * @swagger
 * components:
 *   schemas:
 *     Event:
 *       type: object
 *       required:
 *         - id
 *         - name
 *         - description
 *         - comments
 *         - date
 *       properties:
 *         id:
 *           type: string
 *           description: O id é gerado automaticamente pelo cadastro do evento
 *         name:
 *           type: string
 *           description: Nome do evento
 *         description:
 *           type: number
 *           description: Descrição do evento
 *         comments:
 *           type: string
 *           description: Comentário do evento
 *         date:
 *           type: date
 *           description: Data do evento
 *       example:
 *         id: "0467b4a5-9f02-4a40-9057-986ce36784c1"
 *         name: "Evento sobre Tecnologia"
 *         description: "Tecnologia é Tudo"
 *         comments: "Entrada livre"
 *         date: "2024-11-19"
 */

/**
 * @swagger
 * tags:
 *   name: Events
 *   description: API para gerenciamento de eventos
 */

/**
 * @swagger
 * /event:
 *   post:
 *     summary: Cria um novo evento
 *     tags: [Events]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Event'
 *              
 *                  
 *     responses:
 *       200:
 *         description: Evento criado com sucesso
 *       404:
 *         description: Dados inválidos
 */

/**
 * @swagger
 * /event:
 *   get:
 *     summary: Retorna todos os eventos
 *     tags: [Events]
 *     responses:
 *       200:
 *         description: Lista de eventos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Event'
 */

/**
 * @swagger
 * /event/{id}:
 *   get:
 *     summary: Retorna um evento pelo ID
 *     tags: [Events]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID do evento
 *     responses:
 *       200:
 *         description: Um evento pelo ID
 *         contens:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Event'
 *       404:
 *         description: Evento não encontrado
 */

/**
 * @swagger
 * /event/dateInterval/date-range:
 *   get:
 *     summary: Buscar eventos por intervalo de datas
 *     tags: [Events]
 *     parameters:
 *       - name: startDate
 *         in: query
 *         description: Data inicial para o filtro dos eventos
 *         required: true
 *         type: string
 *         format: date
 *         example: '2024-01-01'
 *       - name: endDate
 *         in: query
 *         description: Data final para o filtro dos eventos
 *         required: true
 *         type: string
 *         format: date
 *         example: '2024-12-31'
 *     responses:
 *       200:
 *         description: Lista de eventos encontrados dentro do intervalo de datas
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Event'
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
 *         description: Nenhum evento encontrado no intervalo de datas
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   example: 'Nenhum evento encontrado nesse intervalo de datas'
 *       500:
 *         description: Erro interno ao buscar evento
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   example: 'Erro ao buscar evento'
 * components:
 *   schemas:
 *     Event:
 *       type: object
 *       required:
 *         - id
 *         - name
 *         - description
 *         - date
 *       properties:
 *         name:
 *           type: string
 *           description: Nome do evento
 *         description:
 *           type: string
 *           description: Descrição do evento
 *         date:
 *           type: string
 *           format: date-time
 *           description: Data e hora do evento

 */

/**
 * @swagger
 * /event/{id}:
 *   delete:
 *     summary: Remove um evento pelo ID
 *     tags: [Events]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID do evento
 *     responses:
 *       200:
 *         description: O evento foi removido com sucesso
 *         content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Event'
 *       404:
 *         description: Evento não encontrado
 */

/**
 * @swagger
 * /event/{id}:
 *  put:
 *    summary: Atualiza um evento pelo ID
 *    tags: [Events]
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *        required: true
 *        description: ID do evento
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/Event'
 *    responses:
 *      200:
 *        description: O evento foi atualizado com sucesso
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Event'
 *      404:
 *        description: Evento não encontrado
 */

//---------------------------------------------------------------------------

router
.route('/event')
.post((req, res) => EventController.create(req, res));

router
.route('/event')
.get((req, res) => EventController.getAll(req, res));

router
.route('/event/:id')
.get((req, res) => EventController.getId(req, res));

router
.route('/event/date/:date')
.get((req, res) => EventController.getByDate(req, res));

router
.route('/event/dateInterval/date-range')
.get((req, res) => EventController.getByDateRange(req, res));

router
.route('/event/:id')
.delete((req, res) => EventController.delete(req, res));

router
.route('/event/:id')
.put((req, res) => EventController.update(req, res));

module.exports = router;