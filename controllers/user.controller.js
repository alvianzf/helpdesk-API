const Model = require('../models/user.model')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const response  = require('../helpers/response')
const saltRounds = 10

module.exports = {
    get: function(req, res, next) {
        return res.status(200)
        .json( response.success('Testing successfully', null) )
    },
    all: function(req, res, next) {
        Model.find().populate({ path: 'website' }).select('-__v')
        .then((data) => {
            return res.status(200)
                .json( response.success('User successfully received', data) )
        })
        .catch((err) => {
            console.log(err)
            return res.status(422).json( response.error('Failed to get user') )
        })
    },
    find: function(req, res, next) {
        Model.findById(req.body.id).populate({ path: 'website' }).select('-__v')
        .then((data) => {
            return res.status(200)
                .json( response.success('User successfully received', data) )
        })
        .catch((err) => {
            console.log(err)
            return res.status(422).json( response.error('Failed to get user') )
        })
    },
    destroy: function(req, res, next) {
        Model.findByIdAndRemove(req.body.id)
        .then(() => {
            return res.status(200)
                .json( response.success('User successfully deleted', null) )
        })
        .catch((err) => {
            console.log(err)
            return res.status(422).json( response.error('Failed to delete user') )
        })
    },
    patch: function(req, res, next) {
        if(req.body.website) {
            Model.findByIdAndUpdate(req.body.id, {
                name : req.body.name,
                username : req.body.username,
                website : req.body.website
            })
            .then((data) => {
                return res.status(200)
                    .json( response.success('User successfully updated', data) )
            })
            .catch((err) => {
                console.log(err)
                return res.status(422).json( response.error('Failed to update user') )
            })
        }else {
            Model.findByIdAndUpdate(req.body.id, {
                name : req.body.name,
                username : req.body.username
            })
            .then((data) => {
                return res.status(200)
                    .json( response.success('User successfully updated', data) )
            })
            .catch((err) => {
                console.log(err)
                return res.status(422).json( response.error('Failed to update user') )
            })
        }
        
    },
    resetPassword: function(req, res, next) {
        Model.findByIdAndUpdate(req.body.id, {
            password : bcrypt.hashSync('123456789', saltRounds)
        })
        .then((data) => {
            return res.status(200)
                .json( response.success('User successfully reseted, password reset to 123456789', data) )
        })
        .catch((err) => {
            console.log(err)
            return res.status(422).json( response.error('Failed to update user') )
        })
        
    },
    pathEdit: function(req, res, next) {
        Model.findByIdAndUpdate(req.body.id, {
            name : req.body.name,
            phone : req.body.phone
        })
        .then((data) => {
            return res.status(200)
                .json( response.success('User successfully updated', data) )
        })
        .catch((err) => {
            console.log(err)
            return res.status(422).json( response.error('Failed to update user') )
        })
    },
    listAsRole : function(req, res, next) {
        Model.find({ role : req.body.role})
        .populate({ path: 'website' }).select('-__v')
        .then((data) => {
            return res.status(200)
                .json( response.success('User successfully received', data) )
        })
        .catch((err) => {
            console.log(err)
            return res.status(422).json( response.error('Failed to get user') )
        })
    },
    listAsRoleAsWeb : function(req, res, next) {
        Model.find({ 
            role : req.body.role,
            website : req.body.website
        })
        .populate({ path: 'website' }).select('-__v')
        .then((data) => {
            return res.status(200)
                .json( response.success('User successfully received', data) )
        })
        .catch((err) => {
            console.log(err)
            return res.status(422).json( response.error('Failed to get user') )
        })
    },
    userListByWebsite : function(req, res, next) {
        Model.find({ role : 'customer service', website : req.body.website, is_online : true }).populate({ path: 'website' }).select('-__v')
        .then((data) => {
            return res.status(200)
                .json( response.success('User successfully received', data) )
        })
        .catch((err) => {
            console.log(err)
            return res.status(422).json( response.error('Failed to get user') )
        })
    },
    create: function(req, res, next) {
        Model.findOne({
            username : req.body.username
        })
        .then((data) => {
            if(data) {

                return res.status(422).json( response.error('Username Already Used') )
            } else {
                const user = new Model({
                    username : req.body.username,
                    password : req.body.password,
                    name : req.body.name,
                    role : req.body.role,
                    website : req.body.website ? req.body.website : null
                })
                user.save()
                .then((data) => {
                    return res.status(200)
                        .json( response.success('User successfully created', null) )
                })
                .catch((err) => {
                    console.log(err)
                    return res.status(422).json( response.error('Failed to create user') )
                })
            }
        }).catch((err) => {
            console.log(err)
            return res.status(422).json( response.error('Failed to create user') )
        })
        
    },
    authenticate: function(req, res, next) {
        Model.findOne({
            username : req.body.username
        })
        .then((data) => {
            if(bcrypt.compareSync(req.body.password, data.password)) {
                const token = jwt.sign({id: data._id}, req.app.get('secretKey'), { expiresIn: '4h' });
                Model.findByIdAndUpdate({ _id : data._id},{
                    is_online : true
                })
                .then((dataResponse) => {
                    return res.status(200)
                        .json( response.success('User successfully logined', 
                            { 
                                token: token,
                                username : dataResponse.username,
                                role : dataResponse.role,
                                name : dataResponse.name,
                                id : dataResponse._id,
                                website : dataResponse.website
                            }
                        ))
                })
                .catch((err) => {
                    console.log(err)
                    return res.status(422).json( response.error('Failed to update login status') )
                })
                
            } else {
                return res.status(422).json( response.error('"Invalid username/password!!!') )
            }
        })
        .catch((err) => {
            return res.status(422).json( response.error('Invalid username/password!!!') )
        })
    },
    checkToken : function(req, res ) {
        jwt.verify(req.body.token, req.app.get('secretKey'), (err, decoded) => {
            if (err) {
                Model.findByIdAndUpdate({ _id : decoded.id }, {
                    is_online : false
                })
                .then((response) => {
                    return res.status(422).json( response.error('Token Invalid!!!') )
                })
                .catch((err) => {
                    return res.status(422).json( response.error('Failed to update login status') )
                })
            } else {
                return res.status(200)
                .json( response.success('Token Valid', null) )
            }
        });
    },
    changePassword : function(req, res) {
        Model.findOne({
            username : req.body.username
        })
        .then((data) => {
            if(bcrypt.compareSync(req.body.old_password, data.password)) {
                Model.findOneAndUpdate({
                    username : req.body.username
                }, {
                    password : bcrypt.hashSync(req.body.confirm_password, saltRounds)
                })
                .then((data) => {
                    return res.status(200)
                        .json( response.success('Password succesfully changed', null) )
                })
                .catch((err) => {
                    console.log(err)
                    return res.status(422).json( response.error('Failed to update password!!!') )
                })
            } else {
                return res.status(422).json( response.error('"Old Password Wrong !!!') )
            }
        })
        .catch((err) => {
            console.log(err)
            return res.status(422).json( response.error('Failed to update password!!!') )
        })
    },
    Logout : function(req, res ) {
        jwt.verify(req.body.token, req.app.get('secretKey'), (err, decoded) => {
            if (err) {
                Model.findByIdAndUpdate({ _id : decoded.id }, {
                    is_online : false
                })
                .then((response) => {
                    return res.status(200).json( response.error('Logout!!!') )
                })
                .catch((err) => {
                    return res.status(422).json( response.error('Failed to update login status') )
                })
            } else {
                return res.status(200)
                .json( response.success('Token Valid', null) )
            }
        });
    },
}