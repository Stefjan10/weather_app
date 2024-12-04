const mongoose = require('mongoose')
const Schema = mongoose.Schema

// Model, opsætning af data
const eventSchema = new Schema({

    //Overskrift på arrangement
    heading: {
        type: String,
        required: true
    },
    eventimage: {
        type: String,
        required: true
    },
    date: {
        type: String,
        required: true
    },
    time: {
        starttime: {
            type: String,
            required: true
        },
        endtime: {
            type: String,
        },
    },
    location: {
        type: String,
        required: true
    },
    category: {
        type: mongoose.Schema.ObjectId,
        ref: 'Category',   
        required: true
    },
    description: {
        type: String,
        required: true
    }

})

module.exports = mongoose.model('Event', eventSchema, 'events')