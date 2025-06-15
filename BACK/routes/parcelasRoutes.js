const router = require('express').Router();
const parcelasController = require('../controllers/parcelasController');
const verifyToken = require('../middlewares/verifyToken');  // Middleware de autenticação

router
    .route('/parcelas')
    .get(verifyToken, (req, res) => parcelasController.getAll(req, res));

router
    .route('/parcelas/:id')
    .get(verifyToken, (req, res) => parcelasController.getId(req, res));

router
    .route('/parcelas/name/:name')
    .get(verifyToken, (req, res) => parcelasController.getName(req, res));

router
    .route('/parcelas/:id')
    .delete(verifyToken, (req, res) => parcelasController.delete(req, res));

router
    .route('/parcelas/:id')
    .put(verifyToken, (req, res) => parcelasController.update(req, res));

router
    .route('/parcelasStatus/:id')
    .put(verifyToken, (req, res) => parcelasController.updateStatus(req, res));

module.exports = router;
