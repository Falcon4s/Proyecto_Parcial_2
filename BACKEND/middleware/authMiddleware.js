const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const User = require('../models/userModel');

const protect = asyncHandler(async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // Obtener el token de los headers
            token = req.headers.authorization.split(' ')[1];

            // Verificar el token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Obtener el usuario del token
            req.user = await User.findById(decoded.idusuario).select('-password');

            next();
        } catch (error) {
            console.error(error);
            res.status(401);
            throw new Error('Acceso no autorizado, token fallido');
        }
    }

    if (!token) {
        res.status(401);
        throw new Error('Acceso no autorizado, no se proporcionó token');
    }
});

module.exports = { protect };
