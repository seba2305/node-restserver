
const { Router } = require('express');
const { check, query } = require('express-validator');
const { fieldsValidation } = require('../middlewares/fields_validation');

const { login, googleSignIn } = require('../controllers/auth');

const router = Router();

router.post('/login', [
    check('email', 'El email es obligatorio').isEmail(),
    check('password', 'El password es obligatorio').notEmpty(),
    fieldsValidation
],login);

router.post('/google', [
    check('id_token', 'El token es necesario').notEmpty(),
    fieldsValidation
],googleSignIn);


module.exports = router;