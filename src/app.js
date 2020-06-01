const path = require('path')
const express = require('express')
const hbs = require('hbs')
const dont = require('dotenv')
require('dotenv').config()

const app = express()
const port = process.env.PORT || 3000

// Define paths for Express config
const publicDirectoryPath = path.join(__dirname, '../public/')
const viewsPath = path.join(__dirname, '../templates/views')
const partialsPath = path.join(__dirname, '../templates/partials')

// Setup handlebars engine and views location
app.set('view engine', 'hbs')
app.set('views', viewsPath)
hbs.registerPartials(partialsPath)

// Setup static directory to serve
app.use(express.static(publicDirectoryPath))

app.get('', (req, res) => {
    res.render('index', {

    })
})

app.get('/track-stocks', (req, res) => {
    res.render('track-stocks', {

    })
})

app.get('/track-stocks/get', (req, res) => {
    const mongoURI = "mongodb://"+process.env.DB_USERNAME+":"+process.env.DB_PASSWORD+"@ds347298.mlab.com:47298/heroku_c0mkznrv"
    var MongoClient = require('mongodb').MongoClient;

    MongoClient.connect(mongoURI, function(err, db) {
        if (err) throw err;
        
        var dbo = db.db("heroku_c0mkznrv");

        dbo.collection("stocks").find({}).toArray(function(err, result) {
            if (err) throw err;
            db.close();
            res.send(result)            
        });
    });    
})

app.get('/help', (req, res) => {
    res.render('help', {

    })
})

app.listen(port, () => {
    console.log('Server started on port ' + port + '.')
})