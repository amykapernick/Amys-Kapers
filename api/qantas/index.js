const { Client } = require('@notionhq/client')
const parseQantas = require('../utils/parseQantas')
const { addYears, set } = require('date-fns')
const notion = new Client({ auth: process.env.NOTION_EVENTS_API })

const fetchData = async (props) => {
    const { page_size = 100, start_cursor = undefined, filter = undefined } = props

    return await notion.databases.query({
        database_id: process.env.QANTAS_DB_ID,
        sorts: [
            {
                property: 'Date',
                direction: 'ascending'
            }
        ],
        filter: filter,
        page_size: page_size,
        start_cursor: start_cursor
    })
        .then(res => {
            return res
        })
        .catch(error => error)
}

const fetchAllData = async (params = { page_size: 100, filter: undefined }, data = []) => {
    const res = await fetchData(params);

    if (res?.results) {
        data.push(...res.results);
    }

    if (res?.has_more) {
        return fetchAllData({
            ...params,
            start_cursor: res.next_cursor,
        }, data);
    }

    return data;
};

module.exports = async function (context, req) {
    if (req.query.auth !== process.env.API_KEY) {
        context.res = { status: 401, body: 'Unauthorized' }

        return;
    }

    let filter = undefined
    let nextRenewal = set(new Date(), {
        month: 9,
        date: 31
    })
    let lastRenewal = addYears(nextRenewal, -1)

    if (new Date() > nextRenewal) {
        nextRenewal = addYears(nextRenewal, 1)
        lastRenewal = addYears(lastRenewal, 1)
    }

    if (req?.query?.year === 'current') {
        filter = {
            property: 'Date',
            date: {
                "on_or_before": nextRenewal,
                "after": lastRenewal
            }
        }
    }
    else if (req?.query?.year === 'next') {
        filter = {
            property: 'Date',
            date: {
                "on_or_before": addYears(nextRenewal, 1),
                "after": nextRenewal
            }
        }
    }
    else if (req?.query?.year === 'previous') {
        filter = {
            property: 'Date',
            date: {
                "on_or_before": lastRenewal,
                "after": addYears(lastRenewal, -1)
            }
        }
    }

    const notionData = await fetchAllData({ filter });
    let data = []

    if (false) { }
    else {
        data = parseQantas(notionData)
    }

    context.res = {
        body: {
            results: data?.length,
            data
        }
    };
}