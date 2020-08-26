// Importar Librerías
const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const auth = require('../middleware/auth');
const authController = require('../controllers/authController');

// Definir Rutas
router.post('/',
    [
        check('email', 'El email no es válido').isEmail(),
        check('password', 'El password no puede ser vacío').not().isEmpty(),
    ],
    authController.autenticarUsuario
);

router.get('/',
    auth,
    authController.usuarioAutenticado
);

module.exports = router;