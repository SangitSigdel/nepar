const express = require('express')
const userController = require('../controller/userController')
const authController = require('../controller/authcontroller')
const router = express.Router()

router.post('/signup', userController.createUser)

router.post('/login', userController.loginUser)

router.post ('/protect',authController.protect)

module.exports =router