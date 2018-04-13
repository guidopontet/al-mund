'use strict'

const app = require('./app');
const db_port = 27017
const db_name = 'al-mundo'
const port = 3002;

/* ----- ----- BASE DE DATOS ----- ----- */
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:' + db_port + '/' + db_name, (err) => {
    if (err) console.log('Error al conectar base de datos', err);
    else {
        console.log('BASE DE DATOS ' + db_name + ' CONECTADA EN EL PUERTO ' + db_port);

        // Si se conecta a la base, aceptamos peticiones desde el api
        app.listen(port, () => {
            console.log('ESCUCHANDO PETICIONES EN EL PUERTO: ' + port);
        })
    }
});





    
