const mongoose = require('mongoose')
    
const ChatScheme = new mongoose.Schema({
    name: { 
        type: String,
    },
    email : {
        type : String
    },
    phone : {
        type : String
    },
    message: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Message'
    }],
},{
    timestamps : true
})

const Chat = mongoose.model('Chat', ChatScheme)

module.exports = Chat