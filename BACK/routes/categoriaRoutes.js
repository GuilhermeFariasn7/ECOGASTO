const router = require('express').Router();
const categoriaController = require('../controllers/categoriaController');

router
.route('/categoria')
.post((req, res) => categoriaController.create(req, res));

router
.route('/categoria')
.get((req, res) => categoriaController.getAll(req, res));

router
.route('/categoria/:id')
.get((req, res) => categoriaController.getId(req, res));

router
.route('/categoria/name/:name')
.get((req, res) => categoriaController.getName(req, res));

router
.route('/categoria/:id')
.delete((req, res) => categoriaController.delete(req, res));

router
.route('/categoria/:id')
.put((req, res) =>  categoriaController.update(req, res));


module.exports = router;