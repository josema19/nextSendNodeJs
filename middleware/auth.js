// Importar Librerías
const jwt = require('jsonwebtoken');
require('dotenv').config({ path: 'variables.env' });

// Hacer exportaciones
module.exports = (req, res, next) => {
    // Obtener Header de autenticación
    const authHeader = req.get('Authorization');
    if (authHeader) {
        // Obtener Token
        const token = authHeader.replace('Bearer ', '');

        // Comprobar jwk
        try {
            const usuario = jwt.verify(token, process.env.SECRETA);
            req.usuario = usuario;
        } catch (error) {
            console.log(error);
            console.log('JWT no válido');
        };
    };
    return next();
};