const { response, request } = require('express');
const jwt = require('jsonwebtoken');

const Usuario = require('../models/usuario');

const validarJWT = async (req = request, res = response, next) => {

    const token = req.header('x-token');
    if (!token) {
        return res.status(401).json({
            msg: 'No hay token en la petición'
        });
    }
    try {

        const { uuid } = jwt.verify(token, process.env.SECRETORPRIVATEKEY);

        const usuario = await Usuario.findById(uuid);

        if (!usuario) {
            return res.status(401).json({
                msg: 'Token no válido - El usuario no existe'
            });
        }

        //verificar que el usuario este activo
        if (!usuario.estado) {
            return res.status(401).json({
                msg: 'Token no válido'
            });
        }

        req.usuario = usuario;
        next();
    } catch (err) {
        console.log(err);
        res.status(401).json({
            msg: 'Token no valido'
        });
    }


}

module.exports = {
    validarJWT
}