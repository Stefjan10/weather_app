const mongoose = require('mongoose')
const Schema = mongoose.Schema

const categorySchema = new Schema({

    categoryname: {

        type: String,
        required: true

    }

},{timestamps: true})

module.exports = mongoose.model('Category', categorySchema, 'categories')