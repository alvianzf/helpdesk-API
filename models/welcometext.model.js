const mongoose = require('mongoose')

const welcomeSchema = new mongoose.Schema({
    message: { 
        type: String 
    },
}, { 
    collection : 'welcomes',
    timestamps : true
})

const Welcome = mongoose.model('Welcome', welcomeSchema)

module.exports = Welcome