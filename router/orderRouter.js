const express = require('express')
const controller = require('../controller/orderController')

const router = express.Router()

router.route('/:vendor_product_id')
        .post(controller.createOrder)

module.exports = router