const { response } = require("express")
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const Usuario = require('../models/usuario');
const { generarJWT } = require("../helpers/generar-jwt");

const login = async (req, res = response) => {

    const { correo, password } = req.body;

    try {

        // Varificar si el email existe
        const usuario = await Usuario.findOne({ correo });

        if (!usuario) {
             return res.status(404).json({
                msg: ' El correo no existe en los registros'
            })

           
        }
        // si el usuario esta activo

        if(!usuario.estado) {
             return res.status(404).json({
                msg: ' El usuario fue eliminado'
            })
        }

        // Verificar la contraseña
        const match =  bcrypt.compareSync(password, usuario.password);

        if (!match) {
             return res.status(404).json({
                msg: 'Contraseña incorrecta'
            })
        }
        //Generar JWT
        const token = await generarJWT(usuario.id);


        res.json({
            usuario,
            token
        })



    } catch (error) {
        return res.status(500).json({
            msg: 'Algo salio mal, hable con el administrador'
        })
    }




}


const googleSingind = async (req, res) => {
    const idToken = req.body.id_token;

    try {
        // Decodificar el token para obtener información del usuario
        const decodedToken = jwt.decode(idToken);
       
        
        const { email, name, picture } = decodedToken;

        let usuario = await Usuario.findOne({ correo: email });

        
        if(!usuario) {
            const data = {
                nombre: name,
                correo: email,
                password: ':p',
                img: picture,
                google: true

            }

            usuario = new Usuario(data);
            await usuario.save();
        }

        // Si el usuario en DB
        if (!usuario.estado) {
            return res.status(401).json({
                msg: 'Hable con el administrador, usuario bloqueado'
            })
        }

        //Generar JWT
        const token = await generarJWT(usuario.id);

        res.json({
            usuario,
            token
        })
        
    } catch (error) {
        console.error('Error al decodificar el token:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
}



const renovarToken = async (req, res) => {

    const { usuario } = req;

    const token = await generarJWT(usuario.id);

    res.json({
        usuario,
        token
    })

}

module.exports = {
    login,
    googleSingind,
    renovarToken
}