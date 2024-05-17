const express = require('express');
const colors = require('colors');
const connectDB = require('./config/db');
const dotenv = require('dotenv').config();
const { errorHandler } = require('./middleware/errorMiddleware');
const cors = require('cors');
const path = require('path'); 

// Conexión a la base de datos
connectDB();

const port = process.env.PORT || 8000;

const app = express();

// Middleware para el manejo de datos JSON
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

// Servir archivos estáticos del frontend
const frontEndPath = path.join('D:', 'Users','Front-end');
app.use(express.static(frontEndPath));

// Rutas de usuarios
app.use('/api/users', require('./routes/userRoutes'));

// Rutas de productos
app.use('/api/products', require('./routes/productsRoutes'));

// Middleware para manejar errores
app.use(errorHandler);

// Iniciar el servidor
app.listen(port, () => console.log(`Servidor iniciado en el puerto ${port}`.cyan));