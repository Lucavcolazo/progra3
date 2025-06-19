const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
    // Obtener el token de la cookie
    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({ error: 'No autorizado - Token no proporcionado' });
    }

    try {
        // Verificar el token
        const decoded = jwt.verify(token, 'tu_clave_secreta'); // Usa la misma clave que en el login
        req.user = decoded; // Agregar la información del usuario al request
        next();
    } catch (error) {
        return res.status(401).json({ error: 'No autorizado - Token inválido' });
    }
};

module.exports = authMiddleware;