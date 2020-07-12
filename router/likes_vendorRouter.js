const express = require('express')
const likesController = require('../controller/likes_vendorController')
const router = express.Router();

router.route('/:product_id')
        .post(likesController.submitLikes)

module.exports = router