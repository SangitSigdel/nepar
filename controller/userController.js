const db = require('../utils/database');
const appError = require('../utils/appError')
const jwt = require('jsonwebtoken')
const insertSql = require('./mysql/query');
const catchAsync = require('../utils/catchAsync');

//sign json web token
const signJwt = async (id)=>{
    return await jwt.sign({id},process.env.JWT_SECRET,{
        expiresIn: process.env.JWT_EXPIRES_IN
    })
}

//create a new user if doesn't exist

const createUser =catchAsync(async (req, res, next) => {

    const {name,login_id, provider, token,user_type,profile_pic,password,contact} = req.body;

    var nepar_user_query_result,vendor_customer_query_result

    var nepar_user_post = {
        name:name,
        login_id:login_id,
        provider:provider,
        token:token,
        profile_pic:profile_pic,
        password:password,
        contact:contact,
        user_type:user_type
    }

    //req.query is for the query to send globally to any modules and next is for sending error to global app error handler, post is the required fields for query

    req.query = `INSERT INTO nepar_users SET ?`

   await insertSql.query_data (req,next,nepar_user_post)
    .then(async rows=>{
        nepar_user_query_result=rows

        if(user_type=='vendor'){
            var post_vendor = {
                nepar_user_id: nepar_user_query_result.insertId,
                description: req.body.description,
                cover_pic: req.body.cover_pic,
                ratings: req.body.ratings,
                lat: req.body.lat,
                lng: req.body.lng
            }

        req.query = `INSERT INTO vendor_info SET ?`
            return await insertSql.query_data(req,next,post_vendor)
        }

        else if(user_type=='customer'){

            var post_customer = {
                nepar_user_id: nepar_user_query_result.insertId,
                description: req.body.description,
                created_at: req.body.created_at,
            }

            req.query = `INSERT INTO customer_info SET ?`
            return await insertSql.query_data(req, next, post_customer)
        }
    }).then(async rows=>{

        const token =await signJwt(nepar_user_query_result.insertId)
        res.status(200).json({
            status:'success',
            token
        })
    },err=>{
           //if any error or rejection of promise during the first query then delete the created user in nepar_users and returns the error to the response
            req.query = `DELETE FROM nepar_users WHERE id=${nepar_user_query_result.insertId}`
            insertSql.query_data(req,next,'')
            return next(new appError(err,500))
    })
})

exports.createUser = createUser;

exports.loginUser = async (req,res,next)=>{

    const {provider,token,login_id}= req.body

    await db.query(`SELECT id,provider from nepar_users WHERE login_id='${login_id}'`, async function (err, result, fields) {
        
        if (err) return next(new appError(err, 500))

        if (result.length == 0) {

            createUser(req, res, next);

        }

        else {
        
            if(!(provider=='facebook'||provider=='gmail'||provider=='email')) return next(new appError('please enter valid provider facebook,gmail or email',401))
            
                const db_provider = result[0].provider
                
                if(db_provider!=provider) return next(new appError('please specify the correct provider for the login_id'))

                if (provider == 'facebook' || provider == 'gmail') {


                    //verify facebook and gmail token
                    //lets imaging the facebook or gmail token is verified and we got user id from it, for now i will get facebook id from the body of the request but later i should get it from the access token
                    //get facebook id
                    //search if facebook id exists in database
                    //if it exists generate login token  in response
                    //if not signup user and create one..
                    //for every request pass the jwt that has been generated..
                    const token = await signJwt(result[0].id)
                    res.status(200).json({
                        status: 'success',
                        user_id: result[0].id,
                        token
                    })

            }

            else if (provider == 'email') {

                // check for email and password exists in the database
                // if not response sorry username or password mistake if you forgot your password please signup or reset your password..

            }
        }

    })

    
        
}
