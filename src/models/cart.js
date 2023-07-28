const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema(
    {
        
        user_id: {
            type: String,
        },
        dish_id: {
            type: String,
        },
        quantity: {
            type: Number,
            required: true,
            min: [1, 'Quantity must be at least 1'], 
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


