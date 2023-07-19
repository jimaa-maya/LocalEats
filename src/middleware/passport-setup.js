const passport = require('passport');
let GoogleStrategy = require('passport-google-oauth20');
let FacbookStrategy = require('passport-facebook').Strategy;

const User = require('../models/users');
passport.use(
  new GoogleStrategy(
    {
      clientID:
        '1028148039521-e62nmqpog1g2dg8smpnbaotqgsfhsgbl.apps.googleusercontent.com',
      clientSecret: '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',
      callbackURL: 'http://localhost:3000/api/auth/google/callback',
    },
    async function (accessToken, refreshToken, profile, done) {
      let currentUser = await User.findOne({ user_id: profile._json.sub });
      //console.log('profile ',profile);
      try {
        if (!currentUser) {
          const newUser = await User.create({
            user_id: profile._json.sub,
            userName: profile._json.name,
            email: profile._json.email,
            profilePic: profile.photos[0].value,
            provider: 'google',
          });
          currentUser = newUser;
        }
      } catch (err) {
        console.log('error', err);
      }
      done(null, currentUser);
    }
  )
);

passport.use(
  new FacbookStrategy({
    clientID: process.env.FAPP_CLIENT_ID,
    clientSecret: process.env.FAPP_CLIENT_SECRET,
    callbackURL: 'http://localhost:3000/api/auth/facebook/callback',
    profileFields: ['id', 'displayName', 'name', 'gender','pic', 'email']
  },
  function(token , rereshToken, profile, done){
    
  })
);
