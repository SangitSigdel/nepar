const express = require('express')
const controller = require('../controller/orderController')

const router = express.Router()

router.route('/customer/:customer_id')
        .post(controller.createOrder)
        .get(controller.getCustomerOrderInfo)
router.route('/vendor/:vendor_id')
        .get(controller.getVendorOrderInfo)

module.exports = router