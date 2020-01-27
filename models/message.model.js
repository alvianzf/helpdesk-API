const mongoose = require('mongoose')

const messageSchema = new mongoose.Schema({
    message: { type: String },
    media: { type: String },
    is_read: { type: Boolean, default: false },
    is_guest : { type: Boolean, default : true },
    is_operator : { type: Boolean, default : false },
    is_system : { type: Boolean, default : false},
    operator : { 
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
}, { 
    collection : 'messages',
    timestamps : true
})

const Message = mongoose.model('Message', messageSchema)

module.exports = Message