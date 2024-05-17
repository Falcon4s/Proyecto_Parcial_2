const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, "Por favor ingresa el nombre del producto"]
    },
    price: {
        type: Number,
        required: [true, "Por favor ingresa el precio del producto"]
    },
    stock: {
        type: Number,
        required: [true, "Por favor ingresa el stock del producto"],
        default: 50 // Stock inicial de 50 unidades
    }

},{
    timestamps: true
});

module.exports = mongoose.model('Product', productSchema);
