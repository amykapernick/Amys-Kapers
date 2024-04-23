const { format, set, parse } = require("date-fns")

const people = [
	{
		id: process.env.NOTION_AMY_ID,
		name: 'Amy'
	},
	{
		id: process.env.NOTION_DAN_ID,
		name: 'Dan'
	}
]

const parseQantas = (notionData) => {
	const events = []

	notionData.forEach(event => {
		const { properties } = event
		const renewalYear = format(parse(properties?.['Status Expiry']?.formula?.date?.start, "yyyy-mm-dd", new Date()), 'yy')

		const data = {
			id: event.id,
			title: properties?.Name?.title[0]?.plain_text,
			date: format(new Date(properties?.Date?.date?.start), 'dd-MMM-yy'),
			reference: properties?.Reference?.rich_text[0]?.plain_text,
			flight: {
				fare: properties?.['Fare Type']?.select?.name,
				locations: {
					origin: properties?.Origin?.select?.name,
					destination: properties?.Destination?.select?.name,
				}
			},
			props: {
				active: properties?.Active?.formula?.boolean,
				future: properties?.Future?.formula?.boolean,
				bonus: properties?.Bonus?.multi_select?.map(({ name }) => name),
				status: properties?.Status?.status?.name,
				year: `${parseInt(renewalYear) - 1}/${renewalYear}`
			},
			points: {
				base: properties?.['Base Points']?.number,
				total: properties?.['Points']?.formula?.number,
			},
			status: {
				base: properties?.['Base Status']?.number,
				total: properties?.['Status Credits']?.formula?.number,
				expiry: properties?.['Status Expiry']?.formula?.date?.start,
			},
			assigned: properties?.Assigned?.people.map(person => people.find(({ id }) => id === person.id)?.name)
		}


		if (data?.flight?.locations?.origin) {
			data.flight.number = data.title
		}

		events.push(data)
	})

	return events
}

module.exports = parseQantas