const Model = require('../models/suggest.model')

module.exports = {
    get: function(req, res, next) {
        Model.find()
        .then((data) => {
            return res.status(200)
                .json( response.success('suggestion successfully received', data) )
        })
        .catch((err) => {
            console.log(err)
            return res.status(422).json( response.error('Failed to get suggestion') )
        })
    },
    find : function(req, res, next) {
        Model.findById(req.body.id)
        .then((data) => {
            return res.status(200)
                .json( response.success('Suggestion successfully received', data) )
        })
        .catch((err) => {
            console.log(err)
            return res.status(422).json( response.error('Failed to get suggestion') )
        })
    },
    create: async(req, res, next) => {
        const exist = await Model.findOne({ description : req.body.description })
        if (exist) {
            return res.status(201).json( response.success('Suggest Already exists', null) )
        }

        await Model.create({
            description : req.body.description,
            key : req.body.key,
            website : req.body.website,
        })
        .then((data) => {
            return res.status(200)
                .json( response.success('Suggestion successfully created', data) )
        })
        .catch((err) => {
            console.log(err)
            return res.status(422).json( response.error('Suggestion to create widget user') )
        })
    },
    update : async (req, res, next) => {
        await Model.findByIdAndUpdate(req.body.id, {
            description : req.body.description,
            key : req.body.key,
            website : req.body.website
        })
        .then((data) => {
            return res.status(200)
                .json( response.success('Suggestion successfully updated', data) )
        })
        .catch((err) => {
            console.log(err)
            return res.status(422).json( response.error('Failed to suggestion widget') )
        })
        
    },
    destroy : function(req, res, next) {
        Model.findByIdAndRemove(req.body.id)
        .then(() => {
            return res.status(200)
                .json( response.success('Suggestion successfully deleted', null) )
        })
        .catch((err) => {
            console.log(err)
            return res.status(422).json( response.error('Failed to delete suggestion') )
        })
    }
}