const mongoose = require('mongoose')
    
const ChatScheme = new mongoose.Schema({
    ticket_id : {
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
    is_open : { type : Boolean, default : true },
    is_minimize : { type : Boolean, default : false },
    website : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Website'
    },
    meta : {
        type : String
    },
    meta_agent : {
        type : String
    }
},{
    timestamps : true
})

const Chat = mongoose.model('Chat', ChatScheme)

module.exports = Chat