const mongoose = require('mongoose');

const dishesSchema = mongoose.Schema({
  dish_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    unique: true,
    default: mongoose.Types.ObjectId,
  },
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    unique: true,
    ref: 'Users',
  },
  dishName: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  image_url: {
    type: Buffer,
  },
  price: {
    type: Number,
    required: true,
  },
  review: {
    type: [String],
    default: [],
  },
  dishType: {
    type: [String],
    required: true,
  },
});
module.exports = mongoose.model('Dishes', dishesSchema);
