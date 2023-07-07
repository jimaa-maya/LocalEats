const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema(
    {
        cart_id: {
            type: mongoose.shcema.Types.ObjectId,
            required: mongoose.Types.ObjectId,
            unique: true,
        },
        user_id: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User',
        },
        dish_id: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'Dishes',
        },
        quantity: {
            type: Number,
            required: true,
        },
        status: {
            type: String,
            enum: ['active', 'inactive', 'completed'],
            default: 'active',
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('Cart', cartSchema);
