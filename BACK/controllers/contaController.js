const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const connect = require('../db/conn'); // Importar a função de conexão

// Inicialize a conexão globalmente
let connection;

(async () => {
    try {
        connection = await connect(); // Configure a conexão uma vez
    } catch (error) {
        console.error("Erro ao conectar ao banco de dados:", error);
    }
})();

const contaController = {

    create: async (req, res) => {
        try {
            
            const { nome,saldo} = req.body;  
            console.log(req.body);
            // Verificar se o login já existe
            const [results] = await connection.execute('SELECT nome FROM conta WHERE nome = ?', [nome]);

            if (results.length > 0) {
                return res.status(409).json({ msg: "Já existe uma conta registrada com este nome!" });
            }

            const query = 'INSERT INTO conta (nome,saldo) VALUES (?, ?)';
            await connection.execute(query, [nome,saldo]);

            res.status(200).json({ msg: "Conta criada com sucesso!" });
            
        } catch (error) {
            console.error(error);
            res.status(500).json({ msg: "Erro ao criar conta" });
        } 
    },

    getAll: async (req, res) => {
        try {
            const [results] = await connection.execute('SELECT * FROM conta');
            res.status(200).json(results);
        } catch (error) {
            console.error(error);
            res.status(500).json({ msg: "Erro ao buscar os conta" });
        }
    },

    getId: async (req, res) => {
        try {
            const id = req.params.id;
            const [results] = await connection.execute('SELECT * FROM conta WHERE idcategoria = ?', [id]);
            if (results.length === 0) {
                return res.status(404).json({ msg: "conta não encontrado" });
            }
            res.status(200).json(results[0]);
        } catch (error) {
            console.error(error);
            res.status(500).json({ msg: "Erro ao buscar o conta" });
        }
    },

    getName: async (req, res) => {
        try {
            const nome = req.params.nome;
            const [results] = await connection.execute('SELECT * FROM conta WHERE nome = ?', [nome]);
            if (results.length === 0) {
                return res.status(404).json({ msg: "conta não encontrado" });
            }
            res.status(200).json(results[0]);
        } catch (error) {
            console.error(error);
            res.status(500).json({ msg: "Erro ao buscar o conta" });
        }
    },

    delete: async (req, res) => {
        
    },

    update: async (req, res) => {
        
    }
};

module.exports = contaController;
