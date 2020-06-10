const path = require('path')
const express = require('express')
const hbs = require('hbs')
const mongoose = require('mongoose')
const app = express()
const PDFDocument = require('pdfkit');
const fs = require('fs');
const dot = require('dotenv')
require('dotenv').config()

// My Class
const DataSanitize = require("./data-sanitize.js")
const DataPrevent = require("./data-prevent.js")

var something = new DataPrevent()
console.log(something.name)
console.log(something.numberSanitize(123))

//var sanitize = new DataSanitize()
//console.log(sanitize.name)
// console.log(sanitize.numberSanitize(123))
// console.log(sanitize.stringSanitize("test"))

// Simple encapuslation
class DatabaseInformation {
    constructor() {
        // a private variable for my local environment port
        let localEnvironmentPort = 3000
        
        // Setup the port for Heroku environment and local environment
        this.port = process.env.PORT || localEnvironmentPort

        // Create URI for mongodb location on Heroku
        this.uri = "mongodb://" + process.env.DB_USERNAME + ":" + process.env.DB_PASSWORD + "@ds347298.mlab.com:47298/heroku_c0mkznrv"
    }
}

// Create the object from the class DatabaseInformation
const dbInfo = new DatabaseInformation()

// Create the Server class
class Server {

    constructor() {
        this.publicDirectoryPath = path.join(__dirname, '../public/')
        this.viewsPath = path.join(__dirname, '../templates/views')
        this.partialsPath = path.join(__dirname, '../templates/partials')

        this.start()
        this.setupViewEngine(this.publicDirectoryPath, this.viewsPath, this.partialsPath)
        this.initRoutes()
    }

    start() {
        // Start the app on local port or on the Heroku environment
        app.listen(dbInfo.port, () => {
            console.log('Server started on port ' + dbInfo.port + '.')
        })
    }

    setupViewEngine(publicDirectoryPath, viewsPath, partialsPath) {
        // Setup handlebars engine and views location
        app.set('view engine', 'hbs')
        app.set('views', viewsPath)
        hbs.registerPartials(partialsPath)

        // Setup static directory to serve
        app.use(express.static(publicDirectoryPath))
    }

    initRoutes() {
        // Setup routes for user pages
        app.get('', (req, res) => {
            res.render('index', {
                title: "Home"
            })
        })

        app.get('/track-stocks', (req, res) => {
            res.render('track-stocks', {
                title: "Track Stocks"
            })
        })

        app.get('/reports', (req, res) => {
            res.render('reports', {
                title: "Reports"
            })
        })

        app.get('/help', (req, res) => {
            res.render('help', {
                title: "Help"
            })
        })

        // Generate a pdf report for the user
        app.get('/reports/generate', (req, res) => {

            const mongoURI = dbInfo.uri
            var MongoClient = require('mongodb').MongoClient;

            MongoClient.connect(mongoURI, function(err, db) {
                if (err) throw err;
                
                var dbo = db.db("heroku_c0mkznrv");
                const collection = dbo.collection('stocks')
                collection.find({}).toArray(function(err, result) {
                    if (err) throw err

                    const doc = new PDFDocument
                    doc.pipe(fs.createWriteStream('./public/downloads/my-stock-tracker-report.pdf'))
                    doc.fontSize(14).text("My Stock Tracker Report", 25, 20)
                    let counter = 1

                    for ( var i = 0; i < result.length; i++) {
                        var obj = result[i]                
                        var reportLine = ""                

                        for ( var key in obj) {
                            if(key !== "_id") {
                                reportLine = reportLine + key + ": " + obj[key] + ", "
                            }
                        }
                        doc.fontSize(14).text(reportLine, 25, 20 * counter + 20)
                        counter++
                    }
                                
                    doc.end()
                    db.close()
                    res.send({
                        success: true
                    })            
                });       
            });    
        })
        // END /reports/generate

        // /track-stocks/get will send a JSON response for all stock information or an individual stock
        app.get('/track-stocks/get', (req, res) => {    
            const mongoURI = dbInfo.uri
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
        // END /track-stocks/get

        // /track-stocks/update will update an individual stock
        app.get('/track-stocks/update', (req, res) => {
            const mongoURI = dbInfo.uri
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
                            db.close()
                    })
                }
            });    
        })
        // END /track-stocks/update

        // /track-stocks/delete will delete an individual stock from the database
        app.get('/track-stocks/delete', (req, res) => {
            const mongoURI = dbInfo.uri
            var MongoClient = require('mongodb').MongoClient;

            MongoClient.connect(mongoURI, function(err, db) {
                if (err) throw err;
                
                var dbo = db.db("heroku_c0mkznrv");
                const collection = dbo.collection('stocks')

                if(!req.query.id) {
                    // do something if no id is passed
                } else if(req.query.id) {
                    let stockId = mongoose.Types.ObjectId(req.query.id);            
                    collection.deleteOne({_id: stockId}, (err, item) => {                
                        db.close()
                        res.send(item)
                    })
                }
            });    
        })
        // END /track-stocks/delete
    }
}

// Invoke class object, Server
new Server();