const { modelNames } = require('mongoose');
const Role = require('../models/role');
const usuario = require('../models/usuario');
const categoria = require('../models/categoria');
const producto = require('../models/producto');


const esRoleValido = async (rol = '') => {
        const existeRol = await Role.findOne({ rol });
        if (!existeRol) {
            throw new Error(`El rol ${ rol } no esta registrado en la base de datos`)
        }
}
    

const emailExiste = async (correo = '') => {

        //Varificar si el correo existe

    const existeEmail = await usuario.findOne({ correo });

    if (existeEmail) {
        throw new Error(`El correo ${correo} ya existe en la base de datos`);
    }

}

const existeUsuarioPorId = async (id) => {
    const existeUsuario = await usuario.findById(id);

    if (!existeUsuario) {
        throw new Error(`El id no existe ${id}`);
    }
} 


const existeCategoriaPorId = async (id) => {
    const existeCategoria = await categoria.findById(id);

    if (!existeCategoria) {
        throw new Error(`El id no existe ${id}`);
    }
} 

const existeProductoPorId = async (id) => {
    const existeProducto = await producto.findById(id);

    if (!existeProducto) {
        throw new Error(`El id no existe ${id}`);
    }
} 

/* Valida Colecciones permitidas */

const coleccionesPermitidas = async(coleccion = '', colecciones = []) => {

    const incluida = colecciones.includes(coleccion);

    if (!incluida) {
        throw new Error(`La coleccion ${coleccion} no es permitida,  ${ colecciones }`)
    }

    return true;
}

module.exports = {
    esRoleValido,
    emailExiste,
    existeUsuarioPorId,
    existeCategoriaPorId,
    existeProductoPorId,
    coleccionesPermitidas
}