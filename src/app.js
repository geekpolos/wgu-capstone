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
        const collection = dbo.collection('stocks')

        if(!req.query.ticker) {
            // if no ticker (stock symbol) is provided, then get all stocks
            collection.find({}).toArray(function(err, result) {
                if (err) throw err
                db.close()
                res.send(result)            
            });
        } else if (req.query.ticker) {
            // if ticker is provided, get information for that individual ticker
            collection.find({ticker: req.query.ticker}).toArray((err, items) => {
                if (err) throw err                
                db.close()
                res.send(items)
            })
        }
    });    
})

app.get('/track-stocks/update', (req, res) => {
    const mongoURI = "mongodb://"+process.env.DB_USERNAME+":"+process.env.DB_PASSWORD+"@ds347298.mlab.com:47298/heroku_c0mkznrv"
    var MongoClient = require('mongodb').MongoClient;

    MongoClient.connect(mongoURI, function(err, db) {
        if (err) throw err;
        
        var dbo = db.db("heroku_c0mkznrv");
        const collection = dbo.collection('stocks')

        if(!req.query.ticker) {
            // do something if no ticker
        } else if (req.query.ticker && req.query.add === "false") {
            collection.updateOne(
                {ticker: req.query.ticker}, 
                {'$set':
                    {
                        'quantity': req.query.quantity,
                        'price': req.query.price
                    }
                }, (err, item) => {
                    //console.log(item)
                })
        } else if (req.query.ticker && req.query.add === "true") {
            collection.insertOne(
                {
                    ticker: req.query.ticker,
                    quantity: req.query.quantity,
                    price: req.query.price
                }, (err, result) => {

            })
        }
    });    
})

app.get('/help', (req, res) => {
    res.render('help', {

    })
})

app.listen(port, () => {
    console.log('Server started on port ' + port + '.')
})