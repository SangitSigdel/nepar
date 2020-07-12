const catchAsync = require('../utils/catchAsync')
const query = require('../controller/mysql/query')
const appError = require('../utils/appError')
const app = require('../app')

exports.vendor_subscribe = catchAsync(async (req, res, next) => {

    req.query = 'INSERT INTO subscription_vendor SET ?'

    const subscribe_post = {
        customer_id: req.body.customer_id,
        vendor_id: req.params.vendor_id,

    }

    query.query_data(req, next, subscribe_post).then(fields => {

        res.status(200).json({
            status: 'success',
            message: 'successfully subscribed'
        })
    }, err => {

            req.query = `DELETE FROM subscription_vendor WHERE customer_id=${req.body.customer_id} AND vendor_id=${req.params.vendor_id}`

            query.query_data(req, next).then(fields => {
                res.status(200).json({
                    status: 'success',
                    message: 'unsubscribed'
                })

            }, err => {
                return next(new appError(err, 500))
            })
    })

})