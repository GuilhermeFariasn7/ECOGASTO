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

const categoriaController = {

    create: async (req, res) => {
        try {
            
            const { nome,descricao} = req.body;  

            // Verificar se o login já existe
            const [results] = await connection.execute('SELECT nome FROM categoria WHERE nome = ?', [nome]);

            if (results.length > 0) {
                return res.status(409).json({ msg: "Já existe uma categoria registrada com este nome!" });
            }

            const query = 'INSERT INTO categoria (nome,descricao) VALUES (?, ?)';
            await connection.execute(query, [nome,descricao]);

            res.status(200).json({ msg: "Categoria criada com sucesso!" });

        } catch (error) {
            console.error(error);
            res.status(500).json({ msg: "Erro ao criar categoria" });
        }        
    },

    getAll: async (req, res) => {
        try {
            const [results] = await connection.execute('SELECT * FROM categoria');
            res.status(200).json(results);
        } catch (error) {
            console.error(error);
            res.status(500).json({ msg: "Erro ao buscar categorias" });
        }
    },

    getId: async (req, res) => {
        try {
            const id = req.params.id;
            const [results] = await connection.execute('SELECT * FROM categoria WHERE idcategoria = ?', [id]);
            if (results.length === 0) {
                return res.status(404).json({ msg: "categoria não encontrada" });
            }
            res.status(200).json(results[0]);
        } catch (error) {
            console.error(error);
            res.status(500).json({ msg: "Erro ao buscar a categoria" });
        }
    },

    getName: async (req, res) => {
        try {
            const nome = req.params.nome;
            const [results] = await connection.execute('SELECT * FROM categoria WHERE nome = ?', [nome]);
            if (results.length === 0) {
                return res.status(404).json({ msg: "categoria não encontrada" });
            }
            res.status(200).json(results[0]);
        } catch (error) {
            console.error(error);
            res.status(500).json({ msg: "Erro ao buscar a categoria" });
        }
    },

    delete: async (req, res) => {
        
    },

    update: async (req, res) => {
        
    }
};

module.exports = categoriaController;
