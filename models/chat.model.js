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
    active_operator : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    recent_operator : [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    message: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Message'
    }],
    is_open : { type : Boolean, default : true }
},{
    timestamps : true
})

const Chat = mongoose.model('Chat', ChatScheme)

module.exports = Chat