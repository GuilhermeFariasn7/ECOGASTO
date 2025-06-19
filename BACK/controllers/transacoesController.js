const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const connect = require('../db/conn');

let connection;

(async () => {
    try {
        connection = await connect();
    } catch (error) {
        console.error("Erro ao conectar ao banco de dados:", error);
    }
})();

const transacoesController = {
    create: async (req, res) => {
        try {
            const {
                nome, descricao, valor, categoria_idcategoria, conta_idconta,
                data_inicio, data_fim, status, numParcelas, dia_util, diaParcela
            } = req.body;

            const usuario_idusuario = req.usuario_idusuario;

            const [results] = await connection.execute(
                'SELECT nome FROM transacoes WHERE nome = ? AND usuario_idusuario = ?',
                [nome, usuario_idusuario]
            );

            if (results.length > 0) {
                return res.status(409).json({ msg: "Já existe uma transação registrada com este nome!" });
            }

            let query = `INSERT INTO transacoes (nome, descricao, valor, categoria_idcategoria, data_ini, data_fim, status, num_parcelas, dia_util, num_dia, usuario_idusuario) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
            const [insertResult] = await connection.execute(query, [
                nome, descricao, valor, categoria_idcategoria,
                data_inicio, data_fim, status, numParcelas,
                dia_util, diaParcela, usuario_idusuario
            ]);

            let idInserido = insertResult.insertId;
            query = `INSERT INTO parcelas (num_seq, transacao_id, data_vencimento, valor, status) VALUES (?, ?, ?, ?, ?)`;

            const dataBase = new Date(data_inicio);

            for (let wi = 1; wi <= numParcelas; wi++) {
                const dataParcela = new Date(dataBase);
                dataParcela.setMonth(dataParcela.getMonth() + (wi - 1));
                const dataFormatada = dataParcela.toISOString().slice(0, 10);

                await connection.execute(query, [wi, idInserido, dataFormatada, valor, "Pendente"]);
            }

            res.status(200).json({ msg: "Transação criada com sucesso!" });
        } catch (error) {
            console.error(error);
            res.status(500).json({ msg: "Erro ao criar transação, por gentileza verifique os dados digitados" });
        }
    },

    getAll: async (req, res) => {
        try {
            const usuario_idusuario = req.usuario_idusuario;

            const query = `
                SELECT t.*, c.nome AS categoria_nome 
                FROM transacoes t 
                LEFT JOIN categoria c ON t.categoria_idcategoria = c.idcategoria
                WHERE t.usuario_idusuario = ?
            `;
            const [results] = await connection.execute(query, [usuario_idusuario]);

            res.status(200).json(results);
        } catch (error) {
            console.error(error);
            res.status(500).json({ msg: "Erro ao buscar transações" });
        }
    },

    getId: async (req, res) => {
        try {
            const id = req.params.id;
            const usuario_idusuario = req.usuario_idusuario;

            const [results] = await connection.execute(
                'SELECT * FROM transacoes WHERE idtransacoes = ? AND usuario_idusuario = ?',
                [id, usuario_idusuario]
            );

            if (results.length === 0) {
                return res.status(404).json({ msg: "Transação não encontrada" });
            }

            res.status(200).json(results[0]);
        } catch (error) {
            console.error(error);
            res.status(500).json({ msg: "Erro ao buscar a transação" });
        }
    },

    getName: async (req, res) => {
        try {
            const nome = req.params.nome;

            const [results] = await connection.execute(
                'SELECT * FROM categoria WHERE nome = ?',
                [nome]
            );

            if (results.length === 0) {
                return res.status(404).json({ msg: "Categoria não encontrada" });
            }

            res.status(200).json(results[0]);
        } catch (error) {
            console.error(error);
            res.status(500).json({ msg: "Erro ao buscar a categoria" });
        }
    },

    delete: async (req, res) => {
        try {
            const idtransacoes = req.params.id;
            const usuario_idusuario = req.usuario_idusuario;

            const [results] = await connection.execute(
                'DELETE FROM transacoes WHERE idtransacoes = ? AND usuario_idusuario = ?',
                [idtransacoes, usuario_idusuario]
            );

            if (results.affectedRows === 0) {
                return res.status(404).json({ msg: "Transação não encontrada" });
            }

            res.status(200).json({ msg: "Transação excluída com sucesso" });
        } catch (error) {
            console.error(error);
            res.status(500).json({ msg: "Erro ao excluir a transação" });
        }
    },

    updateStatus: async (req, res) => {
        try {
            const { idtransacoes, status } = req.body;
            const usuario_idusuario = req.usuario_idusuario;

            const [results] = await connection.execute(
                'UPDATE transacoes SET status = ? WHERE idtransacoes = ? AND usuario_idusuario = ?',
                [status, idtransacoes, usuario_idusuario]
            );

            if (results.affectedRows === 0) {
                return res.status(404).json({ msg: "Transação não encontrada" });
            }
            const [resultsP] = await connection.execute(
                'UPDATE parcelas SET status = ? WHERE transacao_id = ?',
                [status, idtransacoes]
            );

            if (resultsP.affectedRows === 0) {
                return res.status(404).json({ msg: "Parcela não encontrada" });
            }

            res.status(200).json({ msg: "Status atualizado com sucesso" });
        } catch (error) {
            console.error(error);
            res.status(500).json({ msg: "Erro ao atualizar a transação" });
        }
    },

    update: async (req, res) => {
        console.log("TESTE");
        try {
            const {
                idtransacoes, nome, descricao, valor, data, categoria_idcategoria,
                data_ini, data_fim, numParcelas, status, dia_util, num_dia
            } = req.body;

            const usuario_idusuario = req.usuario_idusuario;

            if (!idtransacoes || !nome || !descricao || !valor || !data ||
                !categoria_idcategoria || !data_ini || !numParcelas || !status) {
                return res.status(400).json({ msg: "Todos os campos obrigatórios devem ser preenchidos." });
            }

            const formatDate = (isoDate) => {
                if (!isoDate) return null;
                const dateObj = new Date(isoDate);
                return dateObj.toISOString().slice(0, 19).replace("T", " ");
            };

            const dataFormatada = formatDate(data);
            const dataIniFormatada = formatDate(data_ini);
            const dataFimFormatada = formatDate(data_fim);

            const [results] = await connection.execute(
                `UPDATE transacoes 
                 SET nome = ?, descricao = ?, valor = ?, data = ?, categoria_idcategoria = ?, 
                     data_ini = ?, data_fim = ?, num_parcelas = ?, status = ?, 
                     dia_util = ?, num_dia = ?
                 WHERE idtransacoes = ? AND usuario_idusuario = ?`,
                [
                    nome, descricao, valor, dataFormatada, categoria_idcategoria,
                    dataIniFormatada, dataFimFormatada, numParcelas, status,
                    dia_util || 0, num_dia || null, idtransacoes, usuario_idusuario
                ]
            );

            if (results.affectedRows === 0) {
                return res.status(404).json({ msg: "Transação não encontrada" });
            }

            await connection.execute(
                'DELETE FROM parcelas WHERE transacao_id = ?',
                [idtransacoes]
            );

            const parcelas = [];
            let dataAtual = new Date(dataIniFormatada);

            for (let i = 0; i < numParcelas; i++) {
                const vencimento = new Date(dataAtual);
                vencimento.setMonth(vencimento.getMonth() + i);
                const vencimentoFormatado = vencimento.toISOString().split("T")[0];

                parcelas.push([idtransacoes, vencimentoFormatado, valor, 'Pendente']);
            }

            await connection.query(
                'INSERT INTO parcelas (transacao_id, data_vencimento, valor, status) VALUES ?',
                [parcelas]
            );

            res.status(200).json({ msg: "Transação atualizada com sucesso." });

        } catch (error) {
            console.error(error);
            res.status(500).json({ msg: "Erro ao atualizar a transação." });
        }
    }


};

module.exports = transacoesController;
