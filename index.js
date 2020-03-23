require('dotenv').config()

const express = require('express'),
    app = express(),
    router = require('./routes'),
    jwt = require('jsonwebtoken'),
    mongoose = require('mongoose'),
    cors = require('cors'),
    socket = require('socket.io'),
    Chat = require('./models/chat.model')

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
    app.use(cors())
    app.use(express.urlencoded({ extended: false }))
    app.use(express.json());
    app.use(express.static('public/images'))
    app.use('/api', router)
    app.get('/' , (req, res) => {
        res.status(200).send(" This is an empty place")
    })
    app.get('*', (req, res) => {
        res.status(404).send("opps... are u lost in the dark?")
    })
    let server = app.listen(process.env.APP_PORT || 3000, () => {
        console.log(`Server is listening in port ${process.env.APP_PORT || 3000}`)
    })

    let io = socket(server);

    io.on("connection", function(socket){
        socket.on('send_message',function(data) {
            io.emit('get_message', { data : data })
        })
        socket.on('reply_client', function(data) {
            io.emit('get_reply_client', { data : data})
        })
        socket.on('new_ticket', function(data) {
            io.emit('get_new_ticket',{
                data : data
            })
        })
        socket.on('notif_event', function(data) {
            io.emit('get_notif_event', {
                data : data
            })
        })
        socket.on('operator_typing', function(data) {
            io.emit('get_operator_typing',data)
        })
        socket.on('visitor_typing', function(data) {
            io.emit('get_visitor_typing', data)
        })
    })
}).catch( (err) => {
    console.log(err);
    app.on('error', (req, res) => {
        console.log('server crashed')
        res.status(500).send("Not enough Power")
    })
})
