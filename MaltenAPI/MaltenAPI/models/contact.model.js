const mongoose = require('mongoose')
const Schema = mongoose.Schema

const contactSchema = new Schema({

    contactimage: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    position: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    number: {
        type: String,
        required: true
    }

})

module.exports = mongoose.model('Contact', contactSchema, 'contacts')