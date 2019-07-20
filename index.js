require('dotenv').config()
const express = require('express');
const expressEdge = require('express-edge');
const bodyParser = require('body-parser');
const connectDB = require('./database/db');
const mongoose = require('mongoose')
const port = process.env.PORT
const fileUpload = require('express-fileupload') ;
const createPostController = require('./controllers/create-post');
const homePageController = require('./controllers/home-page');
const storePostController = require('./controllers/store-post');
const getPostController = require('./controllers/get-post');
const createUserController = require('./controllers/create-user');
const storeUserController = require('./controllers/store-user')
const loginController = require('./controllers/login')
const loginUserController = require('./controllers/login-user')
const expressSession = require('express-session')
const connectMongo = require('connect-mongo')
const connectFlash = require('connect-flash')
const edge = require('edge.js')
const logoutController = require('./controllers/logout')
const cloudinary = require('cloudinary')


// Connect Database
connectDB()

const app = new express()

app.use(connectFlash())
cloudinary.config({
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    cloud_name: process.env.CLOUDINARY_NAME
})

const mongoStore = connectMongo(expressSession)

app.use(expressSession({
    secret: process.env.EXPRESS_SESSION_KEY,
    store: new mongoStore({
        mongooseConnection: mongoose.connection
    })
}))


app.use(fileUpload())
app.use(express.static('public'))
app.use(expressEdge)
app.set('views', `${__dirname}/views`)

app.use('*', (req, res, next) => {
    edge.global('auth', req.session.userId)

    next()
})

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const storePost = require('./middleware/storePost')
const auth = require('./middleware/auth')
const redirectIfAuthentificated = require('./middleware/redirectIfAuthentificated')


app.get('/', homePageController)
app.get('/post/:id', getPostController)
app.get('/auth/logout', auth, logoutController)
app.get('/posts/new', auth, createPostController)
app.post('/posts/store', auth, storePost, storePostController)
app.get('/auth/login', redirectIfAuthentificated, loginController)
app.post('/users/login', redirectIfAuthentificated, loginUserController)
app.get('/auth/register', redirectIfAuthentificated, createUserController)
app.post('/users/register', redirectIfAuthentificated, storeUserController)
app.use((req, res) => res.render('not-found'))


app.listen(port, () => console.log('App listening on port', port))