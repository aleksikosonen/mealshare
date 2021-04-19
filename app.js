'use strict';

const express = require('express');
const app = express();
const userRoute = require('./routes/userRoute');

app.get('/', (req, res) =>{
    res.send('<h1>Hello world!</h1>')
});

app.post('/', (req, res) => {
    res.send();
});

app.use(express.json());


app.use('/user', userRoute);
app.use(express.static('public')); //Defining the public folder

const port = 3000
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});