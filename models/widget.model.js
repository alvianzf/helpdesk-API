const mongoose = require('mongoose')
    
const WidgetSchema = new mongoose.Schema({
    name: { 
        type: String, 
        default: 'widget name'
    },
    title : {
        type: String,
        default: 'CS'
    },
    subtitle : {
        type: String,
        default: '24/7 Online'
    },
    logo : {
        type: String
    },
    background_color : {
        type: String,
        default: '#00ffff'
    },
    text_color : {
        type: String,
        default: '#009898'
    },
    website : { 
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Website'
    },
    welcome_text : [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Welcome'
    }],
    splashscreen : {
        type : String
    },
    splashscreenduration : {
        type : Number
    }
},{
    timestamps : true
})

const Widget = mongoose.model('Widget', WidgetSchema)

module.exports = Widget