// Importar Librerías
const mongoose = require('mongoose');

// Definir Esquemas
const Schema = mongoose.Schema;

// Usuarios
const usuariosSchema = new Schema({
    nombre: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
        trim: true
    }
});

module.exports = mongoose.model('Usuario', usuariosSchema);