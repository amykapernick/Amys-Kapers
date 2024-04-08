const { set, parse, getMonth, getDate, getDay, getYear, addDays, setDate, setMonth, lastDayOfYear, parseISO, endOfDay } = require('date-fns')

const days = ['Sun', 'Mon', 'Tues', 'Wed', 'Thu', 'Fri', 'Sat']
const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

const calendarYears = (events = []) => {
	const lastEvent = events[events?.length - 1]?.dates
	const start = set(new Date(), { month: 0, date: 1 })
	const end = set(
		parseISO(
			lastEvent?.end || lastEvent?.start, 'yyyy-MM-dd',
			new Date()
		),
		{
			month: 11,
			date: 31,
			hours: 23,
			minutes: 59,
		}
	)

	let current = start
	let yearDates = {}
	let offset = 0
	let year = getYear(current)
	let dates = {}

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

	Object.entries(yearDates).forEach(([year, days]) => {
		if (!dates[year]) dates[year] = {}

		days.forEach(date => {
			if (!dates[year][date.month]) dates[year][date.month] = {}

			dates[year][date.month][date.date] = {
				...date,
				events: [],
				trips: [],
				projects: []
			}
		})
	})



	return dates
}


module.exports = calendarYears 