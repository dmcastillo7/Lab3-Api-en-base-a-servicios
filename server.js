//Requerir dependencias necesarias

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const reservasRoutes = require('./routes/reservas');
require('dotenv').config(); // Cargar variables de entorno desde el archivo .env

const app = express();
app.use(cors()); //Habilitar CORS para permitir solicitudes desde otros dominios
app.use(express.json()); //Habilitar el análisis de JSON en las solicitudes entrantes

//Puerto en el que se ejecutará el servidor
const PORT = process.env.PORT;
const MONGODB_URI = process.env.MONGODB_URI;

//Enrutamiento de las rutas de autenticación
app.use('/api/auth', authRoutes);
app.use('/api/reservas', reservasRoutes);

if (!MONGODB_URI) {
    console.error('Error: define MONGO_URI o MONGODB_URI en el archivo .env');
    process.exit(1);
}

mongoose.connect(MONGODB_URI).then(() => {
    console.log('Conexión a la base de datos establecida');
    app.listen(PORT, () => {
        console.log(`Servidor corriendo en el puerto ${PORT}`);
    });
}).catch(error => {
    console.error('Error al conectar a la base de datos:', error.message);
    process.exitCode = 1;
});