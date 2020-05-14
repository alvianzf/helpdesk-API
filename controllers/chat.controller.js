const Chat = require('../models/chat.model'),
    Message = require('../models/message.model'),
    response  = require('../helpers/response'),
    User = require('../models/user.model')
    moment = require('moment')
module.exports = {
    createNewChannel: async (req, res) => {
        const { ticket_id, message, website, meta, meta_agent } = req.body

        try {
            const newMessage = new Message({
                is_read : false,
                is_guest : true,
                is_operator : false,
                message
            })
    
            const storeMessage = await newMessage.save()

            const newChat = new Chat({
                ticket_id,
                message: storeMessage._id,
                website,
                meta,
                meta_agent
            })

            const storeChat = await newChat.save()

            return res.status(201).json( response.success('Message successfully created', storeChat) )

        } catch (error) {
            return res.status(422).json( response.error('Failed to create message') )
        }
    },
    listNewGlobal : (req, res) => {
        Chat.find({ is_open : true, active_operator : null })
        .then((data) => {
            return res.status(200)
                .json( response.success('chat successfully received', data) )
        })
        .catch((err) => {
            return res.status(422).json( response.error('Failed to get chat') )
        })
    },
    listNewGlobalGroup : (req, res) => {
        Chat.find({ is_open : true, website : req.body.website, active_operator : null})
        .populate({ path : 'message'})  
        .then((data) => {
            return res.status(200)
                .json( response.success('chat successfully received', data) )
        })
        .catch((err) => {
            return res.status(422).json( response.error('Failed to get chat') )
        })
    },
    listCurrentChat : (req, res) => {
        Chat.find({ is_open : true, active_operator : req.body.active_operator })
            .populate({ path : 'message'}).populate({ path : 'active_operator'})
            .select('-__v')  
        .then((data) => {
            return res.status(200)
                .json( response.success('chat successfully received', data) )
        })
        .catch((err) => {
            return res.status(422).json( response.error('Failed to get chat') )
        })
    },
    listCloseGlobal : (req, res) => {
        Chat.find({ is_open : false})
                .populate({ path : 'message'})
                .populate({ path : 'active_operator'})  
        .then((data) => {
            return res.status(200)
                .json( response.success('chat successfully received', data) )
        })
        .catch((err) => {
            return res.status(422).json( response.error('Failed to get chat') )
        })
    },
    listCloseGroup : (req, res) => {
        Chat.find({ is_open : false, website : req.body.website})
                .populate({ path : 'message'})  
                .populate({ path : 'active_operator'})  
        .then((data) => {
            return res.status(200)
                .json( response.success('chat successfully received', data) )
        })
        .catch((err) => {
            return res.status(422).json( response.error('Failed to get chat') )
        })
    },
    getChatById : async (req, res) => {
        Chat.findById(req.body.id)
            .populate({ path: 'website' })
            .populate({ path: 'message' })
            .populate({ path: 'active_operator' })
            .populate({ path: 'recent_operator' })
            .select('-__v')
        .then((data) => {
            return res.status(200)
                .json( response.success('chat successfully received', data) )
        })
        .catch((err) => {
            return res.status(422).json( response.error('Failed to get chat') )
        })  
    },
    getChatAndSetMinimize : async (req, res) => {
        const chatExist = await Chat.findOne({ _id : req.body.id }).populate({ path: 'website' })
        .populate({ path: 'message' })
        .populate({ path: 'active_operator' })
        .populate({ path: 'recent_operator' })
        .select('-__v')
        if (chatExist) {
            const setMinimize = await Chat.findByIdAndUpdate({ _id : req.body.id },{
                is_minimize : true
            })
            return res.status(200)
                .json( response.success('chat successfully received', chatExist) )
        } else {
            return res.status(422).json( response.error('Failed to get chat') )
        }
    },
    sendNewMessageAsOperator : async (req, res) => {
        const { message } = req.body

        try {
            const newMessage = new Message({
                message,
                is_guest : false,
                is_operator : true,
                is_read : true
            })

            const storeMessage = await newMessage.save()

            const chatExist = await Chat.findOne({ _id : req.body.id })
            if (chatExist) {
                await chatExist.message.push(storeMessage._id)
                const storeChat = await chatExist.save()

                return res.status(201).json( response.success('Message successfully sent', storeChat) )
            }

            return res.status(400).json( response.error('Channel Not Found', null) )

        } catch (error) {
            return res.status(422).json( response.error('Failed to send message') )
        }
    },
    sendNewMessageAsSystem : async (req, res) => {
        const { message } = req.body
        try {
            const newMessage = new Message({
                message,
                is_guest : false,
                is_operator : false,
                is_system : true
            })

            const chatExist = await Chat.findOne({ _id : req.body.id })
            if (chatExist) {
                const storeMessage = await newMessage.save()
                await chatExist.message.push(storeMessage._id)
                const storeChat = await chatExist.save()

                return res.status(201).json( response.success('Message successfully sent', storeChat) )
            }

            return res.status(201).json( response.error('Channel Not Found', null) )

        } catch (error) {
            return res.status(422).json( response.error('Failed to send message') )
        }
    },
    sendNewMessageAsGuest : async (req, res) => {
        const { message } = req.body

        try {
            const newMessage = new Message({
                message,
                is_guest : true,
                is_operator : false
            })

            const storeMessage = await newMessage.save()

            const chatExist = await Chat.findOne({ _id : req.body.id })
            if (chatExist) {
                await chatExist.message.push(storeMessage._id)
                const storeChat = await chatExist.save()

                return res.status(201).json( response.success('Message successfully sent', storeChat) )
            }

            return res.status(400).json( response.error('Channel Not Found', null) )

        } catch (error) {
            return res.status(422).json( response.error('Failed to send message') )
        }
    },
    assignOperator : async (req, res) => {
        try {
            const chatExist = await Chat.findOne({ _id : req.body.id })
            if (chatExist && !chatExist.active_operator) {
                const assignOperator = await Chat.findByIdAndUpdate({ _id : req.body.id },{
                    active_operator : req.body.operator,
                    is_minimize : true
                })
                const newChat = await Chat.findOne({ _id : req.body.id})
                .populate({ path: 'active_operator' })
                .populate({ path: 'recent_operator' })
                .select('-__v')
                return res.status(201).json( response.success('Chat successfully assigned', newChat) )
            } else {
                return res.json({
                    success: true,
                    message: 'already have operator',
                    data: null,
                    code: 443,
                    version: 1 
                })
            }

        } catch (error) {
            console.log(error)
            return res.status(422).json( response.error('Failed to assign operator') )
        }
    },
    sendImageAsGuest : async (req, res) => {
        const file = req.file

        try {
            if (!file) {
                return res.status(415).json( response.error('File is not supported') )
            } else if (file.size > 5000000) {
                await fs.unlinkSync(file.path)
                return res.status(413).json( response.error('File size too large') )
            }

            
            const newMessage = new Message({
                media : file.filename,
                is_guest : true,
                is_operator : false
            })

            const storeMessage = await newMessage.save()

            const chatExist = await Chat.findOne({ _id : req.body.id })
            if (chatExist) {
                await chatExist.message.push(storeMessage._id)
                const storeChat = await chatExist.save()

                return res.status(201).json( response.success('Message successfully sent', storeChat) )
            }

            return res.status(400).json( response.error('Channel Not Found', null) )

        } catch (error) {
            console.log(error)
            return res.status(422).json( response.error('Failed to send message') )
        }
    },
    sendImageAsGuestAndNewChannel: async (req, res) => {
        const file = req.file
        const { ticket_id, website, meta, meta_agent } = req.body

        try {
            console.log(req.body)
            if (!file) {
                return res.status(415).json( response.error('File is not supported') )
            } else if (file.size > 5000000) {
                await fs.unlinkSync(file.path)
                return res.status(413).json( response.error('File size too large') )
            }

            
            const newMessage = new Message({
                media : file.filename,
                is_guest : true,
                is_operator : false
            })

            const storeMessage = await newMessage.save()

            const newChat = new Chat({
                ticket_id,
                message: storeMessage._id,
                website,
                meta,
                meta_agent
            })

            const storeChat = await newChat.save()

            return res.status(201).json( response.success('Message successfully created', storeChat) )

        } catch (error) {
            console.log(error)
            return res.status(422).json( response.error('Failed to send message') )
        }
    },
    sendImageAsOperator : async (req, res) => {
        const file = req.file

        try {
            if (!file) {
                return res.status(415).json( response.error('File is not supported') )
            } else if (file.size > 5000000) {
                await fs.unlinkSync(file.path)
                return res.status(413).json( response.error('File size too large') )
            }

            
            const newMessage = new Message({
                media : file.filename,
                is_guest : false,
                is_operator : true
            })

            const storeMessage = await newMessage.save()

            const chatExist = await Chat.findOne({ _id : req.body.id })
            if (chatExist) {
                await chatExist.message.push(storeMessage._id)
                const storeChat = await chatExist.save()

                return res.status(201).json( response.success('Message successfully sent', storeChat) )
            }

            return res.status(400).json( response.error('Channel Not Found', null) )

        } catch (error) {
            return res.status(422).json( response.error('Failed to send message') )
        }
    },
    endChatById : async (req, res) => {
        Chat.findByIdAndUpdate({ _id : req.body.id} , {
            is_open : false
        }).populate({ path : 'active_operator' })
        .then((data) => {
            return res.status(200)
                .json( response.success('chat successfully closed', data) )
        })
        .catch((err) => {
            console.log(err)
            return res.status(422).json( response.error('Failed to close chat') )
        })  
    },
    transferChatById : async (req, res) => {
        Chat.findByIdAndUpdate({ _id : req.body.id} , {
            active_operator : req.body.operator
        }).populate({ path : 'active_operator'})
        .then((data) => {
            Chat.findById({ _id : req.body.id}).populate({ path : 'active_operator'})
            .then((data) => {
                return res.status(200)
                    .json( response.success('chat successfully transfered', data) )
            })
            .catch((err) => {
                console.log(err)
                return res.status(422).json( response.error('Failed to transfer chat') )
            }) 
            
        })
        .catch((err) => {
            console.log(err)
            return res.status(422).json( response.error('Failed to transfer chat') )
        })  
    },
    allChatOperator : (req, res) => {
        Chat.countDocuments({ 
            active_operator : req.body.operator
        })
        .then((data) => {
            return res.status(200)
                .json( response.success('chat successfully count', data) )
        })
        .catch((err) => {
            console.log(err)
            return res.status(422).json( response.error('Failed to transfer chat') )
        }) 
    },
    allChat : (req, res) => {
        Chat.countDocuments()
        .then((data) => {
            return res.status(200)
                .json( response.success('chat successfully count', data) )
        })
        .catch((err) => {
            console.log(err)
            return res.status(422).json( response.error('Failed to transfer chat') )
        }) 
    },
    allChatOpenOperator : (req, res) => {
        Chat.countDocuments({ 
            website : req.body.website,
            is_open : true,
            active_operator : null
        })
        .then((data) => {
            return res.status(200)
                .json( response.success('chat successfully count', data) )
        })
        .catch((err) => {
            console.log(err)
            return res.status(422).json( response.error('Failed to transfer chat') )
        }) 
    },
    allChatOpen : (req, res) => {
        Chat.countDocuments({ 
            is_open : true,
            active_operator : null
        })
        .then((data) => {
            return res.status(200)
                .json( response.success('chat successfully count', data) )
        })
        .catch((err) => {
            console.log(err)
            return res.status(422).json( response.error('Failed to transfer chat') )
        }) 
    },
    allChatActiveOperator : (req, res) => {
        Chat.countDocuments({ 
            active_operator : req.body.active_operator,
            is_open : true
        })
        .then((data) => {
            return res.status(200)
                .json( response.success('chat successfully count', data) )
        })
        .catch((err) => {
            console.log(err)
            return res.status(422).json( response.error('Failed to transfer chat') )
        }) 
    },
    allChatActive : (req, res) => {
        Chat.countDocuments({ 
            active_operator : { $ne: null },
            is_open : true
        })
        .then((data) => {
            return res.status(200)
                .json( response.success('chat successfully count', data) )
        })
        .catch((err) => {
            console.log(err)
            return res.status(422).json( response.error('Failed to transfer chat') )
        }) 
    },
    allChatCloseOperator : (req, res) => {
        Chat.countDocuments({ 
            active_operator : req.body.operator,
            is_open : false
        })
        .then((data) => {
            return res.status(200)
                .json( response.success('chat successfully count', data) )
        })
        .catch((err) => {
            console.log(err)
            return res.status(422).json( response.error('Failed to transfer chat') )
        }) 
    },
    allChatClose : (req, res) => {
        Chat.countDocuments({ 
            is_open : false
        })
        .then((data) => {
            return res.status(200)
                .json( response.success('chat successfully count', data) )
        })
        .catch((err) => {
            console.log(err)
            return res.status(422).json( response.error('Failed to transfer chat') )
        }) 
    },
    destroy : (req, res) => {
        Chat.findByIdAndDelete(req.body.id)
        .then((data) => {
            return res.status(200)
                .json( response.success('chat successfully deleted', null) )
        })
        .catch((err) => {
            console.log(err)
            return res.status(422).json( response.error('Failed to delete chat') )
        }) 
    },
    countUnreadMessageById : (req, res) => {
        Chat.findById(req.body.id)
            .populate({ path: 'message' })
            .select('-__v')
        .then((data) => {
            const count = data.message.filter((v) => v.is_read == false)
            return res.status(200)
                .json( response.success('chat successfully received', count.length) )
        })
        .catch((err) => {
            console.log(err)
            return res.status(422).json( response.error('Failed to get chat') )
        })  
    },
    setRead : (req, res) => {
        Chat.findById(req.body.id)
        .then(async (data) => {
            await data.message.forEach(v => {
                Message.findByIdAndUpdate({ _id : v._id},{
                    is_read : true
                })
                .then((res) => {
                    console.log('success')
                })
                .catch((err) => {
                    console.log('error')
                })
            })
            return res.status(200)
                    .json( response.success('chat successfully updated', null) )
        })
        .catch((err) => {
            console.log(err)
            return res.status(422).json( response.error('Failed to get chat') )
        }) 
    },
    totalChatPerAgent : (req,res)=> {
        Chat.aggregate([
            {
                $group: {
                    _id: {
                        date : { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                        operator : "$active_operator"
                    },
                    total_count : { $sum : 1}
                }
            },
            {
                $project: {
                    _id : "$_id.operator",
                    operator : "$_id.operator",
                    date : "$_id.date",
                    total_count : "$total_count"
                }
            }
        ]).exec((err, result) => {
            if(err) {
                console.log(err)
                return res.status(422).json( response.error('Failed to get chat') )
            } else {
                User.populate(
                    result, {
                        path : "operator",
                        select : "name"
                    },
                    (err, populatedResult) => {
                        // return res.status(200)
                        //     .json( response.success('chat successfully updated', populatedResult) )
                        if(err) {
                            console.log(err)
                            return res.status(422).json( response.error('Failed to get chat') )
                        } else {
                            var globalArr = []
                            var line = []
                            var lineForLoop = []
                            var date = []
                            var seriesObj = {}
                            line.push("Date")
                            populatedResult.map(key => {
                                console.log(key)
                                let check = key.operator ? key.operator.name : "not served"
                                if(!line.includes(check)) {
                                    line.push(check)
                                    lineForLoop.push(check)
                                }
                                return line
                            })
                            globalArr.push(line)
                            populatedResult.map((key, i) => {
                                let check = key.operator ? key.operator.name : "not served"
                                let data = 0
                                date = []
                                date.push(key.date)
                                lineForLoop.map(v => {
                                    if(v == check && key.date == date[0]) {
                                        date.push(key.total_count)
                                    } else {
                                        date.push(0)
                                    }
                                })
                                globalArr.push(date)
                                return date
                            })

                            
                            
                            return res.status(200)
                            .json( response.success('chat successfully updated', globalArr) )
                        }
                    }
                )
                
            }
        })

    },
    getNotifList : async (req, res) => {
        if(req.body.role == "super admin") {
            const globalList = await Chat.find({ is_open : true})
            .populate({ path : 'message'})  
            let globalArr = []
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
                    is_minimize: v.is_minimize,
                    unreadtotal : v.message.filter(v => {
                        if(v.is_read == false && v.is_guest == true) {
                            return true
                        }
                    }).length
                })
            })
            return res.status(200)
                .json( response.success('chat successfully received', globalArr) )
        }
        else {
            const groupList = await Chat.find({ is_open : true, website : req.body.website})
            .populate({ path : 'message'})  
            let arr = []
            groupList.forEach( v => {
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
                    is_minimize: v.is_minimize,
                    unreadtotal : v.message.filter(v  => {
                        if(v.is_read == false && v.is_guest == true) {
                            return true
                        }
                    }).length
                })
            })

            return res.status(200)
                .json( response.success('chat successfully received', arr) )
        }
    },
    setRed : (req, res) => {
        Chat.findByIdAndUpdate({ _id : req.body.id},{
            is_red : req.body.red
        })
        .then((data) => {
            return res.status(200)
                .json( response.success('chat successfully updated', null) )
        })
        .catch((err) => {
            console.log(err)
            return res.status(422).json( response.error('Failed to red chat') )
        })
    },
}