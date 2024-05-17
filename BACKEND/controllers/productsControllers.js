const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const asyncHandler = require('express-async-handler');
const Product = require('../models/productsModel');

// Función para generar un token
const generarToken = (idproducto) => {
    return jwt.sign({ idproducto }, process.env.JWT_SECRET, {
        expiresIn: '30d'
    });
};

// Controlador para crear un producto
const createProduct = asyncHandler(async (req, res) => {
    const { name, price, stock } = req.body;

    // Verificar que se pasen los datos necesarios
    if (!name || !price || !stock) {
        res.status(400);
        throw new Error('Faltan datos');
    }

    // Verificar si el producto ya existe
    const productExists = await Product.findOne({ name });
    if (productExists) {
        res.status(400);
        throw new Error('Este producto ya existe en la base de datos');
    }

    // Crear el producto
    const product = await Product.create({
        name,
        price,
        stock
    });

    // Generar token
    const token = generarToken(product._id);

    res.status(201).json({ product, token });
});

// Controlador para obtener todos los productos
const getAllProducts = asyncHandler(async (req, res) => {
    const products = await Product.find({});
    res.status(200).json(products);
});

// Controlador para obtener un producto por su ID
const getProductById = asyncHandler(async (req, res) => {
    const productId = req.params.id;
    const product = await Product.findById(productId);

    if (!product) {
        res.status(404);
        throw new Error('El producto no existe');
    }

    res.status(200).json(product);
});

// Controlador para actualizar un producto
const updateProduct = asyncHandler(async (req, res) => {
    const productId = req.params.id;
    const { name, price, stock } = req.body;

    const product = await Product.findById(productId);

    if (!product) {
        res.status(404);
        throw new Error('El producto no existe');
    }

    product.name = name || product.name;
    product.price = price || product.price;
    product.stock = stock || product.stock;

    const updatedProduct = await product.save();

    res.status(200).json(updatedProduct);
});

// Controlador para eliminar un producto
const deleteProduct = asyncHandler(async (req, res) => {
    const productId = req.params.id;
    const product = await Product.findById(productId);

    if (!product) {
        res.status(404);
        throw new Error('El producto no existe');
    }

    await product.deleteOne(product);

    res.status(200).json({ message: 'Producto eliminado exitosamente' });
});

// Controlador para procesar un pago y actualizar el stock
const processPurchase = asyncHandler(async (req, res) => {
    const cart = req.body;
    let total = 0;

    try {
        for (const [productName, productDetails] of Object.entries(cart)) {
            const product = await Product.findOne({ name: productName });

            if (!product) {
                res.status(404);
                throw new Error(`Producto ${productName} no encontrado`);
            }

            if (product.stock < productDetails.quantity) {
                res.status(400);
                throw new Error(`Stock insuficiente para el producto ${productName}`);
            }

            product.stock -= productDetails.quantity;
            await product.save();

            total += productDetails.price * productDetails.quantity;
        }

        res.status(200).json({ message: `Pago procesado exitosamente. Total: $${total}` });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = {
    createProduct,
    getAllProducts,
    getProductById,
    updateProduct,
    deleteProduct,
    processPurchase
};
