const mongoose = require('mongoose');

const ordersSchema = new mongoose.Schema({
  user_id: {
    type: String,
    required: true,
     ref: 'User',
  },
  dish_id: {
    type: String,
    required: true,
    ref: 'Dishes',
  },
  quantity: {
    type: Number,
    required: true,
    default: 1,
  },
  orderStatus: {
    type: String,
    enum: ['active', 'inactive', 'completed'],
    default: 'active',
  },
  otherInfo: {
    type: String,
  }
},
{
  timestamps: true,
}
);

module.exports = mongoose.model('Orders', ordersSchema);