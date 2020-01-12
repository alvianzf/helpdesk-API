const Chat = require('../models/chat.model'),
    Message = require('../models/message.model'),
    response  = require('../helpers/response'),
    User = require('../models/user.model')

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
    findChannel : async (req, res) => {
        try {

            const chat = await Chat.findOne({ _id : req.body.channel_id, active_operator : { $ne: null } })
                .populate({ path: 'active_operator' }).populate({ path: 'message' }).populate({ path : 'recent_operator'})
                .select('-__v')

            return res.status(201).json( response.success('Chat successfully received', chat) )

        } catch (error) {
            console.log(error)
            return res.status(422).json( response.error('Failed to assign operator') )
        }
    },
    assignOperator : async (req, res) => {
        try {

            const isChatHaveOperator = await Chat.findOne({ _id : req.body.channel_id, active_operator : { $ne: null } })
                .populate({ path: 'active_operator' }).populate({ path: 'message' }).populate({ path : 'recent_operator'})
                .select('-__v')

            if(isChatHaveOperator) {
                return res.status(200).json( response.success('Channel already have operator', isChatHaveOperator) )
            }
            
            const selectRandomOperator = await User.aggregate([
                { $match: { role : 'customer service', is_serving : false } },
                { $sample: { size : 1} }
            ])
        
            if(selectRandomOperator.length > 0) {
                await User.findByIdAndUpdate({ _id : selectRandomOperator[0]._id }, {
                    is_serving : true
                })

                await Chat.findByIdAndUpdate({ _id : req.body.channel_id }, {
                    active_operator : selectRandomOperator[0]._id
                })

                const activeChat = await  Chat.findOne({ _id : req.body.channel_id})
                    .populate({ path: 'active_operator' }).populate({ path: 'message' }).populate({ path : 'recent_operator'})
                    .select('-__v')

                return res.status(201).json( response.success('Operator successfully assigned', activeChat) )
            } else {
                return res.status(400).json( response.error('All Operator Busy', null) )
            }

        } catch (error) {
            console.log(error)
            return res.status(422).json( response.error('Failed to assign operator') )
        }
    },
    listMessageByChannel : async (req, res) => {
        
        const chat = await Chat.findOne({ _id : req.body.channel_id})
            .populate({ path: 'active_operator' }).populate({ path: 'message' }).populate({ path : 'recent_operator'})
            .select('-__v')

        return res.status(201).json( response.success('Message successfully received', chat) )
    },
    sendNewMessageAsGuest : async (req, res) => {
        const { message } = req.body

        try {
            const newMessage = new Message({
                message
            })

            const storeMessage = await newMessage.save()

            const chatExist = await Chat.findOne({ _id : req.body.channel_id })
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
    listOpenChat : (req, res) => {
        Chat.find({ is_open : true })
        .then((data) => {
            return res.status(200)
                .json( response.success('channel successfully received', data) )
        })
        .catch((err) => {
            console.log(err)
            return res.status(422).json( response.error('Failed to get channel') )
        })
    },
    listRecentChat : (req, res) => {
        Chat.find({ is_open : false })
        .then((data) => {
            return res.status(200)
                .json( response.success('channel successfully received', data) )
        })
        .catch((err) => {
            console.log(err)
            return res.status(422).json( response.error('Failed to get channel') )
        })
    },
    listOpenByOperator : (req, res) => {
        Chat.find({ is_open : true, active_operator : req.body.operator })
        .then((data) => {
            return res.status(200)
                .json( response.success('channel successfully received', data) )
        })
        .catch((err) => {
            console.log(err)
            return res.status(422).json( response.error('Failed to get channel') )
        })
    }
}