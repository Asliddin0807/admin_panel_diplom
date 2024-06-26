const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  chatId: String,
  user_name: String,
  phone_number: String,
  date: String,
  time: String,
  code: String,
  status: {
    type: String,
    default: "Order",
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
    },
  ],
  total_price: Number,
  isRead: {
    type: Boolean,
    default: false,
  },
});

module.exports = mongoose.model("Message", messageSchema);
