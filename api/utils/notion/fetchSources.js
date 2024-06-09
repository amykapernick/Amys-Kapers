const { Client } = require('@notionhq/client')

const notion = new Client({ auth: process.env.NOTION_API })

const fetchSources = async (...sources) => {
	let sourceDbs = {}

	const notionSources = await notion.databases.query({
		database_id: process.env.NOTION_SOURCES_DB
	}).then(({ results }) => {
		return results.map(({ properties }) => {
			return ({
				slug: properties.Slug.rich_text[0].plain_text,
				id: properties.ID.rich_text[0].plain_text,
			})
		})
	})

	sources.forEach(source => {
		const sourceDb = notionSources.find(({ slug }) => slug === source)
		if (sourceDb) {
			sourceDbs[source] = sourceDb.id
		}
	})

	return sourceDbs
}

module.exports = fetchSources