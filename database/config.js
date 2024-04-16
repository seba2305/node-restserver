const mongoose = require('mongoose');

const dbConnection = async() => {

    try {
        await mongoose.connect(process.env.MONGODB_CNN);
        console.log('Conectado correctamente a la BD');
    } catch (error) {
        console.log(error);
        throw new Error('Error al inicializar la BD ');
    }

}

module.exports = {
    dbConnection
}