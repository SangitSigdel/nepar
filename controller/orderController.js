const catchAsync = require('../utils/catchAsync')
const appError = require('../utils/appError')
const query = require('../controller/mysql/query')

exports.createOrder = catchAsync(async (req,res,next)=>{

    req.body.forEach(element => {
        element.customer_id = req.params.customer_id

    });

    let keys = Object.keys(req.body[0]);

    let values = req.body.map(obj => keys.map(key => obj[key]));

    console.log(keys, values)

    req.query = 'INSERT INTO orders_vendors' + ' (' + keys.join(',') + ') VALUES ?'

    await query.query_data(req, next, values).then(fields => {
      
        res.status(200).json({
            status:'success',
            message: 'order created successfully'
        })

    })
})

exports.getCustomerOrderInfo = catchAsync (async (req,res,next)=>{

    req.query = `SELECT orders_vendors.id AS order_id,orders_vendors.date as order_date,product_vendor.name AS product_name,quantity,price AS unit_price, (quantity*price) AS total, nepar_users.name AS vendor_name,contact
                    FROM orders_vendors
                    LEFT JOIN product_vendor
                    ON orders_vendors.vendor_product_id = product_vendor.id
                    LEFT JOIN vendor_info
                    ON product_vendor.vendor_id = vendor_info.id
                    LEFT JOIN nepar_users
                    ON vendor_info.nepar_user_id = nepar_users.id
                    WHERE orders_vendors.customer_id=${req.params.customer_id}`

    await query.query_data(req,next).then(fields=>{
        res.status(200).json({
            status:'success',
            data: fields
        })
    })
})

exports.getVendorOrderInfo = catchAsync (async (req,res,next)=>{
    req.query = `SELECT orders_vendors.id as order_id,orders_vendors.date as order_date,product_vendor.name AS product_name, quantity,price as unit_price,nepar_users.name AS customer_name, nepar_users.contact AS customer_contact,status 
                    FROM orders_vendors 
                    LEFT JOIN product_vendor 
                    ON orders_vendors.vendor_product_id= product_vendor.id 
                    LEFT JOIN customer_info 
                    ON orders_vendors.customer_id = customer_info.id 
                    LEFT JOIN nepar_users 
                    ON customer_info.nepar_user_id = nepar_users.id 
                    WHERE product_vendor.vendor_id= ${req.params.vendor_id} ORDER BY orders_vendors.date `
    await query.query_data(req,next).then(fields=>{
        res.status(200).json({
            status:'success',
            data: fields
        })
    })
})
