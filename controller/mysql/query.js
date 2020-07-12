const db = require('../../utils/database')
const appError = require('../../utils/appError')
exports.query_data = (req,next,...post)=>{

    return new Promise(function(resolve,reject){
            db.query(req.query, post, function (err, result, fields) {
                if (err)return reject(err);
                resolve(result)
            })
        })
}