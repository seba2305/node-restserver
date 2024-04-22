
const bcryptjs = require('bcryptjs');
const User = require('../models/user');

const { generateJWT } = require('../helpers/generate_jwt');

const login = async (req, res) => {
    
    const {email, password} = req.body;

    try {

        //Verificar si email existe
        const user = await User.findOne({ email });
        if( !user ){
            return res.status(400).json({
                msg: 'el correo no existe'
            })
        }

        //Verificar si usuario esta activo
        if( !user.status ){
            return res.status(400).json({
                msg: 'el usuario inactivo'
            })
        }

        //Verificar la password
        const validPassword = bcryptjs.compareSync( password, user.password);
        if( !validPassword ){
            return res.status(400).json({
                msg: 'el password incorrecto'
            })
        }

        //Generar JWT
        const token = await generateJWT( user.id );

        
        res.json({
            user,
            token
        });
    } catch (error) {
        console.log("Error Controller auth ",error);
        res.status(500).json({
            msg: 'Ups! Algo salio mal.'
        })
    }

};


module.exports = {
    login
}