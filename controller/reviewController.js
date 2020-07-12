const db = require('../utils/database')
const query = require('./mysql/query')
const appError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

var vendor_review_query_result;
exports.vendorReview= (req,res,next)=>{
    const post = {
        vendor_id:req.params.id,
        ratings:req.body.ratings,
        review:req.body.review,
        //at later time you must protect the route and that time while logging in you will recieve user id by itself
        customer_id:req.body.customer_id
    }
    req.query= 'INSERT INTO vendor_reviews SET ?'

    query.query_data(req,next,post)
    .then(rows=>{
        vendor_review_query_result=rows
        // console.log(vendor_review_query_result)
        res.status(200).json({
            status:'success',
            message:'review added successfully'
        })
    }) .catch(err=>{
        return next (new appError(err,500))
    })
}

//===========================POSTING REVIEWS===========================================================================//

exports.productReview_vendor = (req,res,next)=>{

        const post = {
            customer_id: req.body.customer_id,
            vendor_product_id:req.params.product_id,
            comment: req.body.comment,
        }

        req.query = 'INSERT INTO review_product_vendor SET ?'
        
        query.query_data(req,next,post)
        .then(rows=>{
            res.status(200).json({
                status:'success',
                message:'review added successfully'
            })
        },err=>{
            return next (new appError(err,500))
        })
}

exports.productReview_customer = (req,res,next)=>{
    const post = {
        customer_id : req.body.customer_id,
        customer_product_id: req.body.customer_product_id,
        review: req.body.review,
        rating: req.body.rating
    }

    req.query = 'INSERT INTO review_product_customer SET ?'

    query.query_data(req,next,post)
    .then(rows=>{
        res.status(200).json({
            status:'success',
            message:'review added successfully'
        })
    })

    res.send('under development')
}

//===========================================================GETTING PRODUCT REVIEWS============================================//

exports.get_vendor_product_review= catchAsync (async(req,res,next)=>{

    req.query = `SELECT review_product_vendor.id,name, comment from review_product_vendor 
	                JOIN customer_info
                    on review_product_vendor.customer_id = customer_info.id
                    JOIN nepar_users
                    on customer_info.nepar_user_id=nepar_users.id
                    WHERE vendor_product_id=${req.params.product_id} `
    
    query.query_data(req,next).then(fields=>{
        
        res.status(200).json({
            status:'success',
            data: fields
        })

    },err=>{
        return next (new appError(err,500))
    })

} )