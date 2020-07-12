const express = require('express')
const subscriptionController = require('../controller/subscriptionController')
const router = express.Router()

//router to subscribe or unsubscribe to the vendor from the same router.. if customer id and vendor id is matched then the link unsubscribes otherwise subscribe.
router.route('/subscribe/vendor/:vendor_id')
        .post(subscriptionController.vendor_subscribe);

module.exports = router