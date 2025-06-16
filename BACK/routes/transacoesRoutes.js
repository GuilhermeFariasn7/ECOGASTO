const router = require('express').Router();
const transacoesController = require('../controllers/transacoesController');
const verifyToken = require('../middlewares/verifyToken');

router
    .route('/transacoes/grafico')
    .get(verifyToken, (req, res) => transacoesController.getGrafico(req, res));
    //.get((req, res) => transacoesController.getGrafico(req, res));
router
    .route('/transacoes')
    .post(verifyToken, (req, res) => transacoesController.create(req, res));

router
    .route('/transacoes')
    .get(verifyToken, (req, res) => transacoesController.getAll(req, res));

router
    .route('/transacoes/:id')
    .get(verifyToken, (req, res) => transacoesController.getId(req, res));

router
    .route('/transacoes/name/:name')
    .get(verifyToken, (req, res) => transacoesController.getName(req, res));

router
    .route('/transacoes/:id')
    .delete(verifyToken, (req, res) => transacoesController.delete(req, res));

router
    .route('/transacoes/:id')
    .put(verifyToken, (req, res) => transacoesController.update(req, res));

router
    .route('/transacoesStatus/:id')
    .put(verifyToken, (req, res) => transacoesController.updateStatus(req, res));



module.exports = router;
