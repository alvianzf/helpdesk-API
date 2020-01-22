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
        console.log("Socket Connection Established with ID :"+ socket.id)
        socket.on('new_chat_for_operator', async function(data) {
            console.log('have new chat on operator')
            try {
                const list = await Chat.find({ website : data.website, active_operator : null})  
                io.emit('list_new_chat_for_operator', { data: list })
            } catch (error) {
                io.emit('list_new_chat_for_operator', { data: [] })
            }
        })

        socket.on('new_chat_for_admin', async function() {
            console.log('have new chat on admin')
            try {
                const list = await Chat.find({active_operator : null})  
                io.emit('list_new_chat_for_admin', { data: list })
            } catch (error) {
                io.emit('list_new_chat_for_admin', { data: [] })
            }
        })
        // socket.on("get_list_chat_unoperator", async function(data) {
        //     try {
        //         const list = await Chat.find({ website : data.website, active_operator : null})  
        //         io.emit('unoperator_list_chat', { data: list })
        //     } catch (error) {
        //         io.emit('unoperator_list_chat', { data: [] })
        //     }
        // })
    })
}).catch( (err) => {
    console.log(err);
    app.on('error', (req, res) => {
        console.log('server crashed')
        res.status(500).send("Not enough Power")
    })
})
