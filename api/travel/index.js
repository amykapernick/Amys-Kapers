require('dotenv').config()
const { compareAsc, isBefore, isSameDay, format } = require('date-fns')
const countryCode = require('../utils/countryCode')
const parseICS = require('../utils/parseics')

module.exports = async function (context, req) {
    const today = new Date()

    const ics = await fetch(process.env.TRIPIT_URL).then(res => res.text())
    const tripitData = parseICS(ics)

    const filter = req?.query?.filter

    let trips = tripitData.filter(({ allDay }) => allDay)

    if (filter !== 'all') {
        trips = trips
            .filter((trip) => {
                const date = trip.end ? new Date(trip.end) : new Date(trip.start)

                return isSameDay(today, date) || isBefore(today, date)
            })
    }

    trips = trips
        .sort((a, b) => (compareAsc(
            new Date(a.start),
            new Date(b.start)
        )))
        .map(trip => ({
            ...trip,
            start: format(new Date(trip.start), 'dd MMM'),
            end: trip.end ? ` - ${format(new Date(trip.end), 'dd MMM')}` : '',
            dates: {
                end: trip.end && format(new Date(trip.end), 'yyyy-MM-dd'),
                start: format(new Date(trip.start), 'yyyy-MM-dd')
            },
        }))
        .map(({ country = 'Australia', city, ...trip_args }) => {
            if (!city && country == 'Australia') city = 'Perth'
            return ({
                ...trip_args,

                city: city,
                country: country,
                country_code: countryCode(country),
            })
        })

    context.res = {
        body: trips
    };
}