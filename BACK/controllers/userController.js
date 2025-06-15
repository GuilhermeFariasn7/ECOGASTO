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

const UserController = {

    create: async (req, res) => {
        try {
            const { name, email, user, pwd, cpf, endereco_idendereco } = req.body;

            // Verificar se todos os campos obrigatórios estão presentes, exceto endereco_idendereco
            if (!name || !email || !user || !pwd || !cpf) {
                return res.status(400).json({ msg: "Campos obrigatórios faltando!" });
            }

            // Validação de senha: mínimo de 8 caracteres
            if (pwd.length < 8) {
                return res.status(400).json({ msg: "A senha deve ter pelo menos 8 caracteres!" });
            }

            // Validação do CPF: deve ter exatamente 11 números
            const cpfRegex = /^\d{11}$/; // Expressão regular para CPF
            if (!cpfRegex.test(cpf)) {
                return res.status(400).json({ msg: "CPF inválido. Deve conter 11 números." });
            }

            // Se o endereco_idendereco não foi fornecido, defina como null
            const endereco = endereco_idendereco || null;

            // Gerar o hash da senha com 10 rounds
            const saltRounds = 10;
            const hashedPwd = await bcrypt.hash(pwd, saltRounds);

            // Conectar ao banco de dados
            const connection = await connect();

            // Verificar se o login já existe
            const [results] = await connection.execute('SELECT * FROM usuario WHERE login = ?', [user]);

            if (results.length > 0) {
                return res.status(409).json({ msg: "Já existe um usuário registrado com este login!" });
            }

            // Gerar o token JWT
            const token = jwt.sign({ user }, 'secrettoken', { expiresIn: '1h' });

            // Query para inserir o novo usuário com endereco_idendereco como opcional
            const query = 'INSERT INTO usuario (login, senha, token, nome, email, cpf, endereco_idendereco) VALUES (?, ?, ?, ?, ?, ?, ?)';
            await connection.execute(query, [user, hashedPwd, token, name, email, cpf, 1]);

            res.status(200).json({ msg: "Usuário criado com sucesso!" });
        } catch (error) {
            console.error(error);
            res.status(500).json({ msg: "Erro ao criar o usuário" });
        }
    },

    getAll: async (req, res) => {
        try {
            const [results] = await connection.execute('SELECT * FROM usuario');
            res.status(200).json(results);
        } catch (error) {
            console.error(error);
            res.status(500).json({ msg: "Erro ao buscar os usuários" });
        }
    },

    getId: async (req, res) => {
        try {
            const id = req.params.id;
            const [results] = await connection.execute('SELECT * FROM usuario WHERE idusuario = ?', [id]);
            if (results.length === 0) {
                return res.status(404).json({ msg: "Usuário não encontrado" });
            }
            res.status(200).json(results[0]);
        } catch (error) {
            console.error(error);
            res.status(500).json({ msg: "Erro ao buscar o usuário" });
        }
    },

    getName: async (req, res) => {
        try {
            const nome = req.params.nome;
            const [results] = await connection.execute('SELECT * FROM usuario WHERE nome = ?', [nome]);
            if (results.length === 0) {
                return res.status(404).json({ msg: "Usuário não encontrado" });
            }
            res.status(200).json(results[0]);
        } catch (error) {
            console.error(error);
            res.status(500).json({ msg: "Erro ao buscar o usuário" });
        }
    },

    delete: async (req, res) => {
        try {
            const id = req.params.id;
            const [result] = await connection.execute('DELETE FROM usuario WHERE idusuario = ?', [id]);
            if (result.affectedRows === 0) {
                return res.status(404).json({ msg: "Usuário não encontrado" });
            }
            res.status(200).json({ msg: "Usuário excluído com sucesso" });
        } catch (error) {
            console.error(error);
            res.status(500).json({ msg: "Erro ao excluir o usuário" });
        }
    },

    update: async (req, res) => {
        try {
            const id = req.params.id;
            const { name, email, user, pwd, cpf, endereco_idendereco } = req.body;

            // Se a senha foi alterada, encripte-a antes de atualizar
            let updatedPassword = pwd;
            if (pwd) {
                const saltRounds = 10;
                updatedPassword = await bcrypt.hash(pwd, saltRounds);
            }

            const query = 'UPDATE usuario SET nome = ?, email = ?, login = ?, senha = ?, cpf = ?, endereco_idendereco = ? WHERE idusuario = ?';
            const [result] = await connection.execute(query, [name, email, user, updatedPassword, cpf, endereco_idendereco, id]);

            if (result.affectedRows === 0) {
                return res.status(404).json({ msg: "Usuário não encontrado" });
            }
            res.status(200).json({ msg: "Usuário atualizado com sucesso!" });

        } catch (error) {
            console.error(error);
            res.status(500).json({ msg: "Erro ao atualizar o usuário" });
        }
    },

    getLogin: async (req, res) => {
        try {
            const { user, pwd } = req.params;
            const [results] = await connection.execute('SELECT * FROM usuario WHERE login = ?', [user]);
    
            if (results.length === 0) {
                return res.status(401).json({ msg: "Usuário não encontrado" });
            }
    
            const loginData = results[0];
            const isPasswordValid = await bcrypt.compare(pwd, loginData.senha);
    
            if (!isPasswordValid) {
                return res.status(401).json({ msg: "Senha incorreta" });
            }
    
            const token = jwt.sign({ userId: loginData.idusuario }, 'secrettoken', { expiresIn: '1h' });
    
            // ✅ Retornando userId separadamente
            res.status(200).json({
                msg: "Login bem-sucedido",
                token,
                userId: loginData.idusuario
            });
    
        } catch (error) {
            console.error(error);
            res.status(500).json({ msg: "Erro no login" });
        }
    }
    
};

module.exports = UserController;
