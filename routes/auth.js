
const { Router } = require('express');
const { check, query } = require('express-validator');
const { login } = require('../controllers/auth');
const { fieldsValidation } = require('../middlewares/fields_validation');

const router = Router();

router.post('/login', [
    check('email', 'El email es obligatorio').isEmail(),
    check('password', 'El password es obligatorio').notEmpty(),
    fieldsValidation
],login);


module.exports = router;