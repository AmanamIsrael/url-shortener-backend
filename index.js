require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
var bodyParser = require('body-parser')
const ShortUrl = require('./models/shorturl');



const app = express();
app.use(bodyParser.json());


mongoose.connect(`mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.hpxnv.mongodb.net/${process.env.DB_PROJECT_NAME}?retryWrites=true&w=majority`, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

app.use(express.urlencoded({ extended: false }));

app.get('/', async(req, res) => {
    const shortUrls = await ShortUrl.find();
    res.send(shortUrls);
});

app.post('/shortUrls', async(req, res) => {
    try {
        let response = await ShortUrl.create(req.body);
        res.json(response)
    } catch (err) {
        console.log(err)
    }
});

app.get('/:shortUrl', async(req, res) => {
    const shortUrl = await ShortUrl.findOne({ short: req.params.shortUrl });
    if (shortUrl == null) return res.sendStatus(404);
    shortUrl.clicks++;
    shortUrl.save();
    res.redirect(shortUrl.full);
})

app.listen(process.env.PORT || 3000)