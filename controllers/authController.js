// Importar Librerías
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const Usuario = require('../models/Usuario');
require('dotenv').config({ path: 'variables.env' });

// Definir Funciones
exports.autenticarUsuario = async (req, res, next) => {
    // Revisar errores con express validator
    const errores = validationResult(req);
    if (!errores.isEmpty()) {
        return res.status(400).json({ errores: errores.array() });
    };

    // Verificar si el usuario no está registrado
    const { email, password } = req.body;
    const usuario = await Usuario.findOne({ email })
    if (!usuario) {
        return res.status(401).json({ msg: 'El usuario no existe' });
    };

    // Verificar el password
    if (!bcrypt.compareSync(password, usuario.password)) {
        return res.status(401).json({ msg: 'El password es incorrecto' });
    };

    // Generar Json Web Token y enviar como respuesta
    const token = jwt.sign(
        {
            id: usuario._id,
            nombre: usuario.nombre
        },
        process.env.SECRETA,
        { expiresIn: '8h' }
    );
    res.status(200).json({ token });
    return next();
};

exports.usuarioAutenticado = async (req, res, next) => {
    // Devolver usuario y continuar ejecución
    res.status(200).json({ usuario: req.usuario });
    return next();
};