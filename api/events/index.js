require('dotenv').config()
const { set } = require('date-fns')
const formatDate = require('../utils/formatDate')
const { Client } = require('@notionhq/client')
const notion = new Client({ auth: process.env.NOTION_EVENTS_API })

module.exports = async function (context, req) {
    const today = new Date()
    const filter = req?.query?.filter
    let eventsFilter = {
        and: [
            {
                property: 'Conference',
                date: {
                    on_or_after: today
                }
            }
        ]
    }

    if (filter === 'all') {
        eventsFilter = {
            and: [
                {
                    property: 'Conference',
                    date: {
                        on_or_after: set(today, { month: 0, date: 1 })
                    }
                }
            ]
        }
    }

    const notionEvents = await notion.databases.query({
        database_id: process.env.EVENTS_DB_ID,
        filter: eventsFilter,
        sorts: [
            {
                property: 'Conference',
                direction: 'ascending'
            }
        ]
    })

    const events = notionEvents.results.map(({ properties }) => ({
        start: properties.Conference.date.start,
        end: properties.Conference.date.end,
        name: properties.Name.title[0].plain_text,
        type: properties.Type.multi_select.map(({ name }) => name.toLowerCase()),
        url: properties.URL.url,
        hidden: properties.Hidden.checkbox,
        cfp: properties['CFP Status'].status.name
    }))
        .map(event => ({
            ...event,
            start: formatDate(event.start, 'dd MMM'),
            end: event.end ? ` - ${formatDate(event.end, 'dd MMM')}` : '',
            dates: {
                end: event.end && formatDate(event.end, 'yyyy-MM-dd'),
                start: formatDate(event.start, 'yyyy-MM-dd')
            },
            hidden: event.type?.length < 1 ? true : event.hidden
        }))
        .filter(({ cfp }) => !['Rejected', 'Declined/Conflict'].includes(cfp))

    context.res = {
        body: events
    };
}