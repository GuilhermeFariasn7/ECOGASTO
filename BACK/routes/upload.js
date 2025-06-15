// backend/routes/upload.js
const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const router = express.Router();
const connect = require('../db/conn'); // Ajusta o caminho se estiver diferente

// Função para garantir que o diretório exista
const ensureDirExists = (dirPath) => {
    if (!fs.existsSync(dirPath)) {
        console.log(`Criando diretório: ${dirPath}`);
        fs.mkdirSync(dirPath, { recursive: true });
    }
};

// Configuração do storage do Multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const { userId, transacaoId } = req.query; // <- trocou body por query
        console.log('destination:', userId, transacaoId);

        if (!userId || !transacaoId) {
            return cb(new Error('userId e transacaoId são obrigatórios'));
        }

        const userDir = path.join(__dirname, '..', 'public', 'imagensitem', `user-${userId}`, `transacao-${transacaoId}`);
        ensureDirExists(userDir);
        cb(null, userDir);
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
        cb(null, uniqueName);
    }
});

const upload = multer({ storage });

// Rota de upload
router.post('/upload', upload.single('file'), async (req, res) => {

    if (!req.file) {
        return res.status(400).json({ error: 'Nenhum arquivo enviado' });
    }

    const { userId, transacaoId } = req.query;

    const relativePath = `/imagensitem/user-${userId}/transacao-${transacaoId}/${req.file.filename}`;

    console.log('Arquivo enviado com sucesso:', relativePath);  // Log para verificar o caminho do arquivo

    const connection = await connect();

    await connection.execute(
        'UPDATE transacoes SET imagem = ? WHERE idtransacoes = ? AND usuario_idusuario = ?',
        [req.file.filename, transacaoId, userId]
    );

    return res.status(200).json({
        filename: req.file.filename,
        path: relativePath
    });
});

module.exports = router;
