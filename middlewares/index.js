const validaCampos = require('../middlewares/validar-campos');
const validaJWT = require('../middlewares/validar-jwt');
const validaRoles = require('../middlewares/validar-roles.js');
const validarArchivoSubir = require('../middlewares/validar-archivo.js')



module.exports = {
    ...validaCampos,
    ...validaJWT,
    ...validaRoles,
    ...validarArchivoSubir
}