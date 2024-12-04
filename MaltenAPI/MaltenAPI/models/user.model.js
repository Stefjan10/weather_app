const mongoose = require('mongoose')
const Schema = mongoose.Schema

const bcryptjs = require('bcryptjs')
const validator = require('validator')

// Model, opsætning af data
const userSchema = new Schema({

    username: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    }

})

// SIGN UP
userSchema.statics.signup = async function ( email, password, username ) {

    console.log( "model", username )

    // validation - tjek om alt er udfyldt
    if ( !email || !password || !username ) throw Error( 'All fields must be filled' )

    // validator - tjek om email opfylder reglerne for en email og om password er stærkt
    if ( !validator.isEmail( email ) ) throw Error( 'Email is not valid' )
    if ( !validator.isStrongPassword( password ) ) throw Error( 'Password is not strong enough' )

    // tjek om email allerede findes i db
    const exists = await this.findOne( { email: email } )

    // ... og hvis email allerede findes = stop/error
    if ( exists ) {
        throw Error( 'Email already in use' )
    }

    const salt = await bcryptjs.genSalt( 10 )//.genSalt( 10 )
    const hash = await bcryptjs.hash( password, salt ) //.hash( password, salt )

    // GEM BRUGER I DB
    const user = await this.create( { email, username, password: hash } )

    return user
}

// --- LOGIN - tjekker om bruger er valid og sammenligner krypteret pw 
userSchema.statics.login = async function ( username, password ) {

    // validation
    if ( !username || !password ) throw Error( 'Alle felter skal udfyldes' )

    // findes email i db - hvis ikke så slut her
    const user = await this.findOne( { username: username } ) // eller bare {email}

    // validation - stop hvis email ikke findes
    if ( !user ) {
        throw Error( 'Incorrect email' )
    }

    // Tjek om indtastet password (krypteret) matcher (krypteret) password på bruger fundet i databasen
    const match = await bcryptjs.compare( password, user.password )

    // hvis der ikke er match - password matcher ikke - farvel og tak!
    if ( !match ) {
        throw Error( 'Beklager - forkert password' )
    }

    // ... og ellers returner user til route
    return user
}

module.exports = mongoose.model('User', userSchema, 'users')