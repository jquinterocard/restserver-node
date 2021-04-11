const { request, response } = require('express');
const bcryptjs = require('bcryptjs');

const Usuario = require('../models/usuario');
const { generarJWT } = require('../helpers/generarJWT');


const login = async (req = request, res = response) => {

    const { correo, password } = req.body;

    try {

        //Verificar si el email existe
        const usuario = await Usuario.findOne({ correo });
        if (!usuario) {
            return res.status(400).json({
                msg: 'Usuario / Password no correctos'
            });
        }
        //Si el usuario esta activo
        if (!usuario.estado) {
            return res.status(400).json({
                msg: 'Usuario / Password no correctos'
            });
        }

        //Verifica la contraseña
        const validPassword = bcryptjs.compareSync(password, usuario.password);
        if (!validPassword) {
            return res.status(400).json({
                msg: 'Usuario / Password no correctos'
            });
        }

        //Generar jwt
        const token = await generarJWT(usuario.id);

        res.json({
            usuario,
            token
        });
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            msg: 'Habla con el administrador'
        });
    }


}

module.exports = {
    login
}