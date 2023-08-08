const mongoose = require("mongoose");
const bcrypt = require("bcryptjs")
const SALT_COST_FACTOR = 10; //salt rounds

Schema = mongoose.Schema;

const addressSchema = new Schema({
  /*address_id: {
    type: String,
    default: function () {
      return new mongoose.Types.ObjectId().toHexString();
    },
    unique: true,
  },*/
  apartmentNo: {
    //Not required since might be a house (no apartment number).
    type: Number,
  },
  streetNo: {
    type: Number,
  },
  buildingNo: {
    //building or house number.
    type: Number,
    
  },
  city: {
    type: String,
    
  },
  country: {
    type: String,
    
  },
});

const userSchema = new Schema(
  {
    user_id: {
      type: String,
      default: function () {
        return new mongoose.Types.ObjectId().toHexString();
      },
      unique: true,
    },
    userName: {
      type: String,
      required: [true, "User name must not be empty"],
      minlength: [4, 'Username must have more than 4 letters.'],
      index: { unique: true }, // Create an index for faster lookup and enforce uniqueness
    },
    email: {
      type: String,
      required: [true, "Email must not be empty"],
      unique: [true, 'This email already used.'],
      validate: {
        validator: function (value) {
          // Custom validation for the email field
          // Check if it's a valid email format
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          return emailRegex.test(value);
        },
        message: 'The email should be a valid email format',
      },
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      validate: {
        validator: function (value) {
          // Custom validation for the password field
          // Check if it contains at least one number, one uppercase letter, one lowercase letter, and at least 5 characters long
          const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{5,}$/;
          return passwordRegex.test(value);
        },
        message: 'Password must contain at least one number, one uppercase letter, one lowercase letter, and be at least 5 characters long.',
      },
    },
    address: {
      type: addressSchema, // Use the addressSchema as the type for the address field
    },
    phoneNumber: {
      type: Number,
    },
    provider: {
      type: String,
    },
    profilePic: {
      type: Buffer, // Store binary data, such as an image, in the profilePic field
    },
    role: {
      type: String,
      default: '',
    },
},  {
    timestamps: true,
  }
);

/*=======================
    PASSWORD HASHING
=========================*/

//Run this before any user document is saved or changed
userSchema.pre('save', function (next) { 
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
  userSchema.methods.comparePassword = function(candidatePassword, cb) {
    bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
        if (err) return cb(err);
        cb(null, isMatch);
    });
};

// Create a model named 'user' using the user schema
module.exports = mongoose.model('User', userSchema);
