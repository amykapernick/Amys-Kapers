import { useEffect, useState } from "react"
import statusDetails from '@data/status'

const QantasInfo = (props) => {
	const { api } = props
	const authKey = new URLSearchParams(window?.location?.search).get('auth')
	const [ allData, setAllData ] = useState([])
	const [people, setPeople] = useState([])
	const checkStatus = (props) => {
		const { lifetime, status } = props
		let levels = props.level
	
		statusDetails.forEach((level, i) => {
			const nextLevel = statusDetails[i + 1]

			if(status >= level.required) {
				levels.status = {
					name: level.name
				}

				if(nextLevel) {
					levels.status.remaining = nextLevel.required - status
					levels.status.next = nextLevel.name
				}
			}
	
			if(lifetime >= level.lifetime) {
				levels.lifetime = level.name

				if(nextLevel) {
					levels.lifetime.remaining = nextLevel.lifetime - lifetime
					levels.lifetime.next = nextLevel.name
				}
			}
		})
		
		return levels
	}
	
	useEffect(() => {
		if (!authKey) return

		fetch(`${api}/qantas?auth=${authKey}`)
			.then((res) => res.json())
			.then(res => setAllData(res.data))
			.catch((err) => {
				console.log({ fetch: "qantas", err });

				return [];
			});
	}, [])

	useEffect(() => {
		const sortedData = {}
		const data = []

		allData?.forEach(item => {
			item.assigned.forEach(person => {
				if (!sortedData[person]) sortedData[person] = []

				sortedData[person].push(item)
			})
		})

		Object.entries(sortedData).forEach(([person, events]) => {
			let personData = {
				name: person,
				stats: {
					points: 0,
					status: 0,
					lifetime: 0,
					level: {
						status: {
							name: 'None',
						},
						lifetime: {
							name: 'None',
						}
					},
				},
				events,
				years: {}
			}

			events.forEach((event) => {
				if(!personData.years[event.props.year]) {
					personData.years[event.props.year] = {
						points: 0,
						status: 0,
						lifetime: 0,
						level: {
							status: 'None',
							lifetime: 'None'
						},
						events: []
					}
				}

				if(event?.points?.total) {
					personData.stats.points += event.points.total

					personData.years[event.props.year].points += event.points.total
				}

				if(event?.status?.total) {
					personData.years[event.props.year].status += event.status.total

					if(!event?.props?.future) personData.stats.lifetime += event.status.total

					if(event.props?.active) personData.stats.status += event.status.total
				}

				personData.years[event.props.year].events.push(event)
			})

			personData.stats.level = checkStatus(personData.stats)

			Object.entries(personData.years).forEach(([year, data]) => {
				personData.years[year].levels = checkStatus(data)
			})

			data.push(personData)
		})

		setPeople(data)

	}, [allData])


	return (
		<>
			<h2>Summary</h2>
			<dl>
				<span>
					<dt>Total Points</dt>
					<dd>{people.reduce((acc, {stats}) => acc + stats.points, 0).toLocaleString()}</dd>
				</span>
			</dl>
			<ul>
				{people.map(({name, stats, years}) => (
					<li key={name}>
						<h2>{name}</h2>
						<dl>
							<span>
							<dt>Qantas Points</dt>
							<dd>{stats.points.toLocaleString()}</dd>
							</span><span>
							<dt>Status Credits</dt>
							<dd>{stats.status.toLocaleString()}</dd>
							</span><span><dt>Lifetime Status Credits</dt>
							<dd>{stats.lifetime.toLocaleString()}</dd>
							</span><span><dt>Current Status</dt>
							<dd>{stats.level.status.name}</dd>
							</span><span><dt>Lifetime Status</dt>
							<dd>{stats.level.lifetime.name}</dd></span>
						</dl>
						{Object.entries(years).map(([year, data]) => (
								<details key={year}>
									<summary>{year}</summary>
									<dl>
									<span><dt>Qantas Points</dt>
										<dd>{data.points.toLocaleString()}</dd>
										</span><span><dt>Status Credits</dt>
										<dd>{data.status.toLocaleString()}</dd>
										</span><span><dt>Current Status</dt>
										<dd>{data.level.status.name}</dd>
										</span><span><dt>Lifetime Status</dt>
										<dd>{data.level.lifetime.name}</dd></span>
									</dl>
								</details>
							))}
					</li>	
				))}
			</ul>
		</>
	)
}

export default QantasInfo