
const { Category, Role, User, Product } = require('../models');

const isValidRole = async (role = '') => {
    const existRole = await Role.findOne({ role })
    if( !existRole ){
        throw new Error(`El rol ${role} no existe.`)
    }
}

const userExistById = async (id = '') => {
    const existUser = await User.findById( id )
    if( !existUser ){
        throw new Error(`El usuario con ID ${id} no existe.`)
    }
}

const categoryExistById = async (id = '') => {
    const existCategory = await Category.findById( id )
    if( !existCategory ){
        throw new Error(`La categoria con ID ${id} no existe.`)
    }
}

const categoryExistByName = async (name = '') => {
    const existCategory = await Category.findOne( {name} )
    if( !existCategory ){
        throw new Error(`La categoria ${name} no existe.`)
    }
}

const productExistById = async (id = '') => {
    const existProduct = await Product.findById( id )
    if( !existProduct ){
        throw new Error(`El producto con ID ${id} no existe.`)
    }
}

module.exports = {
    isValidRole,
    userExistById,
    categoryExistById,
    categoryExistByName,
    productExistById
}