const catchAsync = require('../utils/catchAsync')
const query = require('../controller/mysql/query')
const appError = require('../utils/appError')
exports.home = catchAsync(async (req,res,next)=>{

    var data=[]

    req.query = `SELECT vendor_id FROM subscription_vendor WHERE customer_id=${req.params.customer_id}`

    await query.query_data(req,next).then(async fields=>{

        if(fields.length>0){

            var vendor_ids = []
            var product_ids=[]

            fields.forEach(el => {
                vendor_ids.push(el.vendor_id)
            });

            //Note limit 10 means it will display only first 10 data from the table 
            req.query = `SELECT product_id,activity_vendor.vendor_id,name,description,price,discount,offer_price,ratings,created_at FROM activity_vendor 
                        LEFT JOIN product_vendor
                        ON activity_vendor.product_id=product_vendor.id 
                        WHERE activity_vendor.vendor_id IN (${vendor_ids})
                        ORDER BY created_at LIMIT 10`

            await query.query_data(req, next).then(async fields2 => {
                
                    data = fields2

                   fields2.forEach(el => {
                    
                        product_ids.push(el.product_id)

                   });

                   req.query=`SELECT img_url,vendor_product_id FROM images_vendor_product
                                WHERE vendor_product_id IN (${product_ids})`
                    await query.query_data(req,next).then(fields_img=>{

                        product_ids.forEach((el1,i) => {
                            var img_url=[]
                            fields_img.forEach((el2,j) => {
                                if (el1==el2.vendor_product_id) img_url.push(el2.img_url)
                            });
                            data[i].img_url=img_url
                        });

                    })

                req.query = `SELECT vendor_product_id, count(*) as total_likes from likes_product_vendor
                                    WHERE vendor_product_id IN (${product_ids}) GROUP BY vendor_product_id`

                await query.query_data(req, next).then(fields3 => {
                  
                    product_ids.forEach((el1,i) => {
                        var likes = 0

                        fields3.forEach((el2,j) => {
                            if(el1==el2.vendor_product_id) likes=el2.total_likes
                        })

                        data[i].likes = likes

                    });

                })

                req.query = `SELECT vendor_product_id, count(*) as total_comments from review_product_vendor
                                        WHERE vendor_product_id IN (${product_ids}) GROUP BY vendor_product_id`

                await query.query_data(req, next).then(fields4 => {

                    product_ids.forEach((el1, i) => {
                  
                        var comments = 0

                        fields4.forEach((el2, j) => {
                            if (el1 == el2.vendor_product_id) comments = el2.total_comments
                        })

                        data[i].comments = comments

                    });

                })


                })

        }
        res.status(200).json({
            status: 'success',
            data
        })

    })
})