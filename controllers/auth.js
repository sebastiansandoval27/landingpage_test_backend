const { response } = require('express');
const bcrypt = require('bcryptjs');
const Usuario = require('../models/Usuario');
const { generarJWT } = require('../helpers/jwt');
 

const obtenerUsuarios = async(req, res = response ) => {

    try {
        
        let usuarios = await Usuario.find();

        if ( !usuarios ) {
            return res.status(400).json({
                ok: false,
                msg: 'No existen usuarios'
            });
        }

        res.json({
            ok: true,
            users: usuarios,
        })


    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Por favor hable con el administrador'
        });
    }

}

const crearUsuario = async(req, res = response ) => {

    const { email, password } = req.body;

    try {
        let usuario = await Usuario.findOne({ email });

        if ( usuario ) {
            return res.status(400).json({
                ok: false,
                msg: 'El usuario ya existe'
            });
        }

        usuario = new Usuario( req.body );
    
        // Encriptar contraseña
        const salt = bcrypt.genSaltSync();
        usuario.password = bcrypt.hashSync( password, salt );


        await usuario.save();

        // Generar JWT
        const token = await generarJWT( usuario.id, usuario.name );
    
        res.status(201).json({
            ok: true,
            uid: usuario.id,
            name: usuario.name,
            token
        })
        
    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Por favor hable con el administrador'
        });
    }
}


const loginUsuario = async(req, res = response ) => {

    const { email, password } = req.body;

    try {
        
        const usuario = await Usuario.findOne({ email });

        if ( !usuario ) {
            return res.status(400).json({
                ok: false,
                msg: 'El usuario no existe con ese email'
            });
        }

        // Confirmar los passwords
        const validPassword = bcrypt.compareSync( password, usuario.password );

        if ( !validPassword ) {
            return res.status(400).json({
                ok: false,
                msg: 'Password incorrecto'
            });
        }

        // Generar JWT
        const token = await generarJWT( usuario.id, usuario.name );

        res.json({
            ok: true,
            uid: usuario.id,
            name: usuario.name,
            token
        })


    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Por favor hable con el administrador'
        });
    }

}


const revalidarToken = async (req, res = response ) => {

    const { uid, name } = req;

    // Generar JWT
    const token = await generarJWT( uid, name );

    res.json({
        ok: true,
        token,
        uid,
        name
    })
}

const editarUsuario = async(req, res = response ) => {

    const { uid } = req.body;

    let { name,email,password } = req.body;

    // Encriptar contraseña
    const salt = bcrypt.genSaltSync();
    password = bcrypt.hashSync( password, salt );

    let body = {
        name,email,password
    }


    try {
        let response = await Usuario.findOneAndUpdate(uid, body,{ useFindAndModify: false });

        if ( !response ) {
            return res.status(400).json({
                ok: false,
                msg: 'El usuario no existe'
            });
        }
    
        res.status(201).json({
            ok: true,
            msg:"Updated"
        })
        
    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Por favor hable con el administrador'
        });
    }
}

const eliminarUsuario = async(req, res = response ) => {

    const { uid } = req.body;


    try {
        let response = await Usuario.findOneAndRemove(uid,{ useFindAndModify: false });

        if ( !response ) {
            return res.status(400).json({
                ok: false,
                msg: 'El usuario no existe'
            });
        }
    
        res.status(201).json({
            ok: true,
            msg:"Eliminado"
        })
        
    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Por favor hable con el administrador'
        });
    }
}



module.exports = {
    crearUsuario,
    loginUsuario,
    revalidarToken,
    editarUsuario,
    eliminarUsuario,
    obtenerUsuarios
}