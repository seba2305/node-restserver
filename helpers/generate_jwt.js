const jwt = require("jsonwebtoken")


const generateJWT = ( uid = '' ) => {

    return new Promise((resolve, reject) =>{

        const payload = { uid };

        jwt.sign(payload, process.env.SECRETJWTKEY, {
            expiresIn: '4h'
        }, (err, token) =>{
            
            if(err){
                console.log('Error Helpers GenerateJWT ',err);
                reject('No se pudo generar el Token');
            }else{
                resolve(token);
            }
        })

    });

}

module.exports = {
    generateJWT
}
