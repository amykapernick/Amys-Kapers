require('dotenv').config()
const { Client } = require('@notionhq/client')
const { NotionToMarkdown } = require('notion-to-md')
const fetchSources = require('../utils/notion/fetchSources')

const notion = new Client({ auth: process.env.NOTION_EVENTS_API })

const fetchData = async (props) => {
    const { page_size = 100, start_cursor = undefined, database_id } = props

    return await notion.databases.query({
        database_id,
        sort: [
            {
                "property": "Name",
                "direction": "ascending"
            }
        ],
        page_size: page_size,
        start_cursor: start_cursor
    })
        .then(res => {
            return res
        })
        .catch(error => error)
}

const fetchAllData = async (params = { page_size: 100 }, data = []) => {
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
    const { workshopHtmlElements } = await fetchSources('workshopHtmlElements')
    let data = {}

    if (!req?.query?.element) {
        const notionData = await fetchAllData({ database_id: workshopHtmlElements });

        data = notionData.map(({ properties, id, url }) => {
            return ({
                name: properties.Name.title[0].plain_text,
                mdn: properties.MDN.url,
                html: properties['HTML Reference'].url,
                votes: properties.Votes.number,
                id: id,
                url: url
            })
        })
            .sort((a, b) => a.name.localeCompare(b.name))
    }
    else {
        const n2m = new NotionToMarkdown({
            notionClient: notion
        })

        const notionData = await notion.pages.retrieve({ page_id: req.query.element });
        const pageContent = await n2m.pageToMarkdown(req.query.element)

        data = {
            name: notionData.properties.Name.title[0].plain_text,
            mdn: notionData.properties.MDN.url,
            html: notionData.properties['HTML Reference'].url,
            votes: notionData.properties.Votes.number,
            markdown: n2m.toMarkdownString(pageContent)?.parent
        }
    }

    context.res = {
        body: data
    };
}

