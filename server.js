require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const MOVIEDEX = require('./movies-data-small.json');
const PORT = 8000;

const app = express();
app.use(morgan('dev'));

console.log('hello');

app.get('/', (req, res) => {
    res.send('GET request captured');
})


app.listen(PORT, () => {
    console.log(`Server listening at http://localhost:${PORT}`)
});