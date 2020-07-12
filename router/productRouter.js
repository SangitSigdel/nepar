const express = require('express')
const productController = require('../controller/productController')

const router = express.Router();

//vendor products link: /api/v1/json/product/
router.route('/vendor/:id')
        .get(productController.get_vendor_products)
        .post(productController.create_vendor_product)

//customer products  link: /api/v1/json/product/
router.route('/customer/:id')
        .get(productController.get_customer_products)
        .post(productController.create_customer_product)


//getting a single product

//change the route its api/v1/json/product/vendor/product double product doesn't seems good//
router.route('/vendor/product/:vendor_product_id')
        .get(productController.get_single_vendor_product)
        
// router.route('/customer/product/:customer_product_id')
//         .get(productController.get_single_customer_product)


//uploading picture of the products

router.route('/upload/vendor/:product_id_vendor')
        .post(productController.uploadImage,productController.update_image_db_vendor)

router.route('/upload/customer/:product_id_customer')
        .post(productController.uploadImage,productController.update_image_db_customer)

module.exports= router