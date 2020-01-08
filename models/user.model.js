const mongoose = require('mongoose')
    bcrypt = require('bcrypt')
    saltRounds = 10
    uniqueValidator = require('mongoose-unique-validator')
    
const UserSchema = new mongoose.Schema({
    email: { 
        type: String, 
        required: [true, `Email it's required`],
        unique : true,
        set: v => v.toLowerCase(),
        get: ucwords
    },
    password : {
        type: String, 
        required: [true, `Password it's required`],
        unique : true
    },
    name: { 
        type: String, 
        required: [true, `Name it's required`],
        set: v => v.toLowerCase()
    },
    phone : { 
        type: String, 
        required: [true, `Phone it's required`]
    },
    role : { 
        type: String, 
        required: [true, `Role it's required`],
        set: v => v.toLowerCase()
    },
    website : { 
        type: String
    }
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
UserSchema.plugin(uniqueValidator, { message: 'Error, expected {PATH} to be unique.' })
const User = mongoose.model('user', UserSchema)

module.exports = User