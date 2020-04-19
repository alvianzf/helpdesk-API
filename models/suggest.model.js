const mongoose = require('mongoose')
    
const SuggestSchema = new mongoose.Schema({
    key : {
        type: String,
        required: [true, 'Key is required']
    },
    description: { 
        type: String,
        required: [true, `Description it's required`]
    },
    website : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Website'
    }
},{
    timestamps : true
})

const Suggest = mongoose.model('Suggest', SuggestSchema)

module.exports = Suggest