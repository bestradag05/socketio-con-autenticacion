const { Router } = require('express');
const { check } = require('express-validator');
const { login, googleSingind, renovarToken } = require('../controllers/auth');
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');



const router = Router();

router.post('/login', [
    check('correo', 'El correo es obligatorio').isEmail(),
    check('password', 'La contraseña es obligatoria').not().isEmpty(),
    validarCampos
], login)


router.post('/google',
    [
        check('id_token', 'El id token es necesario').not().isEmpty(),
        validarCampos
    ],
    googleSingind
);


router.get('/', validarJWT, renovarToken);
module.exports = router;