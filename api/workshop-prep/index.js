require('dotenv').config()
const options = require('../_data/forms/workshopPrep')
const fields = require('../_data/forms/notion/workshopPrep')

const createPage = require('../utils/notion/createPage')
const formatData = require('../utils/formatFormData')


module.exports = async function (context, req) {
    const params = formatData({
        options,
        data: decodeURIComponent(req.body).split(`&`),
        params: {
            form: 'workshop-prep'
        }
    })

    await createPage({
        params,
        fields,
        context,
    })
}