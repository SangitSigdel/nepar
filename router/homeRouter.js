const express = require('express')
const controller = require('../controller/homeController')
const router = express.Router()

router.route('/home/:customer_id')
        .get(controller.home)

module.exports = router