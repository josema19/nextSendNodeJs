// Importar Librerías
const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const auth = require('../middleware/auth');
const enlacesController = require('../controllers/enlacesController');
const archivosController = require('../controllers/archivosController');

// Definir Rutas
router.post('/',
    [
        check('nombre', 'Sube un archivo').not().isEmpty(),
        check('nombre_original', 'Sube un archivo').not().isEmpty(),
    ],
    auth,
    enlacesController.nuevoEnlace
);

router.post('/:url',
    enlacesController.verificarPassword,
    enlacesController.obtenerEnlace
);

router.get('/',
    enlacesController.obtenerEnlaces
);

router.get('/:url',
    enlacesController.tienePassword,
    enlacesController.obtenerEnlace
);

module.exports = router;