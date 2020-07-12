const express = require('express')
const nearMeController =require('../controller/nearMeController')

const router = express.Router();

router.route('/')
        .get(nearMeController.getNearByMe)

module.exports= router