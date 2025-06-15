const router = require('express').Router();
const contaController = require('../controllers/contaController');

router
.route('/conta')
.post((req, res) => contaController.create(req, res));

router
.route('/conta')
.get((req, res) => contaController.getAll(req, res));

router
.route('/conta/:id')
.get((req, res) => contaController.getId(req, res));

router
.route('/conta/name/:name')
.get((req, res) => contaController.getName(req, res));

router
.route('/conta/:id')
.delete((req, res) => contaController.delete(req, res));

router
.route('/conta/:id')
.put((req, res) =>  contaController.update(req, res));


module.exports = router;