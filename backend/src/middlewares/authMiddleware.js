require('dotenv').config();
const jwt = require('jsonwebtoken');


function authMiddleware(req, res, next) {
    const authHeader = req.headers['authorization'];
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: "Acceso denegado. Token requerido." });
    }

    const token = authHeader && authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ error: "Token inválido." });
    }
};

module.exports = authMiddleware;