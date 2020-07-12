const catchAsync = require('../utils/catchAsync')
const appError = require('../utils/appError')
const query = require('../controller/mysql/query')

exports.createOrder = catchAsync(async (req,res,next)=>{

    req.query = `INSERT INTO orders_vendors (vendor_product_id,quantity) VALUES ?`
    var outputData = req.body.map(Object.values);
    
    await query.query_data(req,next,outputData).then(fields=>{
        console.log(fields)
    })

    res.send('success')

})
