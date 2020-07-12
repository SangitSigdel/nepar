
const handleDevelopmentError= (err,res)=>{

    res.status(err.statusCode).json({
        status:err.status,
        message:err.message,
        err,
        stack: err.stack
    })

}

const handleProductionError = (err,res)=>{

    if(err.isOperational){
        res.status(err.statusCode).json({
            status: err.status,
            message: err.message
        })
    }
    else{
        console.log(er)
        res.status(500).json({
            message:'Internal Server Error'
        })
    }

    
}

module.exports = (err,req,res,next)=>{

    err.statusCode = err.statusCode || 500
    err.status = err.status || 'error'

    if(process.env.NODE_ENV==='development') handleDevelopmentError(err,res);

    else if(process.env.NODE_ENV==='production') handleProductionError(err,res);

}