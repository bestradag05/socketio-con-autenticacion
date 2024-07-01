const { response } = require('express');
const bcrypt = require('bcrypt');
const Usuario = require('../models/usuario');

const usuariosGet = async(req, res = response) => {

    const { limite = 5, desde = 0 } = req.query;
 
    const [total, usuarios] = await Promise.all([
        Usuario.countDocuments({ estado: true }),
        Usuario.find({estado : true})
                        .skip(desde)
                        .limit(limite)
    ])

    res.json({
        total, 
        usuarios
    });
}


const usuariosPost = async (req, res) => {
    const {nombre, correo, password, rol} = req.body;
    const usuario = new Usuario({nombre, correo, password, rol});

    //Encriptar la contraseña

    const salt = bcrypt.genSaltSync();
    usuario.password = bcrypt.hashSync(password, salt);
    
    //Guardar en BD
    await usuario.save();

    res.json({
        usuario
    });
}


const usuariosPut = async (req, res) => {

    const { id } = req.params;
    const { _id, password, google, ...resto } = req.body;

    // Validar contra base de datos

    if(password) {
        const salt = bcrypt.genSaltSync();
        resto.password = bcrypt.hashSync(password, salt);
    }

    const usuario = await Usuario.findByIdAndUpdate(id, resto);



    res.json(usuario);
}

const usuariosPatch = (req, res) => {
    res.json({
        ok: true,
        msg: 'patch API - Controlador'
    });
}

const usuariosDelete = async (req, res) => {

    const { id } = req.params;

    //Borrar fisicamente
   /*  const usuario = await Usuario.findByIdAndDelete(id); */
    
    const usuario = await Usuario.findByIdAndUpdate(id, { estado: false });

    const usuarioAutenticado = req.usuario;


    res.json({usuario});
}


module.exports = {
    usuariosGet,
    usuariosPost,
    usuariosPut,
    usuariosPatch,
    usuariosDelete

}