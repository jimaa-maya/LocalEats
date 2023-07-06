const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
    cart_id: {
        type: String,
        required: true,
        unique: true
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
    addedDate: {
        type: Date,
        default: Date.now
    },
    status: {
        type: String,
        enum: ['active', 'inactive', 'completed'],
        default: 'active'
    }
});

module.exports = mongoose.model("cart", cartSchema);
