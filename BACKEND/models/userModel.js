const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, "Por favor pon tu nombre"]
    },
    lastname: {
        type: String,
        required: [true, "Por favor pon tu apellido"]
    },
    email:{
        type: String,
        required: [true, "Por favor teclea tu email"],
        unique: true
    },
    password:{
        type: String,
        required: [true, "Por favor teclea tu password"]
    },
    esAdmin:{
        type:Boolean,
        default: false
    }

},{
    timestamps: true
})

module.exports = mongoose.model('User', userSchema)