//importing classes
const express = require('express')
const userRouter = require('./router/userRouter')
const reviewRouter = require('./router/reviewRouter')
const productRouter = require('./router/productRouter')
const subscriptionRouter = require('./router/subscriptionRouter')
const appError = require('./utils/appError')
const homeRouter = require('./router/homeRouter')
const likes_vendorRouter = require('./router/likes_vendorRouter')
const nearMeRouter = require('./router/nearMeRouter')
const orderRouter = require('./router/orderRouter')
const compression = require('compression')
const globalErrorHandler = require('./controller/globalErrorHandler')
const app = express()

//middle wares 
app.use(express.json())
app.use(express.static('public'))
app.use('/api/v1/json/user', userRouter)
app.use('/api/v1/json/review', reviewRouter)
app.use('/api/v1/json/product', productRouter)
app.use('/api/v1/json/subscription', subscriptionRouter)
app.use('/api/v1/json', homeRouter)
app.use('/api/v1/json/vendor/products/likes', likes_vendorRouter)
app.use('/api/v1/json/nearme', nearMeRouter)
app.use('/api/v1/json/orders', orderRouter)
app.use(compression())

app.use('*', (req, res, next) => {

    next(new appError('sorry the requested url is not found on this server', 404))

})

app.use(globalErrorHandler)

module.exports = app