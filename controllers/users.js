
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

const getUser = async (req, res) => {
    
    const { id } = req.params;
    const user = await User.findById(id);

    res.json({
        user
    });
};

const updateUser = async (req, res) => {
    
    const { id } = req.params;
    const { password, google, email, ...body } = req.body;

    if(password){
        //Encriptar password
        const salt = bcryptjs.genSaltSync();
        body.password = bcryptjs.hashSync(password, salt);
    }

    const userUpdated = await User.findByIdAndUpdate( id, body, { new: true } );
    res.json( userUpdated );
};

const createUser = async (req, res) => {

    try {
        const { name, email, password, role } = req.body;
        const user = new User({ name, email, password, role });
    
        //Encriptar password
        const salt = bcryptjs.genSaltSync();
        user.password = bcryptjs.hashSync(password, salt);
    
        //Guardar en BD
        await user.save();
    
        res.status(201).json({
            msg: 'Usuario creado exitosamente',
            user
        });        
    } catch (error) {
        console.log("Error createUser: ", error);
        res.status(500).json({msg:`Ups!, hubo un error al tratar de crear al usuario.`});
    }

};

const deleteUser = async (req, res) => {

    const { id } = req.params;
    const user = await User.findByIdAndUpdate( id, { status: false } );

    res.json({
        msg:`El usuario con ID ${id} ha sido eliminado.`
    });
};

module.exports = {
    getUsers,
    getUser,
    updateUser,
    createUser,
    deleteUser
}