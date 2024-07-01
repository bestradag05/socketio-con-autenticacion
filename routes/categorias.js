const { Router } = require('express');
const { check } = require('express-validator');
const { validarCampos, validarJWT, esAdminRole} = require('../middlewares');
const { crearCategoria, obtenerCategorias, obtenerCategoria, actualizarCategoria, borrarCategoria } = require('../controllers/categorias');
const { existeCategoriaPorId } = require('../helpers/db-validators');


const router = Router();


// Obtener todas las categorias - Publico
router.get('/', obtenerCategorias)


//Obtener una categoria por Id - publico
router.get('/:id',
    [
        check('id', 'No es un ID valido').isMongoId(),
        check('id').custom(existeCategoriaPorId),
        validarCampos
    ],
    obtenerCategoria)

//Crear una nueva categoria - privado - cualquier persona con un token valido

router.post('/',
    [
        validarJWT,
        check('nombre', 'El nombre es obligatorio').not().isEmpty(),
        validarCampos
    ], crearCategoria)

//Actualizar un registro por un Id - cualquiera con token valido

router.put('/:id',
    [
        validarJWT,
        check('nombre', 'El nombre es obligatorio').not().isEmpty(),
        check('id', 'No es un ID valido').isMongoId(),
        check('id').custom(existeCategoriaPorId),
        validarCampos
    ],
    actualizarCategoria)


// Borrar una categoria - Admin
router.delete('/:id', 
    [
        validarJWT,
        esAdminRole,
        check('id', 'No es un ID valido').isMongoId(),
        check('id').custom(existeCategoriaPorId),
        validarCampos
    ],
    borrarCategoria

)

module.exports = router;