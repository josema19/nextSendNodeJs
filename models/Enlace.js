// Importar Librerías
const mongoose = require('mongoose');

// Definir Esquemas
const Schema = mongoose.Schema;

// Usuarios
const enlacesSchema = new Schema({
    url: {
        type: String,
        required: true
    },
    nombre: {
        type: String,
        required: true,
    },
    nombre_original: {
        type: String,
        required: true,
    },
    descargas: {
        type: Number,
        default: 1
    },
    autor: {
        type: mongoose.Types.ObjectId,
        ref: 'Usuarios',
        default: null
    },
    password: {
        type: String,
        default: null
    },
    creado: {
        type: Date,
        default: Date.now()
    }
});

module.exports = mongoose.model('Enlace', enlacesSchema);