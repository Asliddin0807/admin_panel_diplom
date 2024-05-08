const mongoose = require("mongoose");

const archive = new mongoose.Schema({
  spaceId: String,
  chatId: String,
  user_name: String,
  phone_number: String,
  date: String,
  time: String,
  code: String,
  status: {
    type: String,
    default: "Pending",
  },
  message: [
    {
      date: String,
      time: String,
      product_name: String,
      product_image: String,
      product_price: Number,
      product_count: Number,
      code: String,
      product_desc: String,
      isDelevering: {
        type: Boolean,
        default: false
      }
    },
    
  ],
  total_price: Number,
  isRead: {
    type: Boolean,
    default: true,
  },
});


module.exports = mongoose.model('Archive', archive)