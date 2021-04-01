/*
    basic path url: /api/auth/
 */
const { Router } = require('express');
const { check } = require('express-validator');
const { validarCampos } = require('../middlewares/validar-campos');
const { crearUsuario, loginUsuario, revalidarToken, editarUsuario, eliminarUsuario, obtenerUsuarios } = require('../controllers/auth');
const { validarJWT } = require('../middlewares/validar-JWT');


const router = Router();

router.get( '/users', obtenerUsuarios);

// Registrar usuario
router.post(
    '/new', 
    [ // middlewares
        check('name', 'El nombre es obligatorio').not().isEmpty(),
        check('email', 'El email es obligatorio').isEmail(),
        check('password', 'El password debe de ser de 6 caracteres').isLength({ min: 6 }),
        validarCampos
    ],
    crearUsuario 
);

// Iniciar sesión
router.post(
    '/login',
    [
        check('email', 'El email es obligatorio').isEmail(),
        check('password', 'El password debe de ser de 6 caracteres').isLength({ min: 6 }),
        validarCampos
    ],
    loginUsuario 
);

// Actualizar datos del usuario
router.post(
    '/update',
    [
        check('uid', 'El id es obligatorio').not().isEmpty(),
        check('name', 'El nombre es obligatorio').not().isEmpty(),
        check('email', 'El email es obligatorio').isEmail(),
        check('password', 'El password debe de ser de 6 caracteres').isLength({ min: 6 }),
        validarCampos
    ],
    editarUsuario
);

// Eliminar Usuario
router.delete(
    '/delete',
    [
        check('uid', 'El id es obligatorio').not().isEmpty(),
        validarCampos
    ],
    eliminarUsuario
);

// Renovar Token
router.get('/renew', validarJWT ,revalidarToken );



module.exports = router;