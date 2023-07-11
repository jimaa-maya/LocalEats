const mongoose = require("mongoose");
const bcrypt = require("bcryptjs")
const SALT_COST_FACTOR = 10; //salt rounds
Schema = mongoose.Schema;

const addressSchema = new Schema({
    address_id: {
        type: Schema.Types.ObjectId,
        required: true,
        unique: true,
        default: mongoose.Types.ObjectId // Generate a new ObjectId by default
    },
    user_id: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'user', //refrencing the address to the user. 
    },
    buildingNo: { //building or house number.
        type: Number,
        required: true,
    },
    apartmentNo: { //Not required since might be a house (no apartment number). 
        type: Number, 
    },
    street: {
        type: String,
        required: true,
    },
    city: {
        type: String,
        required: true,
    },
    province: {
        type: String,
        required: true,
    },
    country: {
        type: String,
        required: true,
    }
},  {
        timestamps: true,
});


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
        type: addressSchema, // Use the addressSchema as the type for the address field
        required: true,
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
},  {
    timestamps: true,
});

/*=======================
    PASSWORD HASHING
=========================*/

//Run this before any user document is saved or changed
userSchema.pre(save, function (next) { 
    const user = this
  
    //Check whether or not the password is new and needs to be hashed
    if (user.isModified("password") || this.isNew) { 
      bcrypt.genSalt(SALT_COST_FACTOR, function (saltError, salt) {
        if (saltError) {
          return next(saltError);
        } else {
          bcrypt.hash(user.password, salt, function(hashError, hash) {
            if (hashError) {
              return next(hashError);
            }
  
            // override the cleartext password with the hashed one
            user.password = hash;
            next();
          });
        }
      });
    } 
  });

  //Hashed Password Verification
  UserSchema.methods.comparePassword = function(candidatePassword, cb) {
    bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
        if (err) return cb(err);
        cb(null, isMatch);
    });
};

// Create a model named 'user' using the user schema
module.exports = mongoose.model('User', userSchema);