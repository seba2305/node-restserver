
const { isValidObjectId } = require('mongoose');
const { Router } = require('express');
const { check, query } = require('express-validator');

const { jwtValidation, fieldsValidation, isAdminRole } = require('../middlewares');
const { categoryExistById } = require('../helpers');

const { createCategory, getCategories, getCategory, updateCategory, deleteCategory } = require('../controllers/categories');

const router = Router();

router.get('/',[
    query('limit',"El valor de 'limit' debe ser númerico")
    .isNumeric()
    .optional(),
    query('from',"El valor de 'from' debe ser númerico")
    .isNumeric()
    .optional(),
],getCategories)

router.get('/:id',[
    check('id', 'No es un ID válido').isMongoId().if(isValidObjectId).custom( categoryExistById ),
    fieldsValidation
], getCategory)

router.post('/',[ 
    jwtValidation,
    check('name', 'El nombre es obligatorio').notEmpty(),
    fieldsValidation
], createCategory)

router.put('/:id',[
    jwtValidation,
    check('id', 'No es un ID válido').isMongoId().if(isValidObjectId).custom( categoryExistById ),
    check('name','El nombre es obligatorio').notEmpty(),
    fieldsValidation
], updateCategory)

router.delete('/:id',[
    jwtValidation,
    isAdminRole,
    check('id', 'No es un ID válido').isMongoId().if(isValidObjectId).custom( categoryExistById ),
    fieldsValidation
],deleteCategory)

module.exports = router;