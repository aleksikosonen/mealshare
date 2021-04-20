'use strict';

const express = require('express');
const app = express();
const userRoute = require('./routes/userRoute');
const authRoute = require('./routes/authRoute');

app.use(express.urlencoded({ extended: true }))
app.use(express.json());
app.use('/user', userRoute);
app.use('/auth', authRoute);
app.use(express.static('public')); //Defining the public folder

app.get('/', (req, res) =>{
    res.send('<h1>Hello world!</h1>')
});

const port = 3000
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});