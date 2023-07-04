const mongoose = require('mongoose');

const dishesSchema = mongoose.Schema({
  Dish_id: {
    type: Number,
    required: true,
    unique: true,
  },
  User_id: {
    type: Number,
    required: true,
    unique: true,
  },
  dishName: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  image_url: {
    type: String,
  },
  price: {
    type: Number,
    required: true,
  },
  review: {
    type: [String],
  },
});
module.exports = mongoose.model('Dishes', dishesSchema);
