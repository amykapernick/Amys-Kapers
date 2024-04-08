require('dotenv').config()
const options = require('../_data/forms/talkFeedback')
const fields = require('../_data/forms/notion/talkFeedback')

const createPage = require('../utils/notion/createPage')
const formatData = require('../utils/formatFormData')

module.exports = async function (context, req) {
    context.log({ req })

    const params = formatData({
        options,
        data: decodeURIComponent(req.body).split(`&`),
        params: {
            form: 'talk-feedback'
        }
    })

    await createPage({
        params,
        fields,
        context,
    })
}