require('dotenv').config()
const { set } = require('date-fns')
const { Client } = require('@notionhq/client')
const notion = new Client({ auth: process.env.NOTION_WORK_API })

module.exports = async function (context, req) {
    const today = set(new Date(), {
        hours: 0,
        minutes: 0,
        seconds: 0,
        milliseconds: 0
    })
    const filter = req?.query?.filter
    const status = req?.query?.status

    let datesFilter = {
        and: [
            {
                property: 'Dates',
                date: {
                    on_or_after: today
                }
            }
        ]
    }

    if (filter === 'all') {
        datesFilter = {
            and: [
                {
                    property: 'Dates',
                    date: {
                        on_or_after: set(today, { month: 0, date: 1 })
                    }
                }
            ]
        }
    }

    const notionProjects = await notion.databases.query({
        database_id: process.env.PROJECTS_DB_ID,
        filter: datesFilter,
    })

    let projects = notionProjects.results.map(({ properties }) => ({
        name: properties['Project name'].title[0].plain_text,
        status: properties['Status'].status.name,
        dates: properties['Dates']?.date,
        capacity: parseFloat(properties['Capacity (hrs/wk)']?.formula.string?.replace('⏲️ ', '') || '0'),
        hours: properties['Planned Hours']?.rollup.number,
        weeks: properties['Weeks']?.formula.number,
        estimate: properties['Estimate']?.number,
    }))

    if (status === 'current') {
        projects = projects.filter(({ status }) => !['Cancelled', 'Archived', 'Paused', 'Ongoing'].includes(status))
    }

    context.res = {
        body: projects
    };
}