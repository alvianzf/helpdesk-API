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
        // new list chat
        socket.on('new_list_global', async function(data) {
            try {
                const globalList = await Chat.find({ is_open : true, active_operator : null })
                .populate({ path : 'message'})  
                const globalArr = []
                globalList.forEach( v => {
                    globalArr.push({
                        recent_operator: v.recent_operator,
                        message: v.message,
                        is_open: v.is_open,
                        _id: v._id,
                        ticket_id: v.ticket_id,
                        website: v.website,
                        createdAt: v.createdAt,
                        updatedAt: v.updatedAt,
                        active_operator: v.active_operator,
                        unreadtotal : v.message.filter(v => {
                            if(v.is_read == false && v.is_guest == true) {
                                return true
                            }
                        }).length
                    })
                })
                io.emit('get_new_list_global', { data: globalArr })
            } catch (error) {
                io.emit('get_new_list_global', { data : []})
            }
        })

        socket.on('new_list_group', async function(data) {
            try {
                const groupList = await Chat.find({ is_open : true, website : data.website, active_operator : null})
                .populate({ path : 'message'})  
                const groupArr = []
                groupList.forEach( v => {
                    groupArr.push({
                        recent_operator: v.recent_operator,
                        message: v.message,
                        is_open: v.is_open,
                        _id: v._id,
                        ticket_id: v.ticket_id,
                        website: v.website,
                        createdAt: v.createdAt,
                        updatedAt: v.updatedAt,
                        active_operator: v.active_operator,
                        unreadtotal : v.message.filter(v  => {
                            if(v.is_read == false && v.is_guest == true) {
                                return true
                            }
                        }).length
                    })
                })
                io.emit('get_new_list_group', { data: groupArr })
            } catch (error) {
                io.emit('get_new_list_group', { data : []})
            }
        })

        // ----- end new list chat
        
        // current list chat
        socket.on('current_list_chat', async function(data) {
            try {
                const list = await Chat.find({ is_open : true, active_operator : data.active_operator })
                .populate({ path : 'message'})  
                const arr = []
                list.forEach( v => {
                    arr.push({
                        recent_operator: v.recent_operator,
                        message: v.message,
                        is_open: v.is_open,
                        _id: v._id,
                        ticket_id: v.ticket_id,
                        website: v.website,
                        createdAt: v.createdAt,
                        updatedAt: v.updatedAt,
                        active_operator: v.active_operator,
                        unreadtotal : v.message.filter(v  => {
                            if(v.is_read == false && v.is_guest == true) {
                                return true
                            }
                        }).length
                    })
                })
                io.emit('get_current_list', { data: arr })
            } catch (error) {
                io.emit('get_current_list', { data : []})
            }
        })

        // end current list chat ------

        // close list chat
        socket.on('close_list_global', async function(data) {
            try {
                const globalList = await Chat.find({ is_open : false})
                .populate({ path : 'message'})
                .populate({ path : 'active_operator'})  

                const globalArr = []
                globalList.forEach( v => {
                    globalArr.push({
                        recent_operator: v.recent_operator,
                        message: v.message,
                        is_open: v.is_open,
                        _id: v._id,
                        ticket_id: v.ticket_id,
                        website: v.website,
                        createdAt: v.createdAt,
                        updatedAt: v.updatedAt,
                        active_operator: v.active_operator,
                        unreadtotal : v.message.filter(v  => {
                            if(v.is_read == false && v.is_guest == true) {
                                return true
                            }
                        }).length
                    })
                })
                io.emit('get_close_list_global', { data: globalArr })
            } catch (error) {
                io.emit('get_close_list_global', { data : []})
            }
        })

        socket.on('close_list_group', async function(data) {
            try {
                const groupList = await Chat.find({ is_open : false, website : data.website})
                .populate({ path : 'message'})  
                .populate({ path : 'active_operator'})  
                const groupArr = []
                groupList.forEach( v => {
                    groupArr.push({
                        recent_operator: v.recent_operator,
                        message: v.message,
                        is_open: v.is_open,
                        _id: v._id,
                        ticket_id: v.ticket_id,
                        website: v.website,
                        createdAt: v.createdAt,
                        updatedAt: v.updatedAt,
                        active_operator: v.active_operator,
                        unreadtotal : v.message.filter(v  => {
                            if(v.is_read == false && v.is_guest == true) {
                                return true
                            }
                        }).length
                    })
                })
                io.emit('get_close_list_group', { data: groupArr })
            } catch (error) {
                io.emit('get_close_list_group', { data : []})
            }
        })

        // get message
        socket.on('send_message', async function(data) {
            Chat.findById({_id : data.id}).populate({ path : 'message'})  
            .then((res) => {
                io.emit('get_message', { data: res })
            })
            .catch((err) => {
                console.log(err)
                io.emit('get_message', { data : null})
            })
        })

        // end get message

        socket.on('assigned_operator', function(data) {
            Chat.findById({ _id : data.id}).populate({ path : 'active_operator'})  
            .then((res) => {
                io.emit('get_current_operator', { data: res.active_operator.name })
            })
            .catch((err) => {
                console.log(err)
                io.emit('get_current_operator', { data : null})
            })
        })

        // visitor typing
        socket.on('visitor_typing', function(payload) {
            console.log('visitor typing')
            io.emit('set_visitor_typing', { data : payload})
        })

        // operator typing
        socket.on('operator_typing', function(payload) {
            console.log('operator typing')
            io.emit('set_operator_typing', { data : payload})
        })

        // notification

        socket.on('new_notification_list_global', async function(data) {
            try {
                const globalList = await Chat.find({ is_open : true, active_operator : null })
                .populate({ path : 'message'})  
                const globalArr = []
                globalList.forEach( v => {
                    globalArr.push({
                        recent_operator: v.recent_operator,
                        message: v.message,
                        is_open: v.is_open,
                        _id: v._id,
                        ticket_id: v.ticket_id,
                        website: v.website,
                        createdAt: v.createdAt,
                        updatedAt: v.updatedAt,
                        active_operator: v.active_operator,
                        unreadtotal : v.message.filter(v  => {
                            if(v.is_read == false && v.is_guest == true) {
                                return true
                            }
                        }).length
                    })
                })
                io.emit('get_new_notification_list_global', { data: globalArr })
            } catch (error) {
                io.emit('get_new_notification_list_global', { data : []})
            }
        })

        socket.on('new_notification_list_group', async function(data) {
            try {
                const groupList = await Chat.find({ is_open : true, website : data.website, active_operator : null})
                .populate({ path : 'message'})  
                const groupArr = []
                groupList.forEach( v => {
                    groupArr.push({
                        recent_operator: v.recent_operator,
                        message: v.message,
                        is_open: v.is_open,
                        _id: v._id,
                        ticket_id: v.ticket_id,
                        website: v.website,
                        createdAt: v.createdAt,
                        updatedAt: v.updatedAt,
                        active_operator: v.active_operator,
                        unreadtotal : v.message.filter(v  => {
                            if(v.is_read == false && v.is_guest == true) {
                                return true
                            }
                        }).length
                    })
                })
                io.emit('get_new_notification_list_group', { data: groupArr })
            } catch (error) {
                io.emit('get_new_notification_list_group', { data : []})
            }
        })

        // end of new notification

        // current list of notification
        socket.on('current_notification_list_global', async function(data) {
            try {
                const globalList = await Chat.find({ is_open : true, active_operator : { $ne : null} })
                .populate({ path : 'message'})  
                const globalArr = []
                globalList.forEach( v => {
                    globalArr.push({
                        recent_operator: v.recent_operator,
                        message: v.message,
                        is_open: v.is_open,
                        _id: v._id,
                        ticket_id: v.ticket_id,
                        website: v.website,
                        createdAt: v.createdAt,
                        updatedAt: v.updatedAt,
                        active_operator: v.active_operator,
                        unreadtotal : v.message.filter(v  => {
                            if(v.is_read == false && v.is_guest == true) {
                                return true
                            }
                        }).length
                    })
                })
                io.emit('get_current_notification_list_global', { data: globalArr })
            } catch (error) {
                io.emit('get_current_notification_list_global', { data : []})
            }
        })

        socket.on('current_notification_list_group', async function(data) {
            try {
                const groupList = await Chat.find({ is_open : true, website : data.website, active_operator : { $ne : null}})
                .populate({ path : 'message'})  
                const groupArr = []
                groupList.forEach( v => {
                    groupArr.push({
                        recent_operator: v.recent_operator,
                        message: v.message,
                        is_open: v.is_open,
                        _id: v._id,
                        ticket_id: v.ticket_id,
                        website: v.website,
                        createdAt: v.createdAt,
                        updatedAt: v.updatedAt,
                        active_operator: v.active_operator,
                        unreadtotal : v.message.filter(v  => {
                            if(v.is_read == false && v.is_guest == true) {
                                return true
                            }
                        }).length
                    })
                })
                io.emit('get_current_notification_list_group', { data: groupArr })
            } catch (error) {
                io.emit('get_current_notification_list_group', { data : []})
            }
        })

    })
}).catch( (err) => {
    console.log(err);
    app.on('error', (req, res) => {
        console.log('server crashed')
        res.status(500).send("Not enough Power")
    })
})
