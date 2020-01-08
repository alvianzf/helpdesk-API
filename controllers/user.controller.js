const Model = require('../models/user.model')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const response  = require('../helpers/response')

module.exports = {
    get: function(req, res, next) {
        return res.status(200)
        .json( response.success('Testing successfully', null) )
    },
    all: function(req, res, next) {
        Model.find()
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
        Model.findById(req.body.id)
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
        Model.findByIdAndUpdate(req.body.id, {
            name : req.body.name,
            email : req.body.email,
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
    adminList: function(req, res, next) {
        Model.find({ role : 'administrator'})
        .then((data) => {
            return res.status(200)
                .json( response.success('Admin successfully received', data) )
        })
        .catch((err) => {
            console.log(err)
            return res.status(422).json( response.error('Failed to get admin') )
        })
    },
    userList: function(req, res, next) {
        Model.find({ role : 'customer service'})
        .then((data) => {
            return res.status(200)
                .json( response.success('Customer service successfully received', data) )
        })
        .catch((err) => {
            console.log(err)
            return res.status(422).json( response.error('Failed to get customer service') )
        })
    },
    create: function(req, res, next) {
        const user = new Model({
            email : req.body.email,
            password : req.body.password,
            name : req.body.name,
            phone : req.body.phone,
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
    },
    authenticate: function(req, res, next) {
        Model.findOne({
            email : req.body.email,
            role : req.body.role
        })
        .then((data) => {
            if(bcrypt.compareSync(req.body.password, data.password)) {
                const token = jwt.sign({id: data._id}, req.app.get('secretKey'), { expiresIn: '2h' });
                return res.status(200)
                    .json( response.success('User successfully logined', 
                        { 
                            token: token,
                            email : data.email,
                            role : data.role,
                            name : data.name,
                            phone : data.phone
                        }
                    ))
            } else {
                return res.status(422).json( response.error('"Invalid email/password!!!') )
            }
        })
        .catch((err) => {
            console.log(err)
            return res.status(422).json( response.error('Failed to create user') )
        })
    }
}