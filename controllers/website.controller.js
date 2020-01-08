const Model = require('../models/website.model'),
    response  = require('../helpers/response')

module.exports = {
    get: function(req, res, next) {
        Model.find()
        .then((data) => {
            return res.status(200)
                .json( response.success('Website successfully received', data) )
        })
        .catch((err) => {
            console.log(err)
            return res.status(422).json( response.error('Failed to get website') )
        })
    },
    create : function(req, res, next) {
        const website = new Model({
            name : req.body.name,
            ip : req.body.ip
        })
        website.save()
        .then((data) => {
            return res.status(200)
                .json( response.success('Website successfully created', null) )
        })
        .catch((err) => {
            console.log(err)
            return res.status(422).json( response.error('Failed to website user') )
        })
    },
    find : function(req, res, next) {
        Model.findById(req.body.id)
        .then((data) => {
            return res.status(200)
                .json( response.success('Website successfully received', data) )
        })
        .catch((err) => {
            console.log(err)
            return res.status(422).json( response.error('Failed to get website') )
        })
    },
    patch : function(req, res, next) {
        Model.findByIdAndUpdate(req.body.id, {
            name : req.body.name,
            ip : req.body.ip
        })
        .then((data) => {
            return res.status(200)
                .json( response.success('Website successfully updated', null) )
        })
        .catch((err) => {
            console.log(err)
            return res.status(422).json( response.error('Failed to update website') )
        })
    },
    destroy : function(req, res, next) {
        Model.findByIdAndRemove(req.body.id)
        .then(() => {
            return res.status(200)
                .json( response.success('Website successfully deleted', null) )
        })
        .catch((err) => {
            console.log(err)
            return res.status(422).json( response.error('Failed to delete website') )
        })
    }
}