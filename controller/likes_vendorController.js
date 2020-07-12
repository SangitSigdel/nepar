const catchAsync = require('../utils/catchAsync')
const query = require('../controller/mysql/query')
const AppError = require('../utils/appError')

exports.submitLikes =catchAsync (async (req,res,next)=>{

    req.query = `INSERT INTO likes_product_vendor SET ?`

    const post_likes = {
        customer_id: req.body.customer_id,
        vendor_product_id: req.params.product_id
    }

    query.query_data(req,next,post_likes).then(fields=>{

        res.status(200).json({
            status:'success',
            message:'liked'
        })

    },err=>{
        
            if (err.code =='ER_DUP_ENTRY'){
                req.query = `DELETE from likes_product_vendor 
                        WHERE customer_id=${req.body.customer_id} 
                        AND vendor_product_id=${req.params.product_id}`
                query.query_data(req, next).then(fields => {
                    res.status(200).json({
                        status: 'success',
                        message: 'liked removed'
                    })
                }, err => {
                    return next(new AppError(err, 500))
                })
            }
            else{

                return next (new AppError(err,500))
            }
    })

})