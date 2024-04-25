const mongoose = require('mongoose')
const adminSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String,
    isAdmin: {
        type: Boolean,
        default: true
    },
    full_Access: {
        type: Boolean,
        default: false
    }
})

module.exports = mongoose.model('Admin', adminSchema)