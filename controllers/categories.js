
const {Category} = require('../models');


const getCategories = async (req, res) => {
    
    const { limit = 5, from = 0 } = req.query;
    const query = { status: true };

    const [ total, categories ] = await Promise.all([
        Category.countDocuments(query),
        Category.find(query)
            .limit(limit)
            .skip(from)
            .populate('user', 'name')
    ]);

    res.json({
        total,
        categories
    });
};

const getCategory = async (req, res) => {

    const { id } = req.params;
    const category = await Category.findById(id)
            .populate('user', 'name');

    res.json({
        category
    });
};

const createCategory = async (req, res) => {

    try {
        const name = req.body.name.toUpperCase();
    
        const existCategory = await Category.findOne({name});

        if (existCategory) {
            return res.status(400).json({
                msg: `La categoría ${name} ya existe`
            });
        }
    
        const data = {
            name,
            user: req.user_auth.id
        }

        const category = new Category(data);
        //Guardar en BD
        await category.save();
    
        res.status(201).json({
            msg: 'Categoria creada exitosamente',
            category
        });        
    } catch (error) {
        console.log('Error createcategory, ',error);
        res.status(500).json({msg:`Ups!, hubo un error al tratar de crear la categoria.`});        
    }

};

const updateCategory = async (req, res) => {
    
    const { id } = req.params;
    const { status, user, ...body } = req.body;
    
    body.name = body.name.toUpperCase();
    body.user = req.user_auth.id;

    const existCategory = await Category.findOne({name:body.name});

    if (existCategory) {
        return res.status(400).json({
            msg: `La categoría ${body.name} ya existe`
        });
    }
    
    const categoryUpdated = await Category.findByIdAndUpdate( id, body, { new: true } );
    res.json( {
        msg: `La categoria ha sido actualizada.`,
        categoryUpdated
    });
};

const deleteCategory = async (req, res) => {

    const { id } = req.params;
    const category = await Category.findByIdAndUpdate( id, { status: false } );

    res.json({
        msg:`La categoria con ID ${id} ha sido eliminado.`
    });
};


module.exports = {
    getCategories,
    getCategory,
    createCategory,
    updateCategory,
    deleteCategory
}