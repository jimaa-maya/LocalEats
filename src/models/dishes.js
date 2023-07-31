const mongoose = require('mongoose');

const reviewSchema = mongoose.Schema(
  {
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
      unique: true,
      // no need to set a default here
    },
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Users',
    },
    dishName: {
      type: String,
      required: [true, 'Dish name is required'],
    },
    description: {
      type: String,
    },
    image_url: {
      type: Buffer,
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
    },
    review: {
      type: [reviewSchema], // Array of review objs
      default: [],
    },
    dishType: {
      type: [String],
      required: [true, 'Dish type is required'],
    },
    preferences: {
      type: [String],
      default: [],
    },
  },
  { timestamps: true }
);

// pre-save middleware to generate dish_id b4 saving
dishesSchema.pre('save', function (next) {
  if (!this.dish_id) {
    this.dish_id = mongoose.Types.ObjectId();
  }
  next();
});

module.exports = mongoose.model('Dishes', dishesSchema);
