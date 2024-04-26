
const { isValidObjectId } = require('mongoose');
const { Router } = require('express');
const { check, query } = require('express-validator');

const { jwtValidation, fieldsValidation, isAdminRole } = require('../middlewares');
const { categoryExistById, productExistById } = require('../helpers');

const { createProduct, getProducts, getProduct, updateProduct, deleteProduct } = require('../controllers/products');

const router = Router();

router.get('/',[
    query('limit',"El valor de 'limit' debe ser númerico")
    .isNumeric()
    .optional(),
    query('from',"El valor de 'from' debe ser númerico")
    .isNumeric()
    .optional(),
], getProducts)

router.get('/:id',[
    check('id', 'No es un ID válido').isMongoId().if(isValidObjectId).custom( productExistById ),
    fieldsValidation
], getProduct)

router.post('/',[ 
    jwtValidation,
    check('name', 'El nombre es obligatorio').notEmpty(),
    check('price', 'El precio debe ser númerico').isNumeric(),
    check('category', 'No es un ID de categoria válido').isMongoId().if(isValidObjectId).custom( categoryExistById ),
    fieldsValidation
], createProduct)

router.put('/:id',[
    jwtValidation,
    check('id', 'No es un ID válido').isMongoId().if(isValidObjectId).custom( productExistById ),
    fieldsValidation
], updateProduct)

router.delete('/:id',[
    jwtValidation,
    isAdminRole,
    check('id', 'No es un ID válido').isMongoId().if(isValidObjectId).custom( productExistById ),
    fieldsValidation
],deleteProduct)

module.exports = router;