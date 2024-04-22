
const bcryptjs = require('bcryptjs');
const User = require('../models/user');

const { generateJWT } = require('../helpers/generate_jwt');
const { googleVerify } = require('../helpers/google_verify');

const login = async (req, res) => {
    
    const {email, password} = req.body;

    try {

        //Verificar si email existe
        const user = await User.findOne({ email });
        if( !user ){
            return res.status(400).json({
                msg: 'El correo ingresado no existe.'
            })
        }

        //Verificar si usuario esta activo
        if( !user.status ){
            return res.status(401).json({
                msg: 'Usuario bloqueado, hablar con Administrador.'
            })
        }

        //Verificar la password
        const validPassword = bcryptjs.compareSync( password, user.password);
        if( !validPassword ){
            return res.status(400).json({
                msg: 'El password es incorrecto.'
            })
        }

        //Generar JWT
        const token = await generateJWT( user.id );

        
        res.json({
            user,
            token
        });
    } catch (error) {
        console.log("Error Controller auth login: ",error);
        res.status(500).json({
            msg: 'Ups! Algo salio mal.'
        })
    }

};

const googleSignIn = async (req, res) => {
    
    const {id_token} = req.body;

    try {
        
        const {name, img, email} = await googleVerify(id_token);
        let user = await User.findOne({ email });

        if ( !user ) {
            const data = {
                name,
                email,
                password: ':P',
                img,
                google: true
            };

            user = new User( data );
            await user.save();
        }

        if( !user.status ){
            return res.status(401).json({
                msg: 'Usuario bloqueado, hablar con Administrador.'
            })
        }

        //Generar JWT
        const token = await generateJWT( user.id );

        res.json({
            user,
            token
        });
    } catch (error) {
        console.log("Error Controller auth googleSignIn: ",error);
        json.status(400).json({
            msg: 'El token no se pudo verificar.'
        });
    }

};


module.exports = {
    login,
    googleSignIn
}