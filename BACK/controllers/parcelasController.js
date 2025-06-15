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


const parcelasController = {
    getId: async (req, res) => {
        try {
            const id = req.params.id;
            const [results] = await connection.execute(
                'SELECT * FROM parcelas WHERE transacao_id = ?',
                [id]
            );
            if (results.length === 0) {
                return res.status(404).json({ msg: "Nenhuma parcela encontrada" });
            }
            res.status(200).json(results);
        } catch (error) {
            console.error(error);
            res.status(500).json({ msg: "Erro ao buscar as parcelas" });
        }
    },
    update: async (req, res) => { },
    updateStatus: async (req, res) => {
        try {
            const { id, status } = req.body;
            const usuario_idusuario = req.usuario_idusuario;
    
            // Primeiro: pega a transação da parcela
            const [parcelaResult] = await connection.execute(
                'SELECT transacao_id FROM parcelas WHERE id = ?',
                [id]
            );
    
            if (parcelaResult.length === 0) {
                return res.status(404).json({ msg: "Parcela não encontrada" });
            }
    
            const transacao_id = parcelaResult[0].transacao_id;
    
            // Atualiza a parcela
            const [resultsP] = await connection.execute(
                'UPDATE parcelas SET status = ? WHERE id = ?',
                [status, id]
            );
    
            if (resultsP.affectedRows === 0) {
                return res.status(404).json({ msg: "Erro ao atualizar parcela" });
            }
            console.log("transacao_id:", transacao_id);
            console.log("usuario_idusuario:", usuario_idusuario);
            
            // Se a nova parcela for pendente, deixa a transação como pendente também
            if (status === "Pendente") {
                await connection.execute(
                    'UPDATE transacoes SET status = ? WHERE idtransacoes = ? AND usuario_idusuario = ?',
                    [status, transacao_id, usuario_idusuario]
                );
            } else {
                // Se virou "Pago", verifica se TODAS as parcelas estão pagas
                const [parcelasDaTransacao] = await connection.execute(
                    'SELECT status FROM parcelas WHERE transacao_id = ?',
                    [transacao_id]
                );
    
                const todasPagas = parcelasDaTransacao.every(p => p.status === "Pago");
    
                if (todasPagas) {
                    await connection.execute(
                        'UPDATE transacoes SET status = ? WHERE idtransacoes = ? AND usuario_idusuario = ?',
                        ['Pago', transacao_id, usuario_idusuario]
                    );
                }
            }
    
            res.status(200).json({ msg: "Status atualizado com sucesso" });
    
        } catch (error) {
            console.error(error);
            res.status(500).json({ msg: "Erro ao atualizar a transação" });
        }
    }
    ,
}

module.exports = parcelasController;