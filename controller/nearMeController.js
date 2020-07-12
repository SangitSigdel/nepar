const catchAsync = require('../utils/catchAsync')
const appError = require('../utils/appError')
const query = require('../controller/mysql/query')

exports.getNearByMe = catchAsync(async (req,res,next)=>{

    if(!req.body.lat || !req.body.lng) return next (new appError('please provide current lat and lng of device',400))

    const distance = req.body.distance || 25


    req.query = `SELECT * FROM (SELECT *,(((acos(sin((${req.body.lat}*pi()/180)) * 
                    sin((lat*pi()/180))+cos((${req.body.lat}*pi()/180)) * 
                    cos((lat*pi()/180)) * cos(((${req.body.lng}- lng)* 
                    pi()/180))))*180/pi())*60*1.1515 )*2.348417721 as distance 
                    FROM vendor_info having distance<${distance} limit 0,10) as X 
                    ORDER BY distance asc;`
    await query.query_data(req,next).then(fields=>{

        res.status(200).json({
            status:'success',
            data: fields
        })
    })
    
})
