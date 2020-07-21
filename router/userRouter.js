const express = require('express')
const userController = require('../controller/userController')
const authController = require('../controller/authcontroller')
const router = express.Router()

router.post('/signup', userController.createUser)

router.post('/login', userController.loginUser)

router.post('/protect', authController.protect)

router.post('/upload/profile_pic/:nepar_user_id', userController.uploadImage_profilePic, userController.update_nepar_user_profilepic_db)

module.exports = router