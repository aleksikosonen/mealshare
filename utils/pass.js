/**
 * Js-file for local / jwt strategy to login
 *
 *
 * @Author Aleksi Kytö, Niko Lindborg, Aleksi Kosonen
 * */

'use strict';
const passport = require('passport');
const bcrypt = require('bcryptjs');
const Strategy = require('passport-local').Strategy;
const userModel = require('../models/userModel');
const passportJWT = require('passport-jwt');
const JWTStrategy = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;

// local strategy for username password login
passport.use(new Strategy(
    async (username, password, done) => {
      const params = [username];
      try {
        const [user] = await userModel.getUserLogin(params);
        if (user === undefined) {
          return done(null, false, {message: 'Incorrect credentials.'});
        }

        if (!await bcrypt.compare(password, user.password)) {
          return done(null, false, {message: 'Incorrect credentials.'});
        }
        delete user.password;
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
        const [user] = await userModel.getUser(jwtPayload.userId);
        delete user.password;
        return done(null, user);
      } catch (err) {
        return done(err);
      }
    },
));

module.exports = passport;