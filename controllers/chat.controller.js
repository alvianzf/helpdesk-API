const Chat = require('../models/chat.model'),
    Message = require('../models/message.model'),
    response  = require('../helpers/response'),
    User = require('../models/user.model')

module.exports = {
    createNewChannel: async (req, res) => {
        const { name, email, phone, message, website } = req.body

        try {
            const newMessage = new Message({
                is_read : false,
                is_guest : true,
                is_operator : false,
                message
            })
    
            const storeMessage = await newMessage.save()

            const newChat = new Chat({
                name,
                email,
                phone,
                message: storeMessage._id,
                website
            })

            const storeChat = await newChat.save()

            return res.status(201).json( response.success('Message successfully created', storeChat) )

        } catch (error) {
            return res.status(422).json( response.error('Failed to create message') )
        }
    },
    listChatNoOperatorByWebsite : async (req, res) => {
        try {
            const chats = Chat.find({ website : req.body.website, active_operator : null})

            return res.status(201).json( response.success('Message successfully created', chats) )
        } catch (error) {
            return res.status(422).json( response.error('Failed to get list chat') )
        }
    },
    listActiveChatByWebsite : async (req, res) => {
        Chat.find({ website : req.body.website, is_open : true})
            .populate({ path: 'active_operator' })
            .select('-__v')

        .then((data) => {
            return res.status(200)
                .json( response.success('chat successfully received', data) )
        })
        .catch((err) => {
            console.log(err)
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
            console.log(err)
            return res.status(422).json( response.error('Failed to get chat') )
        })  
    },
    sendNewMessageAsOperator : async (req, res) => {
        const { message } = req.body

        try {
            const newMessage = new Message({
                message,
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
                    active_operator : req.body.operator
                })
                return res.status(201).json( response.success('Chat successfully assigned', assignOperator) )
            } else {
                return res.status(201).json( response.success('already have operator', null) )
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
            return res.status(422).json( response.error('Failed to send message') )
        }
    }
}