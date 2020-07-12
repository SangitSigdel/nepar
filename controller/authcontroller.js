const jwt = require('jsonwebtoken')
const appError = require('../utils/appError')
const db = require('../utils/database')

exports.protect = async (req, res, next) => {

    if (!req.headers.authorization && req.headers.authorization.startsWith('Bearer')) return next(new appError('please login to continue', 401))

    const token = req.headers.authorization.split(' ')[1]

    console.log(token)

    try {

        // get data from json web token

        const decode = await jwt.verify(token, process.env.JWT_SECRET)

        await db.query(`SELECT * FROM users WHERE id='${decode.id}'`, function (error, results, fields) {

            if (results.length == 0) return next(new appError('sorry user not found', 404))

            req.user = results

            console.log(req.user)
        })

        //temp for checking i am sending response to the user.
        res.send('success')

        //use next for this middleware after security checkups
        // next()
    }

    catch (err) {
        return next(new appError(err, 500))
    }

}
