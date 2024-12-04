const express = require('express')
const router = express.Router()

// Hent modellen
const User = require('../models/user.model')

//Form data
const formData = require('express-form-data')
router.use(formData.parse())

// Signup - opret ny bruger
router.post( '/signup', async (req, res) => {

    console.log("signup - opret en ny bruger")

    try {
        
        const user = await User.signup(req.body.email, req.body.password, req.body.username)
        res.status(201).json({user: user})

    } catch (error) {

        res.status(400).json({error: 'Der er opstået en fejl: ' + error.message})
        
    }

} )

// Login
router.post( '/login', async (req, res) => {

    console.log("login - bruger")

    try {
        
        const user = await User.login(req.body.username, req.body.password)

        // login er godkendt = tilføj cookie med brugers ID i
        req.session.userId = user._id

        res.status(200).json({username: user.username})

    } catch (error) {

        res.status(400).json({error: 'Der er opstået en fejl: ' + error.message})
        
    }

} )

//Log out
router.get( '/logout', async (req, res) => {

    console.log("Logout - bruger")

    req.session.destroy(err => {
        if(err) return res.status(500).json({message: "Logud mislykkedes"})
        res.clearCookie(process.env.SESSION_NAME).json({message: "Du er logget ud ♡"})
    })

} )


module.exports = router