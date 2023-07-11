
const passport = require('passport');
let GoogleStrategy = require('passport-google-oauth20');

const User = require('../models/users');
passport.use(
  new GoogleStrategy(
    {
      clientID: '1028148039521-e62nmqpog1g2dg8smpnbaotqgsfhsgbl.apps.googleusercontent.com',
      clientSecret: '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',
      callbackURL: 'http://localhost:3000/api/auth/google/callback',
    },
    async function (accessToken, refreshToken, profile, done) {
      const user = {
        name: profile.displayName,
        email: profile.emails[0].value,
        providerId: profile.id,
        avatar: profile.photos[0].value,
      };
      console.log('userrrrr', typeof user.providerId);
      
      
        done(null, user);
      
    }
  )
);
