const Chat = require('../models/chat.model'),
    Message = require('../models/message.model'),
    response  = require('../helpers/response')

module.exports = {
    createNewChannel: async (req, res) => {
        const { name, email, phone, message } = req.body

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
                message: storeMessage._id
            })

            const storeChat = await newChat.save()

            return res.status(201).json( response.success('Message successfully created', storeChat) )

        } catch (error) {
            return res.status(422).json( response.error('Failed to create message') )
        }
    },
    listMessageByChannel : async (req, res) => {
        
        const chat = await Chat.findOne({ _id : req.body.channel_id}).populate({ path: 'message' })
            .select('-__v')

        return res.status(201).json( response.success('Message successfully received', chat) )
    }
}