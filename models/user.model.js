const mongoose = require('mongoose')
    bcrypt = require('bcrypt')
    saltRounds = 10
    
const UserSchema = new mongoose.Schema({
    username: { 
        type: String, 
        required: [true, `Username it's required`]
    },
    password : {
        type: String, 
        required: [true, `Password it's required`]
    },
    name: { 
        type: String, 
        required: [true, `Name it's required`],
        set : v => v ? v.toLowerCase() : null,
        get: v => v ? ucwords(v) : null
    },
    role : { 
        type: String, 
        required: [true, `Role it's required`]
    },
    website : { 
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Website'
    },
    is_online : { type : Boolean , default : false}
},{
    timestamps : true
})

UserSchema.pre('save', function(next){
    this.password = bcrypt.hashSync(this.password, saltRounds);
    next();
});

function ucwords(str) {
    str.toLowerCase();
    return str.replace(/(^([a-zA-Z\p{M}]))|([ -][a-zA-Z\p{M}])/g,
    function(s){
        return s.toUpperCase();
    });
}

const User = mongoose.model('User', UserSchema)

module.exports = User