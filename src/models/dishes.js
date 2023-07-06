const mongoose = require('mongoose');

const dishesSchema = mongoose.Schema({
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
});
module.exports = mongoose.model('Dishes', dishesSchema);
