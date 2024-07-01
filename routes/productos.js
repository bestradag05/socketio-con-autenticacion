const { Router } = require("express");
const { obtenerProductos, obtenerProducto, crearProducto, actualizarProducto, borrarProducto } = require("../controllers/productos");
const { check } = require("express-validator");
const { existeProductoPorId, existeCategoriaPorId } = require("../helpers/db-validators");
const { validarCampos, validarJWT, esAdminRole } = require("../middlewares");

const router = Router();

// Obtener todos los productos

router.get('/', obtenerProductos);

// obtener producto por ID - publico
router.get('/:id',
    [
        check('id', 'No es ID valido').isMongoId(),
        check('id').custom(existeProductoPorId),
        validarCampos
    ], obtenerProducto);

//Crear un nuevo producto - privado - cualquier persona con un token valido
router.post('/',
    [
        validarJWT,
        check('nombre', 'El nombre es obligatorio').not().isEmpty(),
        check('categoria', 'La categoria es obligatorio').not().isEmpty(),
        check('categoria', 'No es un id de Mongo').isMongoId(),
        check('categoria').custom(existeCategoriaPorId),
        check('precio', 'El precio debe ser un numero').isNumeric().optional(),
        
        check('descripcion', 'La descripcion es obligatorio').not().isEmpty(),
        validarCampos
    ],crearProducto);

// Actualziar un registro de una producto por id - cualquier persona con token
router.put('/:id',
    [
        validarJWT,
        check('id', 'No es un ID valido').isMongoId(),
        check('id').custom(existeProductoPorId),
        check('nombre', 'El nombre es obligatorio').not().isEmpty(),
        check('categoria', 'La categoria es obligatorio').not().isEmpty(),
        check('categoria', 'No es un id de Mongo').isMongoId(),
        check('categoria').custom(existeCategoriaPorId),
        check('precio', 'El precio debe ser un numero').isNumeric(),
        check('descripcion', 'La descripcion es obligatorio').not().isEmpty(),
        validarCampos
    ],
    actualizarProducto);

// Borrar un producto - Rol : Admin

router.delete('/:id',
    [
        validarJWT,
        esAdminRole,
        check('id', 'No es un ID valido').isMongoId(),
        check('id').custom(existeProductoPorId),
        validarCampos
    ], borrarProducto);




module.exports = router;