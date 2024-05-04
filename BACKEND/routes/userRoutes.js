const express = require('express')
const router = express.Router()
const {login, register, showdata, deleteUser, updateUser} = require('../controllers/userControllers')
const {protect} = require('../middleware/authMiddleware')

router.post('/login', login)
router.post('/register', register)
router.get('/showdata', protect,showdata)
router.delete('/:id', deleteUser)
router.put('/:id', updateUser)

module.exports = router