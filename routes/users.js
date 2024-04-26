
const { Router } = require('express');
const { check, query } = require('express-validator');
const { isValidObjectId } = require('mongoose');

const { fieldsValidation, jwtValidation, hasRole } = require('../middlewares');
const { isValidRole, userExistById } = require('../helpers');

const { getUsers, createUser, updateUser, deleteUser, getUser } = require('../controllers/users');

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

router.get('/:id', [
    check('id', 'No es un ID válido').isMongoId().if(isValidObjectId).custom( userExistById ),
    fieldsValidation
],getUser);

router.put('/:id', [
    jwtValidation,
    check('id', 'No es un ID válido').isMongoId().if(isValidObjectId).custom( userExistById ),
    fieldsValidation
],updateUser);

router.post('/', [
    jwtValidation,
    check('name','El nombre es obligatorio').notEmpty(),
    check('password','El password debe tener 6 carácteres mínimo').isLength({ min: 6 }),
    check('email','El correo no es válido').isEmail(),
    check('role').custom( isValidRole ),
    fieldsValidation
] ,createUser);

router.delete('/:id', [
    jwtValidation,
    hasRole('ADMIN_ROLE', 'SALE_ROLE'),
    check('id', 'No es un ID válido').isMongoId().if(isValidObjectId).custom( userExistById ),
    fieldsValidation
],deleteUser);


module.exports = router;
