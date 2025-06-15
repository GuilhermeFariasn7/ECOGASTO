const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ msg: "Token não fornecido" });
    }

    const token = authHeader.split(" ")[1];

    try {
        const decoded = jwt.verify(token, 'secrettoken');
        req.usuario_idusuario = decoded.userId; // Disponível em todos os controllers
        next();
    } catch (error) {
        return res.status(403).json({ msg: "Token inválido" });
    }
};

module.exports = verifyToken;
