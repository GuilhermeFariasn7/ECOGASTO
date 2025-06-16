const router = require('express').Router();
const userRoutes = require('./userRoutes'); // Rotas para usuário
const categoriaRoutes = require('./categoriaRoutes'); // Rotas para categoria
const contaRoutes = require('./contaRoutes'); // Rotas para conta
const transacoesRoutes = require('./transacoesRoutes'); // Rotas para transacoes
const parcelasRoutes = require('./parcelasRoutes'); // Rotas para parcelas
const metasRoutes = require('./metasRoutes'); // Rotas para metas

// Utilizando as rotas
router.use('/', userRoutes);      
router.use('/', categoriaRoutes); 
router.use('/', contaRoutes); 
router.use('/', transacoesRoutes); 
router.use('/', parcelasRoutes); 
router.use('/', metasRoutes); 
module.exports = router;
