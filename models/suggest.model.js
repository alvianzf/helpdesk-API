const mongoose = require('mongoose')
    
const SuggestSchema = new mongoose.Schema({
    description: { 
        type: String,
        required: [true, `Description it's required`]
    }
},{
    timestamps : true
})

const Suggest = mongoose.model('Suggest', SuggestSchema)

module.exports = Suggest