const mongoose = require('mongoose')

const tovarSchema = new mongoose.Schema({
    image: String,
    price: Number,
    title: String,
    viewers: Number ,
    numbers: Number ,
    desc: String ,
    category: String,
    rating: Number,
    spece_code: Number
})

module.exports = mongoose.model('Product', tovarSchema)