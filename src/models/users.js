const mongoose = require("mongoose");
Schema = mongoose.Schema;

const userSchema = new Schema({
    user_id: {
        type: Schema.Types.ObjectId,
        required: true,
        unique: true,
        default: mongoose.Types.ObjectId // Generate a new ObjectId by default
    },
    userName: {
        type: String,
        required: true,
        index: { unique: true } // Create an index for faster lookup and enforce uniqueness
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    address: { 
        type : Array, 
        default: [] // Set a default empty array for the address field
    },
    phoneNumber: {
        type: Number,
        required: true,
    },
    profilePic: {
        type: Buffer, // Store binary data, such as an image, in the profilePic field
    },
    profileType: {
        type: String,
        required: true,
    },

});

// Create a model named 'user' using the user schema
module.exports = mongoose.model('user', userSchema);