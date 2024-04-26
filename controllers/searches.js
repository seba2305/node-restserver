const { isValidObjectId } = require("mongoose");
const { User, Category, Product } = require("../models");

const allowedCollections = [
    'users',
    'categories',
    'products',
    'roles',
];


const search = (req, res) => {

    const {collection, term} = req.params;

    if (!allowedCollections.includes(collection)) {
        return res.status(400).json({
            msg: `Las colecciones permitidas son: ${allowedCollections}`
        })
    }

    switch (collection) {
        case 'users':
                searchUsers(term, res);
            break;
        case 'categories':
                searchCategories(term, res);
            break;
        case 'products':
                searchProducts(term, res);
            break;
    
        default:
                console.log('Error Search status 500, defalt switch');
                return res.status(500).json({
                    msg: 'No es una búsqueda válida'
                });
            break;
    }


}

const searchUsers = async (term = '', res) =>{
    
    if(isValidObjectId(term)){
        const user = await User.find({_id: term, status: true});
        return res.json({
            results: (user) ? [user] : []
        })
    }

    const regex = new RegExp( term, 'i' );
    const query = {
        $or: [{name: regex }, {email: regex}],
        $and: [{status: true }]
    }
    const [total, users] = await Promise.all([
        User.countDocuments(query),
        User.find(query)
    ]);

    res.json({
        total: total,
        results: users
    })

}

const searchCategories = async (term = '', res) =>{
    
    if(isValidObjectId(term)){
        const category = await Category.find({_id: term, status: true});
        return res.json({
            results: (category) ? [category] : []
        })
    }

    const regex = new RegExp( term, 'i' );
    const query = { name: regex, status: true};
    const [total, categories] = await Promise.all([
        Category.countDocuments(query),
        Category.find(query)
    ]);

    res.json({
        total: total,
        results: categories
    })

}

const searchProducts = async (term = '', res) =>{
    
    if(isValidObjectId(term)){
        const product = await Product.find({_id: term, status: true})
                                .populate('category','name');
        return res.json({
            results: (product) ? [product] : []
        })
    }

    const regex = new RegExp( term, 'i' );
    const query = {name: regex, status: true };
    const [total, products] = await Promise.all([
        Product.countDocuments(query),
        Product.find(query)
            .populate('category', 'name')
    ]);

    res.json({
        total: total,
        results: products
    })

}

module.exports = {
    search
}