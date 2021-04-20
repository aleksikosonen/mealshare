'use strict';

const express = require('express');
const app = express();
const userRoute = require('./routes/userRoute');
const authRoute = require('./routes/authRoute');
const passport = require('./utils/pass');
require('./utils/pass');
const port = 3000

app.use(express.urlencoded({ extended: true }))
app.use(express.json());
app.use('/auth', authRoute);
app.use('/user', passport.authenticate('jwt', {session:false}),  userRoute);
app.use('/login', passport.authenticate('jwt', {session:false}),  authRoute);
app.use(express.static('public')); //Defining the public folder

app.get('/', (req, res) =>{
    res.send('<h1>Hello world!</h1>')
});


app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});