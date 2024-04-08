require('dotenv').config()
const { Client } = require('@notionhq/client')
const Sentry = require('@sentry/node')

const notion = new Client({
    auth: process.env.NOTION_API
})

Sentry.init({
    dsn: process.env.SENTRY_DSN
})

module.exports = async ({ params, fields, context }) => {
    let data = {}
    let props = {}

    // context.log({ params, fields })

    Object.entries(params).forEach(([key, val]) => {
        const section = fields[key]

        if (!section) {
            props[key] = val

            return;
        }
        else if (!section.type || !section.name) {
            return;
        }

        if (section.type == 'rich_text') {
            data[section.name] = {
                [section.type]: [
                    {
                        type: "text",
                        text: {
                            content: val
                        }
                    },
                ]
            }
        }
        else if (section.type == 'multi_select') {
            const opts = []

            if (val == "") return;

            if (Array.isArray(val)) {
                val.forEach(e => {
                    opts.push({
                        name: e
                    })
                })
            }
            else {
                opts.push({
                    name: val
                })
            }

            data[section.name] = {
                [section.type]: opts
            }

        }
        else {
            data[section.name] = {
                [section.type]: {
                    name: val
                }
            }
        }

    })

    // context.log({ ...data, params })

    await notion.pages.create({
        parent: {
            database_id: props.notion_page
        },
        properties: {
            title: {
                title: [
                    {
                        text: {
                            content: params.name || 'Anonymous'
                        }
                    }
                ]
            },
            ...data,
        }
    })
        .then(response => {
            const url = params.redirect
            context.log({ response })

            context.res = {
                status: 302,
                headers: {
                    Location: url
                },
                body: {}
            }

            context.done()
        })
        .catch(err => {
            context.log({ err })

            Sentry.captureException(err)
            Sentry.flush(2000)

            context.res = {
                status: err.code || 400,
                headers: {
                    Location: params.page
                },
                body: {}
            }

            context.done()
        })
}