const mongoose = require('mongoose');

const ordersSchema = new mongoose.Schema({
  order_id: {
    type: mongoose.Schema.Types.ObjectId,
    default: mongoose.Types.ObjectId,
    unique: true,
  },
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
     ref: 'User'
  },
  dish_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Dishes'
  },
  quantity: {
    type: Number,
    required: true
  },
  orderStatus: {
    type: String,
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

module.exports = mongoose.model('Orders', ordersSchema);

