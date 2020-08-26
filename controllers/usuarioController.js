// Importar Librerías
const bcrypt = require('bcrypt');
const { validationResult } = require('express-validator');
const Usuario = require('../models/Usuario');

// Definir Funciones
exports.nuevoUsuario = async (req, res) => {
    // Mostrar mensajes de error de express validator
    const errores = validationResult(req);
    if (!errores.isEmpty()) {
        return res.status(400).json({ errores: errores.array() });
    };

    // Verificar si el usuario ya está registrado
    const { email, password } = req.body;
    let usuario = await Usuario.findOne({ email });
    if (usuario) {
        return res.status(400).json({ msg: 'El usuario ya se encuentra registrado' });
    };

    // Definir usuario a través del modelo
    usuario = new Usuario(req.body);

    // Colocar hash al password
    const salt = await bcrypt.genSalt(10);
    usuario.password = await bcrypt.hash(password, salt);

    // Guardar en la BD y devolver respuesta
    try {
        await usuario.save();
        return res.status(200).json({ msg: 'Usuario Creado Correctamente' });
    } catch (error) {
        console.log(error);
    };
};