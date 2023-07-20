const mongoose = require('mongoose');

const reviewSchema = mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Users',
    },
    content: {
      type: String,
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1, // Minimum rating value
      max: 5, // Maximum rating value
    },
  },
  { _id: false, timestamps: true }
);

const dishesSchema = mongoose.Schema(
  {
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
      type: [reviewSchema], // Array of review objs
      default: [],
    },
    rating: {
      type: Number,
      default: 0, // Default rating to 0
      min: 0,
      max: 5,
    },
    dishType: {
      type: [String],
      required: true,
    },
    preferences: {
      type: [String],
      default: [],
    },
  },
  { timestamps: true }
);
module.exports = mongoose.model('Dishes', dishesSchema);
