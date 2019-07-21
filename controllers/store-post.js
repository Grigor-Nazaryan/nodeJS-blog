const Post = require('../database/models/Post')
const cloudinary = require('cloudinary')
const path = require('path')


module.exports = (req, res) => {
    const { image } = req.files
    const uploadPath = path.resolve(__dirname, '..', 'public/posts', image.name)
    image.mv(uploadPath, (error) => {
        cloudinary.v2.uploader.upload(uploadPath, (error, result) => {
            if(error) {
                return res.redirect('/')
            }
            Post.create({
                ...req.body,
                image: result.secure_url,
                author: req.session.userId
            }, (error, post) => {
                res.redirect("/")
            })
        })
    })  
} 