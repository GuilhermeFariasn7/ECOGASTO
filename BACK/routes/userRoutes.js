const router = require('express').Router();
const UserController = require('../controllers/userController');

router
.route('/user')
.post((req, res) => UserController.create(req, res));

router
.route('/user')
.get((req, res) => UserController.getAll(req, res));

router
.route('/user/:id')
.get((req, res) => UserController.getId(req, res));

router
.route('/user/name/:name')
.get((req, res) => UserController.getName(req, res));

router
.route('/user/:id')
.delete((req, res) => UserController.delete(req, res));

router
.route('/user/:id')
.put((req, res) =>  UserController.update(req, res));

router
.route('/user/login/:user/:pwd')
.get((req, res) => UserController.getLogin(req, res));

module.exports = router;