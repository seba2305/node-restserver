

const getUsers = (req, res) => {
    
    const { q, nombre = 'no name', apikey, page='1', limit } = req.query;

    res.json({
        msg: 'getUsers API',
        q,
        nombre,
        apikey,
        page,
        limit
    });
};

const putUsers = (req, res) => {
    
    const { id } = req.params;

    res.json({
        msg: 'putUsers API',
        id
    });
};

const postUsers = (req, res) => {

    const { nombre, edad } = req.body;

    res.json({
        msg: 'postUsers API',
        nombre,
        edad,
    });
};

const patchUsers = (req, res) => {
    
    res.json({
        msg: 'patchUsers API'
    });
};

const deleteUsers = (req, res) => {
    
    res.json({
        msg: 'deleteUsers API'
    });
};

module.exports = {
    getUsers,
    putUsers,
    postUsers,
    patchUsers,
    deleteUsers
}