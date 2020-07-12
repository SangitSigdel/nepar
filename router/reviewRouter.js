const express = require('express')
const reviewController = require('../controller/reviewController');
const { route } = require('./productRouter');
const router = express.Router();

//note down you should get customer id from the protect middleware in coming future.

router.post('/vendor',reviewController.vendorReview)

router.route('/product/vendor/:product_id')
        .post(reviewController.productReview_vendor)
        .get(reviewController.get_vendor_product_review)

router.post('/product/customer',reviewController.productReview_customer)

module.exports = router