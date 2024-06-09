const { Client } = require('@notionhq/client')
const fetchSources = require('../utils/notion/fetchSources')

const notion = new Client({ auth: process.env.NOTION_EVENTS_API })

const sumArray = (arr) => arr.reduce((a, b) => a + b, 0)

module.exports = async function (context, req) {
    const { databaseInvites, databaseGuests } = await fetchSources('databaseInvites', 'databaseGuests')
    const notionInvites = await notion.databases.query({
        database_id: databaseInvites,
        filter: {
            property: 'Status',
            status: {
                does_not_equal: 'Not Invited'
            }

        }
    })
    const statusCounts = {}
    const attendeeCounts = {
        'Attending': {
            Adults: 0,
            Children: 0
        },
        'Not Attending': {
            Adults: 0,
            Children: 0
        },
        "Pending": {
            Adults: 0,
            Children: 0
        }
    }

    const invites = notionInvites?.results?.map(({ properties }) => ({
        ...properties
    }))

    invites.forEach(invite => {
        const status = invite?.Status?.status?.name

        if (!statusCounts[status]) statusCounts[status] = 0

        attendeeCounts['Attending'].Adults += invite?.['Adults RSVPed']?.formula?.number || 0
        attendeeCounts['Attending'].Children += invite?.['Children RSVPed']?.formula?.number || 0
        attendeeCounts['Not Attending'].Adults += invite?.['Adults Declined']?.formula?.number || 0
        attendeeCounts['Not Attending'].Children += invite?.['Children Declined']?.formula?.number || 0
        attendeeCounts['Pending'].Adults += invite?.['Adults Pending']?.formula?.number || 0
        attendeeCounts['Pending'].Children += invite?.['Children Pending']?.formula?.number || 0

        statusCounts[status]++
    })

    attendeeCounts['Total Headcount*'] = {
        Adults: sumArray([
            attendeeCounts['Attending'].Adults,
            attendeeCounts['Pending'].Adults
        ]),
        Children: sumArray([
            attendeeCounts['Attending'].Children,
            attendeeCounts['Pending'].Children
        ]),
    }

    statusCounts['Total'] = sumArray(Object.values(statusCounts))

    context.res = {
        status: 200,
        body: {
            statusCounts,
            attendeeCounts,
        }
    };
}