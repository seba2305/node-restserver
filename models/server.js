const express = require('express');
const cors = require('cors');
const { dbConnection } = require('../database/config');

class Server {

    constructor(){
        this.app = express();
        this.port = process.env.PORT;
        this.routesPaths = {
            auth:       '/api/auth',
            categories: '/api/categories',
            products:   '/api/products',
            search:     '/api/search',
            users:      '/api/users',
        }

        // conectar a BD
        this.conectarDB();

        //Middlewares
        this.middlewares();

        //Rutas aplicacion
        this.routes();
    }

    async conectarDB(){
        await dbConnection();
    }

    middlewares(){

        //Cors
        this.app.use( cors() );

        // Lectura y parseo body
        this.app.use( express.json() );

        //Directorio publico
        this.app.use( express.static('public') );
    }

    routes(){

        this.app.use(this.routesPaths.auth, require('../routes/auth'));
        this.app.use(this.routesPaths.categories, require('../routes/categories'));
        this.app.use(this.routesPaths.products, require('../routes/products'));
        this.app.use(this.routesPaths.search, require('../routes/searches'));
        this.app.use(this.routesPaths.users, require('../routes/users'));        

    }

    listen(){
        this.app.listen(this.port, () => {
            console.log('Servidor corriendo en puerto ', this.port)
        })
    }

}

module.exports = Server;