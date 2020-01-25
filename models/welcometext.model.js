const mongoose = require('mongoose')

const welcomeSchema = new mongoose.Schema({
    message: { 
        type: String 
    },
}, { 
    timestamps : true
})

const Welcome = mongoose.model('Welcome', welcomeSchema)

module.exports = Welcome