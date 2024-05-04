const jwt = require('jsonwebtoken')
const bcrypt =require('bcryptjs')
const asyncHandler =require('express-async-handler')
const User = require('../models/userModel')

const register =asyncHandler(async (req, res) => {
    //destructural objeto
    const{name, lastname, email, password} = req.body

    //verificar que me pasen los datos
    if(!name || !lastname || !email || !password){
        res.status(400)
        throw new Error('Faltan datos')
    }

    //verificar que el usuario
    const userExiste = await User.findOne({email})
    if(userExiste){
        res.status(400)
        throw new Error('Ese usuario ya existe en la base de datos')
    }

    //Hacemos HASH
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    //crear el usuario
    const user = await User.create({
        name,
        lastname,
        email, 
        password: hashedPassword
    })


    res.status(201).json(user)
})

const login =asyncHandler( async (req, res) => {
    const {email, password} = req.body

    const user = await User.findOne({email})

    if(user && (await bcrypt.compare(password, user.password))){
        res.status(200).json({
            _id: user.id,
            name: user.name,
            lastnamename: user.lastname,
            email: user.email,
            token: generarToken(user.id)
        })
    } else{
        res.status(401)
        throw new Error('El usuario o la contraseña es incorrecta')
    }
})

const generarToken = (idusuario) => {
    return jwt.sign({idusuario}, process.env.JWT_SECRET)
    expiresIn: '30d'
}

// Controlador para ver un usuario
const showdata =asyncHandler( async (req, res) => {
    const userId = req.params.id;

    const user = await User.findById(userId);

    if(!user){     
        res.status(404)
        throw new Error('El usuario no existe')
    }
    res.status(200).json(req.user)
})

// Controlador para borrar un usuario
const deleteUser = asyncHandler(async (req, res) => {
    const userId = req.params.id;

    // Buscar el usuario en la base de datos
    const user = await User.findById(userId);

    if (!user) {
        res.status(404);
        throw new Error('El usuario no existe');
    }

    // Borrar el usuario de la base de datos
    await user.deleteOne(user);

    res.status(200).json({ message: 'Usuario eliminado exitosamente' });
})

const updateUser = asyncHandler( async(req, res) =>{
    const user = await User.findOneAndUpdate({ _id: req.params.id }, req.body, { new: true });

    if(!user){     
        res.status(404)
        throw new Error('El usuario no existe')
    }


    res.status(200).json({message: `Se modifico el usuario ${req.params.id}\n${user}`})
})

module.exports = {
    register,
    login,
    showdata,
    deleteUser,
    updateUser

}