/**
 * Js-file for assigning routes
 *
 *authenticate for user / some post routes
 *
 * @Author Aleksi Kytö, Niko Lindborg, Aleksi Kosonen
 * */

'use strict';

require('dotenv').config();
const express = require('express');
const app = express();
const userRoute = require('./routes/userRoute');
const authRoute = require('./routes/authRoute');
const postRoute = require('./routes/postRoute');
const passport = require('./utils/pass');
app.enable('trust proxy');

app.use(express.static('public'));
app.use(express.static('uploads'));
app.use('/thumbnails', express.static('thumbnails')); // Define thumbnails folder

app.use(express.urlencoded({ extended: true }))
app.use(express.json());

app.use ((req, res, next) => {
    if (req.secure) {
      // request was via https, so do no special handling
      next();
    } else {
      const proxypath = process.env.PROXY_PASS || ''
      // request was via http, so redirect to https
      res.redirect(301, `https://${req.headers.host}${proxypath}${req.url}`);
    }
  });

app.use('/auth', authRoute);
app.use('/user', passport.authenticate('jwt', {session:false}),  userRoute);
app.use('/post', passport.authenticate('jwt', {session:false}), postRoute);


const port = 3000;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});