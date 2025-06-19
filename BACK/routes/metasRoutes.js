const router = require('express').Router();
const metasController = require('../controllers/metasController');
const verifyToken = require('../middlewares/verifyToken');
router
    .route('/metas')
    .post(verifyToken, (req, res) => metasController.create(req, res));
router
    .route('/metas')
    .get(verifyToken, (req, res) => metasController.getAll(req, res));

router
    .route('/metas/grafico')
    .get(verifyToken, (req, res) => metasController.getGrafico(req, res));
    //.get((req, res) => transacoesController.getGrafico(req, res));
module.exports = router;