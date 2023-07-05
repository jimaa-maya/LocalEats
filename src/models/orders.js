const mongoose = require('mongoose');

const ordersSchema = new mongoose.Schema({
  Order_id: {
    type: Number,
    required: true
  },
  User_id: {
    type: mongoose.Schema.Types.ObjectId,
     required: true,
     ref: 'User'
  },
  Dish_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Dish'
  },
  Quantity: {
    type: Number,
    required: true
  },
  Order_status: {
    type: String,
    required: true
  },
  Order_date: {
    type: String,
    required: true
  },
  Other_info: {
    type: String,
  }
});

module.exports = mongoose.model('orders', ordersSchema);

 