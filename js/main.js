const travel = [
		{
			start: '2019-11-02',
			end: '2019-11-09',
			city: 'Orlando',
			country: 'United States',
		},
		{
			start: '2019-11-22',
			end: '2019-11-24',
			city: 'Adelaide',
		},
		{
			start: '2019-11-29',
			end: '2019-12-14',
			city: 'Brisbane',
		},
		{
			start: '2020-01-27',
			end: '2020-02-03',
			city: 'London',
			country: 'United Kingdom',
		},
	],
	events = [
		{
			start: '2019-11-04',
			end: '2019-11-08',
			name: 'Microsoft Ignite',
			type: 'attending',
		},
		{
			start: '2019-11-23',
			name: 'DDD Adelaide',
			type: 'speaking',
		},
		{
			start: '2019-11-30',
			name: 'DDD Brisbane',
			type: 'speaking',
		},
		{
			start: '2019-12-09',
			end: '2019-12-10',
			name: 'YOW! Brisbane',
			type: 'attending',
		},
		{
			start: '2020-01-29',
			end: '2020-01-31',
			name: 'NDC London',
			type: 'speaking',
		},
	]

document.addEventListener('DOMContentLoaded', () => {
	const section = document.querySelector('#where'),
		location = section.querySelector('.location'),
		conference = section.querySelector('.conference'),
		trips = section.querySelector('.trips'),
		conferences = section.querySelector('.conferences'),
		today = new Date()

	let city = 'Perth',
		country = 'Australia',
		currentTrip = '',
		conf,
		tripList,
		confList

	travel.some(trip => {
		let away = false

		if (dateFns.isSameDay(today, new Date(trip.start))) {
			away = true
		} else if (dateFns.isAfter(today, new Date(trip.start))) {
			if (dateFns.isBefore(today, new Date(trip.end))) {
				away = true
			} else if (dateFns.isSameDay(today, new Date(trip.end))) {
				away = true
			}
		} else {
			return false
		}

		if (away) {
			city = trip.city
			country = trip.country
			currentTrip = `(${dateFns.format(new Date(trip.start), 'DD MMM')} - ${dateFns.format(new Date(trip.end), 'DD MMM')})`

			return true
		}
	})

	events.some(event => {
		let atConf = false
		if (dateFns.isSameDay(today, new Date(event.start))) {
			atConf = true
		} else if (dateFns.isAfter(today, new Date(event.start))) {
			if (dateFns.isBefore(today, new Date(event.end))) {
				atConf = true
			} else if (dateFns.isSameDay(today, new Date(event.end))) {
				atConf = true
			}
		} else {
			return false
		}

		if (atConf) {
			conf = `at ${event.name}`

			return true
		}
	})

	tripList = travel.map(trip => {
		let country = trip.country || 'Australia',
			start = dateFns.format(new Date(trip.start), 'DD MMM'),
			end = trip.end ? `- ${dateFns.format(new Date(trip.end), 'DD MMM')}` : false,
			classes = country.toLowerCase().replace(' ', '-')

		if (dateFns.isAfter(new Date(trip.start), today)) {
			return `<li class="${classes}">${trip.city}, ${country}: ${start} ${end}</li>`
		}
	})

	confList = events.map(event => {
		let start = dateFns.format(new Date(event.start), 'DD MMM'),
			end = event.end ? `- ${dateFns.format(new Date(event.end), 'DD MMM')}` : '',
			name = event.name,
			classes = event.type

		if (dateFns.isAfter(new Date(event.start), today)) {
			return `<li class="${classes}">${name}: ${start} ${end}</li>`
		}
	})

	let countryClass = country.toLowerCase().replace(' ', '-')

	location.innerHTML = `${city}, ${country} ${currentTrip}`
	location.classList.add(countryClass)
	conference.innerHTML = conf ? conf : ''
	trips.innerHTML = tripList.join('')
	conferences.innerHTML = confList.join('')
})