
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const jwtValidation = async (req, res, next) => {

    const token = req.header('Authorization');

    if( !token ){
        return res.status(401).json({
            msg: 'Token no válido'
        });
    }

    try {

        const { uid } = jwt.verify(token, process.env.SECRETJWTKEY);

        const user_auth = await User.findById(uid);
        
        if(!user_auth){
            return res.status(401).json({
                msg: 'Token no válido - usuario no existe en BD'
            })
        }
        //Verificar si usuario esta activo
        if( !user_auth.status ){
            return res.status(401).json({
                msg: 'Token no válido - usuario inactivo'
            })
        }

        req.user_auth = user_auth;

        next();
    } catch (error) {
        console.log('Error Middleware jwtValidation ', error);
        res.status(401).json({
            msg: 'Token no válido'
        });
    }

}

module.exports = {
    jwtValidation
}
