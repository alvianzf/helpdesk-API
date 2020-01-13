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
        .then((data) => {
            return res.status(200)
                .json( response.success('chat successfully received', data) )
        })
        .catch((err) => {
            console.log(err)
            return res.status(422).json( response.error('Failed to get chat') )
        })  
    }
}