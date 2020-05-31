const path = require('path')
const express = require('express')
const hbs = require('hbs')
const dont = require('dotenv')

const app = express()
const port = process.env.PORT || 3000

const mongoose = require('mongoose')
const mongoURI = "mongodb://"+process.env.DB_USERNAME+":"+process.env.DB_PASSWORD+"@ds347298.mlab.com:47298/heroku_c0mkznrv"
mongoose.connect(mongoURI)
let db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'))

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

app.get('/help', (req, res) => {
    res.render('help', {

    })
})

app.listen(port, () => {
    console.log('Server started on port ' + port + '.')
})