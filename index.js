// Importar Librerías
const express = require('express');
const conectarDB = require('./config/db');
const cors = require('cors');
require('dotenv').config({ path: 'variables.env' });

// Definir Servidor y Puerto
const app = express();
const port = process.env.PORT || 4000;

// Conectar a la BD
conectarDB();

// Habilitar Cors
const opcionesCors = {
    origin: process.env.FRONTEND_URL
}
app.use(cors(opcionesCors));

// Habilitar lectura de valores
app.use(express.json());

// Hablitar carpeta pública
app.use(express.static('uploads'));

// Definir Rutas
app.use('/api/usuarios', require('./routes/usuarios'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/enlaces', require('./routes/enlaces'));
app.use('/api/archivos', require('./routes/archivos'));

// Arrancar Servidor
app.listen(port, 'localhost', () => {
    console.log(`El servidor está funcionando en el puerto ${port}`);
})