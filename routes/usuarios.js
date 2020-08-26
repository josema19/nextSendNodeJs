// Importar Librerías
const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const usuarioController = require('../controllers/usuarioController');

// Definir Rutas
router.post('/',
    [
        check('nombre', 'El nombre es obligatorio').not().isEmpty(),
        check('email', 'El email no es válido').isEmail(),
        check('password', 'El password debe ser de al menos 6 caracteres').isLength({ min: 6 }),
    ],
    usuarioController.nuevoUsuario
);

module.exports = router;