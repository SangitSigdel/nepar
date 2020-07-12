const multer = require("multer")
const sharp = require('sharp')

const catchAsync =  require('../utils/catchAsync')

const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image')) {
        cb(null, true)
    } else {
        cb(new appError('not an image please upload image file', 400), false);
    }

}

exports.uploadImage = multer({
    storage: multerStorage,
    fileFilter: multerFilter
})

// exports.uploadImage = upload.array('images',3)

exports.resizeImage =catchAsync(async(req, next,width,height,quality,file_path) => {

    req.body.images = [];

    if (!req.files) return next()

    await Promise.all(req.files.map(async (file, i) => {
        const filename = `${Date.now()}-${i + 1}.jpeg`
        await sharp(file.buffer, { failOnError: false }).resize(width,height).toFormat('jpeg').jpeg({ quality: quality }).toFile(`${file_path}/${filename}`)
        req.body.images.push(filename)
    })
    );

})
