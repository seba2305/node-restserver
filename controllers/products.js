
const {Product} = require('../models');


const getProducts = async (req, res) => {
    
    const { limit = 5, from = 0 } = req.query;
    const query = { status: true };

    const [ total, products ] = await Promise.all([
        Product.countDocuments(query),
        Product.find(query)
            .populate('user', 'name')
            .populate('category', 'name')
            .limit(limit)
            .skip(from)
            
    ]);

    res.json({
        total,
        products
    });
};

const getProduct = async (req, res) => {

    const { id } = req.params;
    const product = await Product.findById(id)
            .populate('user', 'name')
            .populate('category', 'name');

    res.json({
        product
    });
};

const createProduct = async (req, res) => {

    try {
        const { status, user, ...body } = req.body;
        const name = req.body.name.toUpperCase();
    
        const existProduct = await Product.findOne({name});

        if (existProduct) {
            return res.status(400).json({
                msg: `El producto ${name} ya existe`
            });
        }   

        const data = {
            ...body,
            name,
            user: req.user_auth.id,
        }

        const product = new Product(data);
        //Guardar en BD
        await product.save();
    
        res.status(201).json({
            msg: 'Producto creado exitosamente',
            product
        });        
    } catch (error) {
        console.log('Error createproduct, ',error);
        res.status(500).json({msg:`Ups!, hubo un error al tratar de crear el producto.`});
    }

};

const updateProduct = async (req, res) => {
    
    const { id } = req.params;
    const { status, user, ...body } = req.body;
    
    if(body.name){
        body.name = body.name.toUpperCase();
    }
    body.user = req.user_auth.id;

    const existProduct = await Product.findOne({name:body.name});

    if (existProduct) {
        return res.status(400).json({
            msg: `El producto ${body.name} ya existe`
        });
    }
    
    const productUpdated = await Product.findByIdAndUpdate( id, body, { new: true } )
                                    .populate('user', 'name')
                                    .populate('category', 'name');
    res.json( {
        msg: `El producto ha sido actualizado.`,
        productUpdated
    });
};

const deleteProduct = async (req, res) => {

    const { id } = req.params;
    const productDeleted = await Product.findByIdAndUpdate( id, { status: false }, {new: true} );

    res.json({
        msg:`El producto con ID ${id} ha sido eliminado.`,
        productDeleted
    });
};


module.exports = {
    getProducts,
    getProduct,
    createProduct,
    updateProduct,
    deleteProduct
}