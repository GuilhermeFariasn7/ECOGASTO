const connect = require('../db/conn');

let connection;

(async () => {
    try {
        connection = await connect();
    } catch (error) {
        console.error("Erro ao conectar ao banco de dados:", error);
    }
})();

const metasController = {

    create: async (req, res) => {
        try {
            /* nome,
                idCategoria,
                descricao,
                dataLimite,
                valorAlvo,
                valorAtual */
            const {
                nome,
                valorAlvo,
                valorAtual,
                dataLimite,
                idCategoria,

            } = req.body;

            const usuario_idusuario = req.usuario_idusuario;
            const status = "em_andamento";

            // Validação simples de campos obrigatórios
            if (!nome || nome.trim() === "") {
                return res.status(400).json({ msg: "Campo 'nome' não pode estar vazio!" });
            }
            if (valorAlvo == null) {  // aceita 0 mas não null/undefined
                return res.status(400).json({ msg: "Campo 'valorAlvo' não pode estar vazio!" });
            }
            if (valorAtual == null) {
                return res.status(400).json({ msg: "Campo 'valorAtual' não pode estar vazio!" });
            }
            if (!dataLimite || dataLimite.trim() === "") {
                return res.status(400).json({ msg: "Campo 'dataLimite' não pode estar vazio!" });
            }
            if (idCategoria == null) {
                return res.status(400).json({ msg: "Campo 'idCategoria' não pode estar vazio!" });
            }
            if (!status || status.trim() === "") {
                return res.status(400).json({ msg: "Campo 'status' não pode estar vazio!" });
            }

            // Opcional: validar se status está entre os valores aceitos
            const statusPermitidos = ['em_andamento', 'concluida', 'vencida'];
            if (!statusPermitidos.includes(status)) {
                return res.status(400).json({ msg: "Campo 'status' tem valor inválido!" });
            }

            const [results] = await connection.execute(
                'SELECT nome FROM metas WHERE nome = ? AND usuario_idusuario = ?',
                [nome, usuario_idusuario]
            );

            if (results.length > 0) {
                return res.status(409).json({ msg: "Já existe uma meta registrada com este nome!" });
            }

            let query = `INSERT INTO metas (nome, valor_alvo, valor_atual, data_limite, categoria_idcategoria, status, usuario_idusuario) VALUES (?, ?, ?, ?, ?, ?, ?)`;
            await connection.execute(query, [
                nome,
                valorAlvo,
                valorAtual,
                dataLimite,
                idCategoria,
                status || 'em_andamento',
                usuario_idusuario
            ]);

            res.status(200).json({ msg: "Meta criada com sucesso!" });
        } catch (error) {
            console.error(error);
            res.status(500).json({ msg: "Erro ao criar metas, por gentileza verifique os dados digitados" });
        }
    },

    getAll: async (req, res) => {
        try {
            const usuario_idusuario = req.usuario_idusuario;

            const query = `
      SELECT * 
      FROM metas 
      WHERE usuario_idusuario = ?
    `;

            const [results] = await connection.execute(query, [usuario_idusuario]);
            res.status(200).json(results);
        } catch (error) {
            console.error(error);
            res.status(500).json({ msg: "Erro ao buscar metas" });
        }
    },
    // NOVA FUNÇÃO PARA GRÁFICO,
    getGrafico: async (req, res) => {
        console.log("ta entrando aqui...");
        try {
            const usuario_idusuario = req.usuario_idusuario;
            const { dataInicio, dataFim, tipo, idCategoria } = req.query;

            let query = `
            SELECT 
                DATE_FORMAT(t.data_ini, '%Y-%m') AS mes,
                c.nome AS categoria,
                SUM(t.valor) AS total
            FROM transacoes t
            JOIN categoria c ON c.idcategoria = t.categoria_idcategoria
            WHERE t.usuario_idusuario = ?
        `;

            const params = [usuario_idusuario];

            if (dataInicio) {
                query += ` AND t.data_ini >= ?`;
                params.push(dataInicio);
            }

            if (dataFim) {
                query += ` AND t.data_ini <= ?`;
                params.push(dataFim);
            }

            if (tipo === 'despesa') {
                query += ` AND t.valor < 0`;
            } else if (tipo === 'receita') {
                query += ` AND t.valor > 0`;
            }

            if (idCategoria) {
                query += ` AND t.categoria_idcategoria = ?`;
                params.push(idCategoria);
            }

            query += ` GROUP BY mes, categoria ORDER BY mes, categoria`;

            const [results] = await connection.execute(query, params);

            res.status(200).json(results);
        } catch (error) {
            console.error(error);
            res.status(500).json({ msg: "Erro ao buscar dados para gráfico." });
        }
    }

};

module.exports = metasController;
