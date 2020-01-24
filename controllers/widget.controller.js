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
    }
}