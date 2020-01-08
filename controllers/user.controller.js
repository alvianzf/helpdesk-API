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
            role : req.body.role
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
}