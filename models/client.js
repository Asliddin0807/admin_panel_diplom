const mongoose = require('mongoose')
const clientSchema = new mongoose.Schema({
    chatId: String,
    name: String,
    phone_number: String,

    cart: [
        {
            id: String,
            title: String,
            image: String,
            desc: String,
            viewers: Number,
            price: Number,
            category: String,
        }
    ],
    total_price: Number
})

module.exports = mongoose.model('Client', clientSchema)