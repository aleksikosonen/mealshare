/**
 * Js-file for assigning routes
 *
 *authenticate for user / some post routes
 *
 * @Author Aleksi Kytö, Niko Lindborg, Aleksi Kosonen
 * */

'use strict';

const express = require('express');
const app = express();
const userRoute = require('./routes/userRoute');
const authRoute = require('./routes/authRoute');
const postRoute = require('./routes/postRoute');
const passport = require('./utils/pass');

app.use(express.static('public'));
app.use(express.static('uploads'));
app.use('/thumbnails', express.static('thumbnails')); // Define thumbnails folder

app.use(express.urlencoded({ extended: true }))
app.use(express.json());


app.use('/auth', authRoute);
app.use('/user', passport.authenticate('jwt', {session:false}),  userRoute);
app.use('/post', passport.authenticate('jwt', {session:false}), postRoute);


const port = 3000;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});