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
    },
    manageSplashScreen : async (req, res) => {
        const file = req.file

        if (!file) {
            return res.status(415).json( response.error('File is not supported') )
        } else if (file.size > 5000000) {
            await fs.unlinkSync(file.path)
            return res.status(413).json( response.error('File size too large') )
        }

        await Model.findByIdAndUpdate(req.body.id, {
            splashscreen : file.filename,
            splashscreenduration : req.body.duration
        })
        .then((data) => {
            return res.status(200)
                .json( response.success('Widget splashscreen successfully updated', data) )
        })
        .catch((err) => {
            console.log(err)
            return res.status(422).json( response.error('Failed to update splash screen widget') )
        })
    },
    storeWelcomeText: async (req, res) => {
        try {

            const storeWelcome = await Welcome.create(req.body)

            const widgeExis = await Model.findOne({ _id : req.body.id })
            if (widgeExis) {
                await widgeExis.welcome_text.push(storeWelcome._id)
                const storeWidget = await widgeExis.save()

                return res.status(201).json( response.success('Welcome Message Succesfully Delete', storeWidget) )
            }

            return res.status(400).json( response.error('Widget Not Found', null) )

        } catch (error) {
            console.log(error)
            return res.status(422).json( response.error('Failed to save welcome message') )
        }
    },
    removeWelcomeText: (req, res) => {
        Welcome.findByIdAndRemove(req.body.id)
        .then(() => {
            return res.status(200)
                .json( response.success('welcome text successfully deleted', null) )
        })
        .catch((err) => {
            console.log(err)
            return res.status(422).json( response.error('Failed to delete welcome text') )
        })
    }
}