// Importar Librerías
const bcrypt = require('bcrypt');
const shorid = require('shortid');
const { validationResult } = require('express-validator');
const Enlace = require('../models/Enlace');

// Definir Funciones
exports.nuevoEnlace = async (req, res, next) => {
    // Revisar errores con express validator
    const errores = validationResult(req);
    if (!errores.isEmpty()) {
        return res.status(400).json({ errores: errores.array() });
    };

    // Definir enlace a través del modelo
    const enlace = new Enlace();

    // Llenar campos correspondientes según sea el caso y si el usuario está autenticado
    const { nombre_original, nombre } = req.body;
    enlace.url = shorid.generate();
    enlace.nombre = nombre;
    enlace.nombre_original = nombre_original;

    if (req.usuario) {
        const { password, descargas } = req.body;
        if (password) {
            const salt = await bcrypt.genSalt(10);
            enlace.password = await bcrypt.hash(password, salt);
        };
        if (descargas) enlace.descargas = descargas;
        enlace.autor = req.usuario.id;
    };

    // Guardar en la BD y devolver respuesta
    try {
        await enlace.save();
        res.status(200).json({ msg: `${enlace.url}` });
        return next();
    } catch (error) {
        console.log(error);
    };
};

exports.verificarPassword = async (req, res, next) => {
    // Extraer url y password enviados
    const { url } = req.params;
    const { password } = req.body;

    // Hacer búsqueda en la BD
    const enlace = await Enlace.findOne({ url });

    // Verificar Password
    if (bcrypt.compareSync(password, enlace.password)) {
        next();
    } else {
        return res.status(400).json({ msg: 'Password Incorrecto' });
    };
};

exports.obtenerEnlaces = async (req, res) => {
    // Intentar obtener todos los enlaces
    try {
        const enlaces = await Enlace.find({}).select('url -_id');
        res.status(200).json({ enlaces });
    } catch (error) {
        console.log(error);
    };
};

exports.tienePassword = async (req, res, next) => {
    // Verificar que el enlace exista
    const { url } = req.params;
    const enlace = await Enlace.findOne({ url });
    if (!enlace) {
        res.status(404).json({ msg: 'El enlace no existe' });
        return next();
    };

    if (enlace.password) {
        return res.status(200).json({ password: true, enlace: enlace.url });
    };
    next();
};

exports.obtenerEnlace = async (req, res, next) => {
    // Verificar que el enlace exista
    const { url } = req.params;
    const enlace = await Enlace.findOne({ url });
    if (!enlace) {
        res.status(404).json({ msg: 'El enlace no existe' });
        return next();
    };

    // Devolver el enlace con el nombre del archivo
    res.status(200).json({ archivo: enlace.nombre, password: false });

    next();
};