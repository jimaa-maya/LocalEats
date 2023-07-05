const mongoose = require("mongoose");
Schema = mongoose.Schema;

const userSchema = new Schema({
    user_id: {
        type: Number,
        required: true,
        unique: true,
    },
    userName: {
        type: String,
        required: true,
        index: { unique: true }
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
        type : Array , "default" : [] 
    },
    phoneNumber: {
        type: Number,
        required: true,
    },
    profilePic: {
        type: Blob,
    },
    profileType: {
        type: String,
        required: true,
    },

});

module.exports = mongoose.model('user', userSchema);