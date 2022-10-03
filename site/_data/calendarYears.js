const fetch = require("@11ty/eleventy-fetch");
const { set, parse, getMonth, getDate, getDay, getYear, addDays } = require("date-fns");

const days = ['Sun', 'Mon', 'Tues', 'Wed', 'Thu', 'Fri', 'Sat']
const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

module.exports = async () => {
	console.log({ url: `${process.env.SITE_URL}${process.env.API_URL}/events?filter=all` })

	return fetch(`${process.env.SITE_URL}${process.env.API_URL}/events?filter=all`, {
		duration: "10s",
		type: "json"
	}).then(res => {
		const lastEvent = res[res.length - 1]?.dates
		const start = set(new Date(), { month: 0, date: 1 })
		const end = set(
			parse(lastEvent?.end || lastEvent?.start, 'yyyy-MM-dd', new Date()),
			{ month: 11, date: 31 }
		)


		let current = start
		let yearDates = {}
		let offset = 0
		let year = getYear(current)

		while (current <= end) {
			if (getYear(current) !== year) {
				year = getYear(current)
			}

			const date = getDate(current)
			const day = getDay(current)
			const details = {
				month: getMonth(current) + 1,
				date,
				day: days[day],
				offset: offset + date
			}



			if (date == 1) {
				offset = day
				details.offset = offset + date
				details.monthName = months[current.getMonth()]
			}

			if (!yearDates[year]) {
				yearDates[year] = []
			}

			yearDates[year].push(details)

			current = addDays(current, 1)
		}

		return yearDates
	})


}