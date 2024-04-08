const { getYear, getMonth, getDate, addDays, differenceInCalendarDays } = require('date-fns');
const calendarYears = require('../utils/calendar/years')

module.exports = async function (context, req) {
    let response = {
        body: {}
    }
    context.log({ step: 'running calendar' })
    const url = process.env.SITE_DOMAIN
    const events = await fetch(`${url}/api/events?filter=all`)
        .then(res => res.json())
        .catch(error => {
            context.log({ error, step: 'events' })
            response.status = 500
            response.body = {
                error
            }
        });
    const travel = await fetch(`${url}/api/travel?filter=all`).then(res => res.json())
        .catch(error => {
            context.log({ error, step: 'travel' })
            response.status = 500
            response.body = {
                error
            }
        });
    const projects = await fetch(`${url}/api/projects?filter=all&status=current`).then(res => res.json()).catch(error => {
        context.log({ error, step: 'projects' })
        response.status = 500
        response.body = {
            error
        }
    });
    const dates = calendarYears(events)
    const yearDates = {}
    const thisYear = getYear(new Date())
    const data = {
        events,
        trips: travel,
        projects
    }

    Object.entries(data).forEach(([type, events]) => {
        events.forEach(event => {
            const { start, end } = event.dates
            const startDate = {
                year: getYear(new Date(start)),
                month: getMonth(new Date(start)) + 1,
                day: getDate(new Date(start)),
            }
            const endDate = end && {
                year: getYear(new Date(end)),
                month: getMonth(new Date(end)) + 1,
                day: getDate(new Date(end)),
            }

            if (startDate.year < thisYear && endDate.year < thisYear) return

            if (!endDate) event.endDay = true

            dates[startDate.year][startDate.month][startDate.day][type].push({
                ...event,
                startDay: true,
                day: 1
            })

            if (endDate) {
                dates[endDate.year][endDate.month][endDate.day][type].push({
                    ...event,
                    endDay: true,
                    day: differenceInCalendarDays(new Date(end), new Date(start)) + 1
                })

                let currentDate = addDays(new Date(start), 1)

                while (currentDate < new Date(end)) {
                    const year = getYear(currentDate)
                    const month = getMonth(currentDate) + 1
                    const day = getDate(currentDate)

                    dates[year][month][day][type].push({
                        ...event,
                        day: differenceInCalendarDays(currentDate, new Date(start)) + 1
                    })

                    currentDate = addDays(currentDate, 1)
                }
            }
        })
    })

    Object.entries(dates).forEach(([year, months]) => {
        if (!yearDates[year]) yearDates[year] = []

        Object.values(months).forEach((month) => {
            Object.values(month).forEach((day) => {
                yearDates[year].push(day)
            })
        })
    })

    response.body = {
        ...response.body,
        dates: yearDates
    }

    context.res = {
        status: response.status || 200,
        body: response.body
    };
}