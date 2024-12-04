const express = require('express')
const app = express()

// ENV
require('dotenv').config()

// GET request til serveren

app.get("/", async (req, res)=>{
    res.status(200).json( { message: "Velkommen til serveren ♡" } )
})

//DATABASE CONNECTION
const mongoose = require('mongoose')
mongoose.connect(process.env.DB_URL, {})
const db = mongoose.connection
db.on('error', (error) => console.log(error))
db.once('open', () => console.log("/// ૮꒰ ˶• ༝ •˶꒱ა her er databasen ♡"))

// CORS - cross origin ressource sharing
const cors = require('cors')
app.use(cors({credentials: true, origin: true}))

//Giv adgang til filer / images i public mappen
app.use(express.static('public'))

// så serveren kan modtage body-data som json eller som url-encoded
app.use(express.json())
app.use(express.urlencoded({extended: true}))

// SESSION
const session = require('express-session')
const MongoStore = require('connect-mongo')

// 1k millisekunder * 60 sekunder * 60 minutter * 24 timer * 5 dage
const expire = 1000 * 60 * 60 * 24 * 5
app.use(session({
    name: process.env.SESSION_NAME,
    resave: true,
    rolling: false,
    saveUninitialized: false,
    store: MongoStore.create({mongoUrl: process.env.DB_URL}),
    secret: process.env.SESSION_SECRET,
    cookie: {
        maxAge: expire,
        sameSite: "strict", // 'none' kræver https.... 'lax' virker kun ved GET metoder
        secure: process.env.NODE_ENV === 'production',
        httpOnly: false
    }
}))

// APP
app.use(express.json())
app.use(express.urlencoded({extended: true}))

// ROUTES
app.use('/users', require('./routes/user.routes'))
app.use('/categories', require('./routes/category.routes'))
app.use('/events', require('./routes/event.routes'))
app.use('/openinghours', require('./routes/openinghour.routes'))
app.use('/contacts', require('./routes/contact.routes'))
app.use('/products', require('./routes/product.routes'))


// Lyt på serverens port
app.listen(process.env.PORT, () => {
    console.log("/// Lytter på port: ♡ " + process.env.PORT + " ♡")
})