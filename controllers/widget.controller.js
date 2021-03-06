const Model = require('../models/widget.model'),
    Welcome = require('../models/welcometext.model')
    response  = require('../helpers/response')

module.exports = {
    get: function(req, res, next) {
        Model.find().populate({ path: 'website'}).select('-__v')
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
        const widgetExis = await Model.findOne({ website : req.body.website })
        if (widgetExis) {
            return res.status(201).json( response.success('You only allow to add 1 widget for 1 website', null) )
        }

        await Model.create({
            name : req.body.name,
            title : req.body.title,
            subtitle : req.body.subtitle,
            background_color : req.body.background_color,
            text_color : req.body.text_color,
            website : req.body.website
        })
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
        if(file) {
            if (file && file.size > 5000000) {
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
        } else {
            await Model.findByIdAndUpdate(req.body.id, {
                name : req.body.name,
                title : req.body.title,
                subtitle : req.body.subtitle,
                background_color : req.body.background_color,
                text_color : req.body.text_color
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
        
    },
    manageSplashScreen : async (req, res) => {
        const file = req.file
        if(file) {
            if (file.size > 5000000) {
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
        } else {
            await Model.findByIdAndUpdate(req.body.id, {
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
        }
        
    },
    storeWelcomeText: async (req, res) => {
        const { message } = req.body
        try {

            const newWelcome = new Welcome({
                message
            })

            const storeWelcome = await newWelcome.save()

            const widgetExis = await Model.findOne({ _id : req.body.id })
            if (widgetExis) {
                await widgetExis.welcome_text.push(storeWelcome._id)
                const storeWidget = await widgetExis.save()

                return res.status(201).json( response.success('Welcome Message Succesfully Delete', storeWidget) )
            }

            return res.status(400).json( response.error('Widget Not Found', null) )

        } catch (error) {
            console.log(error)
            return res.status(422).json( response.error('Failed to save welcome message') )
        }
    },
    removeWelcomeText: (req, res) => {
        Welcome.findByIdAndRemove({ _id : req.body.widget_id})
        .then(() => {
            return res.status(200)
                .json( response.success('welcome text successfully deleted', null) )
        })
        .catch((err) => {
            console.log(err)
            return res.status(422).json( response.error('Failed to delete welcome text') )
        })
    },
    find: (req, res) => {
        Model.findById(req.body.id)
        .populate({ path: 'website'})
        .populate({ path: 'welcome_text'}).select('-__v')
        .then((data) => {
            return res.status(200)
                .json( response.success('widget received successfully', data) )
        })
        .catch((err) => {
            console.log(err)
            return res.status(422).json( response.error('Failed to get widget') )
        })
    },
    manageReminder: (req, res) => {
        Model.findByIdAndUpdate(req.body.id, {
            reminder_text : req.body.reminder_text,
            reminder_duration : req.body.reminder_duration
        })
        .then((data) => {
            return res.status(200)
                .json( response.success('Widget reminder successfully updated', data) )
        })
        .catch((err) => {
            console.log(err)
            return res.status(422).json( response.error('Failed to update reminder widget') )
        })
    }
}