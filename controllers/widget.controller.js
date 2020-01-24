const Model = require('../models/widget.model'),
    Welcome = require('../models/welcometext.model')
    response  = require('../helpers/response')

module.exports = {
    get: function(req, res, next) {
        Model.find()
        .then((data) => {
            return res.status(200)
                .json( response.success('widget successfully received', data) )
        })
        .catch((err) => {
            console.log(err)
            return res.status(422).json( response.error('Failed to get widget') )
        })
    },
    create: async(req, res, next) => {
        const widgetExists = await Model.findOne({
            website : req.body.website
        })

        if (widgetExists) {
            return res.status(200)
                .json( response.success('widget already created', widgetExists) )
        }
        await Model.create(req.body)
        .then((data) => {
            return res.status(200)
                .json( response.success('widget successfully created', data) )
        })
        .catch((err) => {
            console.log(err)
            return res.status(422).json( response.error('Failed to create widget user') )
        })
    },
    update : async (req, res, next) => {
        const file = req.file

        if (!file) {
            return res.status(415).json( response.error('File is not supported') )
        } else if (file.size > 5000000) {
            await fs.unlinkSync(file.path)
            return res.status(413).json( response.error('File size too large') )
        }

        await Model.findByIdAndUpdate(req.body.id, {
            name : req.body.name,
            title : req.body.title,
            subtitle : req.body.subtitle,
            background_color : req.body.background_color,
            text_color : req.body.text_color,
            logo : file.filename
        })
        .then((data) => {
            return res.status(200)
                .json( response.success('Widget successfully updated', data) )
        })
        .catch((err) => {
            console.log(err)
            return res.status(422).json( response.error('Failed to update widget') )
        })
    }
}