const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema(
    {
        cart_id: {
            type: mongoose.Schema.Types.ObjectId,
            default: mongoose.Types.ObjectId,
            unique: true,
        },
        user_id: {
            type: mongoose.Schema.Types.ObjectId,
            required: false,
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


const cart = await Cart.findOne({
    user_id: null,
});

if (cart) {
    cart.user_id = user.id;
    cart.save();
}
