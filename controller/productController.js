const db = require('../utils/database')
const appError = require('../utils/appError')
const multer = require("multer")
const sharp = require('sharp')
const query = require('../controller/mysql/query');
const catchAsync = require('../utils/catchAsync')
const upload = require('../controller/uploadImages');
const app = require('../app');

var vendor_query_result,customer_query_result;

//configuring multer for images as field and max number of images to be uploaded as 3
exports.uploadImage = upload.uploadImage.array('images',3);


//=============================================================INSERTING IMAGES TO THE DATABASE============================================================//

//resizing images and updating vendor image database after multer configuration and as defined in the router for uploadImage and then resize image
exports.update_image_db_vendor = catchAsync(async (req, res, next) => {

    upload.resizeImage(req, next, 500, 500, 98, `public/images`)
        .then(async data=>{
        req.query = `INSERT INTO images_vendor_product SET ?`
        await Promise.all(req.body.images.map(async (filename, i) => {
            await query.query_data(req, next, {
                img_url: `${req.protocol}://${req.get('host')}/images/${filename}`,
                vendor_product_id: req.params.product_id_vendor
            })
        })
        )
        res.status(200).json({
            status: 'success',
            message: 'images uploaded successfully'
        })
    }).catch(err => {
        return next(new appError(err, 500))
     })

    
});

// similar to the above update image vendor...
exports.update_image_db_customer = catchAsync(async (req, res, next) => {

    upload.resizeImage(req, next, 500, 500, 90, `public/images`)
        .then(async data => {
            req.query = `INSERT INTO images_customer_product SET ?`
            await Promise.all(req.body.images.map(async (filename, i) => {
                await query.query_data(req, next, {
                    img_url: `${req.protocol}://${req.get('host')}/images/${filename}`,
                    vendor_product_id: req.params.product_id_vendor
                })
            })
            )
            res.status(200).json({
                status: 'success',
                message: 'images uploaded successfully'
            })
        }).catch(err => {
            return next(new appError(err, 500))
    })
});

//========================================================================GETTING ALL VENDOR PRODUCTS==========================================================//

exports.get_vendor_products =catchAsync(async(req,res,next)=>{

    var product_id=[]
    var images_product_id= []

    req.query = `SELECT * FROM product_vendor
                    WHERE vendor_id=${req.params.id}`
   await query.query_data(req,next).then(async fields1=>{
        
        if(fields1.length>0){
           fields1.forEach(el => {
               product_id.push(el.id)
           });

           req.query = `SELECT img_url,vendor_product_id FROM images_vendor_product
                WHERE vendor_product_id IN (${product_id})`

           await query.query_data(req, next).then(fields2 => {

               fields2.forEach((el, i) => {
                   images_product_id.push(el.vendor_product_id)
               });

               product_id.forEach((el1, i) => {
                   var img_url = []
                   images_product_id.forEach((el2, j) => {

                       if (el1 == el2) img_url.push(fields2[j].img_url)

                   });

                   fields1[i].img_url = img_url

               });

           })
       }
       res.status(200).json({
           data: fields1
       })
    })
})

//=========================================================CREATING VENDOR PRODUCT=================================================================//

exports.create_vendor_product = (req, res, next) => {

    const post_product = {
        name: req.body.name,
        description:req.body.description,
        price:req.body.price,
        discount: req.body.discount,
        offer_price: req.body.offer_price,
        vendor_id: req.params.id,
        delivery_location: req.body.delivery_location
    }

    req.query = 'INSERT INTO product_vendor SET ?'

    query.query_data(req,next,post_product)
    .then(rows => {
        
        req.query = `INSERT INTO activity_vendor SET ?`

        const post_activity={
            vendor_id:post_product.vendor_id,
            product_id :rows.insertId
        }
        query.query_data(req,next,post_activity)

    },err=>{
        return next(new appError(err,500))
    }).then(rows2=>{
        
        res.status(200).json({
            status: 'success',
            message: 'product added successfully'
        })
    },err=>{
        return next (new appError(err,500))
    }) .catch(err => {
        return next(new appError(err, 500))
    })
}

//===================================================IT IS INCOMPLETE GET CUSTOMER PRODUCT PLEASE BE CAREFUL =========================================================//

exports.get_customer_products = (req, res, next) => {
    req.query = `SELECT * FROM product_customer WHERE vendor_id=${req.params.id}`
    query.query_data(req, next)
    
}

exports.create_customer_product = (req, res, next) => {

    const post = {
        name: req.body.name,
        description: req.body.description,
        price: req.body.price,
        discount: req.body.discount,
        offer_price: req.body.offer_price,
        customer_id: req.params.id,
        image_count: req.body.image_count,
        delivery_location: req.body.delivery_location,
        created_at: req.body.created_at
    }

    req.query = 'INSERT INTO product_customer SET ?'

    query.query_data(req, next, post)
    .then(rows => {
        customer_query_result = rows
        // console.log(customer_query_result)

        //it has been moved from the bottom after catch block don't know if it works should check once
        res.status(200).json({
            status: 'success',
            message: 'product added successfully'
        })
    }).catch(err => {
        return next(new appError(err, 500))
    })
   
}

//==================================================================GETTING SINGLE VENDOR PRODUCT========================================================//

exports.get_single_vendor_product = catchAsync(async(req,res,next)=>{

    var product_image_url = []

    req.query = `SELECT * FROM product_vendor 
                    WHERE id= ${req.params.vendor_product_id}`
    
    await query.query_data(req,next).then(async fields1=>{
     
        if(fields1.length>0){
    
            req.query = `SELECT * FROM images_vendor_product
                    WHERE vendor_product_id=${req.params.vendor_product_id}`

            await query.query_data(req, next).then(async fields2 => {

                fields2.forEach(el => {
                    product_image_url.push(el.img_url)
                });

                fields1[0].img_url = product_image_url

                    req.query = `SELECT count(*) as total_likes from likes_product_vendor
                                    WHERE vendor_product_id= ${req.params.vendor_product_id}`

                    await query.query_data(req,next).then(fields3=>{

                        fields1[0].total_likes = fields3[0].total_likes        

                    })

                    req.query = `SELECT count(*) as total_comments from review_product_vendor
                                        WHERE vendor_product_id= ${req.params.vendor_product_id}`

                    await query.query_data(req, next).then(fields3 => {

                        fields1[0].total_comments = fields3[0].total_comments

                    })

            })
        }
            
            req.query = `update product_vendor set visits=visits+1 WHERE id= ${req.params.vendor_product_id}`

            await query.query_data(req, next).then(
                res.status(200).json({
                    status: 'success',
                    data: fields1
                })
            )
     })
    
})