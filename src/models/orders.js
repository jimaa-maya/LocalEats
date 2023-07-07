const mongoose = require('mongoose');

const ordersSchema = new mongoose.Schema({
  Order_id: {
    type: mongoose.Schema.Types.ObjectId,
    default: mongoose.Types.ObjectId,
    unique: true,
  },
  User_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
     ref: 'User'
  },
  Dish_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Dishes'
  },
  Quantity: {
    type: Number,
    required: true
  },
  onanimationendrderStatus: {
    type: String,
    required: true
  },
  orderDate: {
    type: Date,
    default: Date.now,
    required: true
  },
  otherInfo: {
    type: String,
  }
},
{
  timestamps: true,
}
);

module.exports = mongoose.model('orders', ordersSchema);

 