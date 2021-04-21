'use strict';
const passport = require('passport');
const Strategy = require('passport-local').Strategy;
const userModel = require('../models/userModel');
const passportJWT = require('passport-jwt');
const JWTStrategy = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;

// local strategy for username password login
passport.use(new Strategy(
    async (username, password, done) => {
      const params = [username];
      console.log('passport.use, ',params);
      try {
        const [user] = await userModel.getUserLogin(params);
        console.log('Local strategy', user); 
        if (user === undefined) {
          return done(null, false, {message: 'Incorrect credentials.'});
        }
        if (user.password !== password) {
          return done(null, false, {message: 'Incorrect credentials.'});
        }
        delete user.password; // delete password
        return done(null, {...user}, {message: 'Logged In Successfully'}); 
      } catch (err) {
        return done(err);
      }
    }));

passport.use(new JWTStrategy({
      jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
      secretOrKey: 'secretkey',
    },
    async (jwtPayload, done) => {

      try {
        const user = await userModel.getUser(jwtPayload.userId);
        return done(null, user);
      } catch (err) {
        return done(err);
      }
    },
));

module.exports = passport;