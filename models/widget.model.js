const mongoose = require('mongoose')
    
const WidgetSchema = new mongoose.Schema({
    name: { 
        type: String, 
        set: v => v ? 'widget name' : v
    },
    title : {
        type: String,
        set: v => v ? 'CS' : v
    },
    subtitle : {
        type: String,
        set: v => v ? '24/7 Online' : v
    },
    logo : {
        type: String
    },
    background_color : {
        type: String,
        set: v => v ? '#00ffff' : v
    },
    text_color : {
        type: String,
        set: v => v ? '#009898' : v
    },
    website : { 
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Website'
    },
    welcome_text : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Welcome'
    },
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