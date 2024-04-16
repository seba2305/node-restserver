
const Role = require('../models/role');
const User = require('../models/user');

const isValidRole = async (role = '') => {
    const existRole = await Role.findOne({ role })
    if( !existRole ){
        throw new Error(`El rol ${role} no está registrado`)
    }
}

const userExistById = async (id = '') => {
    const existUser = await User.findById( id )
    if( !existUser ){
        throw new Error(`El usuario con ID ${id} no está registrado`)
    }
}

module.exports = {
    isValidRole,
    userExistById
}