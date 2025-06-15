const router = require('express').Router();
const loginController = require('../controllers/loginController');
router.route("/login").loginController
module.exports = router;