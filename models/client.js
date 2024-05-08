const mongoose = require('mongoose')
const clientSchema = new mongoose.Schema({
    chatId: Number,
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
    total_price: {
        type: Number,
        default: 0
    }
})

module.exports = mongoose.model('Client', clientSchema)