// Importar Librerías
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const archivosController = require('../controllers/archivosController');

// Definir Rutas
router.post('/',
    auth,
    archivosController.subirArchivo
);

router.get('/:archivo',
    archivosController.descargarArchivo,
    archivosController.eliminarArchivo
);

module.exports = router;