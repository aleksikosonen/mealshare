'use strict';

const express = require('express');
const app = express();

app.get('/', (req, res) =>{
    res.send('<h1>Hello world!</h1>')
});

app.post('/', (req, res) => {
    res.send();
});

app.use(express.static('public')); //Defining the public folder

const port = 3000
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});