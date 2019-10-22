require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const cors = require('cors');
const MOVIEDEX = require('./movies-data-small.json');
const PORT = process.env.PORT || 8000;
const morganSetting = process.env.NODE_ENV === 'production' ? 'tiny' : 'dev';

const app = express();
app.use(morgan(morganSetting));
app.use(helmet());
app.use(cors());

app.use(function validateBearerToken(req, res, next) {
    const apiToken = process.env.API_TOKEN;
    const authToken = req.get('Authorization');

    if(!authToken || authToken.split(' ')[1] !== apiToken) {
       return res.status(401).json({error: "Unauthorized request"})
    };

    next();
})

app.use((error, req, res, next) => {
    let response;
    if (process.env.ENV_NODE === 'production') {
        response = {error: {message: 'server error'}}
    } else {
        response = {error}
    };
    res.status(500).json(response);
})

app.get('/movie', (req, res) => {
    const {genre, country, avg_vote} = req.query;
    let results = MOVIEDEX;
    if(genre) {
       const genreFormatted = String(genre).toLowerCase().trim();
       results = results.filter(movie => movie.genre.toLowerCase().includes(genreFormatted));
        
       if(results.length === 0) {
            return res.send('0 movies match this genre');
        };
    }

    if(country) {
        results = results.filter(movie => (movie.country.toLowerCase().trim()).includes(country.toLowerCase().trim()));
        
        if(results.length === 0) {
            return res.send('0 movies from this country');
        };
    }

    if(avg_vote) {
        const avg_voteFormatted = Number(avg_vote);

        if (isNaN(avg_voteFormatted) || avg_voteFormatted == undefined) {
            return res.status(400).json({error: "Invalid request - avg vote must be a number"})
        };

        results = results.filter(movie => Number(movie.avg_vote) >= avg_voteFormatted);

        if(results.length === 0) {
            return res.send(`0 movies have a rating of ${avg_voteFormatted} or higher`);
        }
    }

    res.json(results);
})


app.listen(PORT);