// Importar Librerías
const shortid = require('shortid');
const multer = require('multer');
const fs = require('fs');
const Enlace = require('../models/Enlace.js');

// Definir Funciones
exports.subirArchivo = async (req, res, next) => {
    // Configurar parámetros del archivo
    const configuracionMulter = {
        limits: { fileSize: req.usuario ? (1024 * 1024 * 10) : (1024 * 1024) },
        storage: fileStorage = multer.diskStorage({
            destination: (req, file, cb) => {
                cb(null, __dirname + '/../uploads');
            },
            filename: (req, file, cb) => {
                const extension = file.originalname.substring(file.originalname.lastIndexOf('.'), file.originalname.length);
                cb(null, `${shortid.generate()}${extension}`);
            }
        })
    };

    // Definir multer
    const upload = multer(configuracionMulter).single('archivo');

    // Subir el archivo y mostrar los errores si es el caso
    upload(req, res, async (error) => {
        if (!error) {
            res.status(200).json({ archivo: req.file.filename });
        } else {
            console.log(error);
            return next();
        };
    });
};

exports.eliminarArchivo = async (req, res, next) => {
    // Eliminar archivo del sistema
    try {
        fs.unlinkSync(__dirname + `/../uploads/${req.archivo}`);
        console.log('Archivo Eliminado');
        return next();
    } catch (error) {
        console.log(error);
    };
};

exports.descargarArchivo = async (req, res, next) => {
    // Aplicar Destructuración
    const { archivo } = req.params

    // Obtener ruta exacta del archivo
    const descarga = __dirname + '/../uploads/' + req.params.archivo;

    // Devolver ruta de descarga
    res.status(200).download(descarga);

    // Actualizar las descargadas y verificar si toca o no eliminar el archivo
    const enlace = await Enlace.findOne({ nombre: archivo });
    const { descargas, nombre, url } = enlace;
    if (descargas === 1) {
        // Eliminar Archivo
        req.archivo = nombre;

        // Eliminar de la BD
        await Enlace.findOneAndRemove(url);

        // Ejecutar siguiente controlador
        next();
    } else {
        enlace.descarga--;
        await enlace.save();
    };
};