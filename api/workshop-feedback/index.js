require('dotenv').config()
const options = require('../_data/forms/workshopFeedback')
const fields = require('../_data/forms/notion/workshopFeedback')

const createPage = require('../utils/notion/createPage')
const formatData = require('../utils/formatFormData')

module.exports = async function (context, req) {
    const params = formatData({
        options,
        data: decodeURIComponent(req.body).split(`&`),
        params: {
            form: 'workshop-feedback'
        }
    })

    await createPage({
        params,
        fields,
        context,
    })

}