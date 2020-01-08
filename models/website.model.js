const mongoose = require('mongoose')
    
const WebsiteSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: [true, `Name it's required`],
        unique : true,
        set: v => v.toLowerCase(),
        get: ucwords
    },
    ip : {
        type: String
    }
},{
    timestamps : true
})

function ucwords(str) {
    str.toLowerCase();
    return str.replace(/(^([a-zA-Z\p{M}]))|([ -][a-zA-Z\p{M}])/g,
    function(s){
        return s.toUpperCase();
    });
}

const Website = mongoose.model('website', WebsiteSchema)

module.exports = Website