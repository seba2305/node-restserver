
const fieldsValidation = require('../middlewares/fields_validation');
const jwtValidation = require('../middlewares/jwt_validation');
const rolesValidation = require('../middlewares/roles_validation');

module.exports = {
    ...fieldsValidation,
    ...jwtValidation,
    ...rolesValidation,
}