const mongoose = require('mongoose')
const Schema = mongoose.Schema

const productSchema = new Schema({

    productname: {
        type: String,
        required: [true, 'Navn på produkt er påkrævet']
    },
    price: {
        type: Number,
        required: [true, 'Pris på produkt er påkrævet']
    },
    description: {
        type: String,
        required: [true, 'Description på produkt er påkrævet'] // En lang beskrivelse
    },
    coverimage: {
        type: String,
        required: [true, 'Cover image på produkt er påkrævet']
    },
    gallery: [
        {type: String}
    ],
    ISBN: {
        type: String,
    },
    udgivet: {
        type: String,
    },
    rating: {
        type: Number,
        min: [1, 'Minimum 2 i rating'],
        max: [5, 'Maximum 5 i rating'],
        default: 3
    }

})

module.exports = mongoose.model('Product', productSchema, 'products')