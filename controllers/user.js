
const bcryptjs = require('bcryptjs');
const User = require('../models/user');


const getUsers = async (req, res) => {
    
    const { limit = 5, from = 0 } = req.query;
    const query = { status: true };

    const [ total, users ] = await Promise.all([
        User.countDocuments(query),
        User.find(query)
            .limit(limit)
            .skip(from)
    ]);

    res.json({
        total,
        users
    });
};

const putUsers = async (req, res) => {
    
    const { id } = req.params;
    const { password, google, email, ...body } = req.body;

    //ToDo: Validar contra BD
    if(password){
        //Encriptar password
        const salt = bcryptjs.genSaltSync();
        body.password = bcryptjs.hashSync(password, salt);
    }

    const userUpdated = await User.findByIdAndUpdate( id, body, { new: true } );
    res.json( userUpdated );
};

const postUsers = async (req, res) => {

    try {
        const { name, email, password, role } = req.body;
        const user = new User({ name, email, password, role });
    
        //Encriptar password
        const salt = bcryptjs.genSaltSync();
        user.password = bcryptjs.hashSync(password, salt);
    
        //Guardar en BD
        await user.save();
    
        res.json({
            msg: 'postUsers API',
            user
        });        
    } catch (error) {
        //Valido error key duplicate del email
        //TODO: se puede mejorar
        if(error.code == 11000){
            res.status(400).json({msg:`El correo ${req.body.email} ya esta registrado.`})
        }
            // const uniqueEmailError = isUniqueEmailError(error);
            // if (uniqueEmailError) {
            // return res.status(BAD_REQUEST_CODE).json(uniqueEmailError);
            // }
            // return res.status(SERVER_ERROR_CODE).json({ error });
    }

};

const patchUsers = (req, res) => {
    
    res.json({
        msg: 'patchUsers API'
    });
};

const deleteUsers = async (req, res) => {

    const { id } = req.params;

    //Delete fisico
    // const user = await User.findByIdAndDelete(id);
    const user = await User.findByIdAndUpdate( id, { status: false } );

    res.json({
        msg:`El usuario con ID ${id} ha sido eliminado.`
    });
};

module.exports = {
    getUsers,
    putUsers,
    postUsers,
    patchUsers,
    deleteUsers
}