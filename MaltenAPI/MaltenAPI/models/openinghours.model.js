const mongoose = require('mongoose')
const Schema = mongoose.Schema

// Model, opsætning af data
const openinghourSchema = new Schema({

    //Overskrift på arrangement
    location: {
        type: String,
        required: true
    },
    openinghours: {
        type: String,
        required: true
    },
    information: {
        type: String,
    },
    address: {
        type: String,
        required: true
    },
    social: {
        type: String
    }

})

module.exports = mongoose.model('Openinghour', openinghourSchema, 'openinghour')