
const { Router } = require('express');
const { getUsers, putUsers, postUsers, deleteUsers, patchUsers } = require('../controllers/user');
const { check, query } = require('express-validator');
const { isValidObjectId } = require('mongoose');

const { fields_validation } = require('../middlewares/fields_validation');
const { isValidRole, userExistById } = require('../helpers/db_validators');

const router = Router();

router.get('/', [
    query('limit',"El valor de 'limit' debe ser númerico")
        .isNumeric()
        .optional(),
    query('from',"El valor de 'from' debe ser númerico")
        .isNumeric()
        .optional(),
    fields_validation
],getUsers);

router.put('/:id', [
    check('id', 'No es un ID válido').isMongoId().if(isValidObjectId).custom( userExistById ),
    fields_validation
],putUsers);

router.post('/', [
    check('name','El nombre es obligatorio').notEmpty(),
    check('password','El password debe tener 6 carácteres mínimo').isLength({ min: 6 }),
    check('email','El correo no es válido').isEmail(),
    // check('role','No es un rol válido').isIn(['ADMIN_ROLE','USER_ROLE']),
    check('role').custom( isValidRole ),
    fields_validation
] ,postUsers);

router.patch('/', patchUsers);

router.delete('/:id', [
    check('id', 'No es un ID válido').isMongoId().if(isValidObjectId).custom( userExistById ),
    fields_validation
],deleteUsers);


module.exports = router;
