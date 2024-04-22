
const { Router } = require('express');
const { check, query } = require('express-validator');
const { isValidObjectId } = require('mongoose');

const { fieldsValidation, jwtValidation, isAdminRole, hasRole } = require('../middlewares');
const { isValidRole, userExistById } = require('../helpers/db_validators');

const { getUsers, putUsers, postUsers, deleteUsers, patchUsers } = require('../controllers/user');

const router = Router();

router.get('/', [
    query('limit',"El valor de 'limit' debe ser númerico")
        .isNumeric()
        .optional(),
    query('from',"El valor de 'from' debe ser númerico")
        .isNumeric()
        .optional(),
    fieldsValidation
],getUsers);

router.put('/:id', [
    check('id', 'No es un ID válido').isMongoId().if(isValidObjectId).custom( userExistById ),
    fieldsValidation
],putUsers);

router.post('/', [
    check('name','El nombre es obligatorio').notEmpty(),
    check('password','El password debe tener 6 carácteres mínimo').isLength({ min: 6 }),
    check('email','El correo no es válido').isEmail(),
    check('role').custom( isValidRole ),
    fieldsValidation
] ,postUsers);

router.patch('/', patchUsers);

router.delete('/:id', [
    jwtValidation,
    // isAdminRole,
    hasRole('ADMIN_ROLE', 'SALE_ROLE'),
    check('id', 'No es un ID válido').isMongoId().if(isValidObjectId).custom( userExistById ),
    fieldsValidation
],deleteUsers);


module.exports = router;
