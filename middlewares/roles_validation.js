

const isAdminRole = (req, res, next) =>{

    if( !req.user_auth ){
        return res.status(500).json({
            msg: 'Verificación rol sin token'
        });
    }

    const { role, name} = req.user_auth;

    if( role !== 'ADMIN_ROLE' ){
        return res.status(401).json({
            msg: `${name} no cuenta con permisos para ejecutar la acción.`
        });
    }

    next();
}

const hasRole = ( ...roles ) =>{

    return (req, res, next) => {

        if( !req.user_auth ){
            return res.status(500).json({
                msg: 'Verificación rol sin token'
            });
        }

        if( !roles.includes( req.user_auth.role )){
            return res.status(401).json({
                msg: `El servicio requiere de los siguientes roles: ${roles}.`
            });
        }

        next();
    }
}


module.exports = {
    isAdminRole,
    hasRole
}