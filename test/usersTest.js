const mongoose = require(mongoose),
    User = require(./src/models/users);

const connStr = mongodb;
mongoose.connect(connStr, function(err) {
    if (err) throw err;
    console.log(Successfully connected to MongoDB);
});

// create a user a new user
const testUser = new User({
    userName: Abdurrahman,
    password: Password99;
});

// save user to database
testUser.save(function(err) {
    if (err) throw err;
})

// fetch user and test password verification
User.findOne({ userName: 'Abdurrahman' }, function(err, user) {
    if (err) throw err;

    // test a matching password
    user.comparePassword('Password99', function(err, isMatch) {
        if (err) throw err;
        console.log('Password123:', isMatch); // -> Password99: true
    });

    // test a failing password
    user.comparePassword('123Password', function(err, isMatch) {
        if (err) throw err;
        console.log('123Password:', isMatch); // -> 123Password: false
    });
});