require('dotenv').config()

const express = require('express'),
    app = express(),
    router = require('./routes'),
    jwt = require('jsonwebtoken'),
    mongoose = require('mongoose')

console.log('Waiting connection from mongodb')
mongoose.set('useCreateIndex', true)
mongoose.Promise = global.Promise
mongoose.connect(process.env.DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology : true,
    useFindAndModify: false
}).then( (db) => {
    console.log('Server connected to mongodb.......')
    app.set('secretKey', 'nodeRestApi')
    app.use(express.urlencoded({ extended: false }))
    app.use(express.json());
    app.use('/api', router)
    app.get('/' , (req, res) => {
        res.status(200).send(" This is an empty place")
    })
    app.get('*', (req, res) => {
        res.status(404).send("opps... are u lost in the dark?")
    })
    app.listen(process.env.APP_PORT || 3000, () => {
        console.log(`Server is listening in port ${process.env.APP_PORT || 3000}`)
    })
}).catch( (err) => {
    console.log(err);
    server.on('error', (req, res) => {
        console.log('server crashed')
        res.status(500).send("Not enough Power")
    })
})
