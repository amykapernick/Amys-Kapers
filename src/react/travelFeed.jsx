import { useEffect, useState } from "react";


const TravelFeed = (props) => {
	const { api } = props
	const [data, setData] = useState(false)

	useEffect(() => {
		fetch(`${api}/travel`, {
			headers: {
				'Content-Type': 'application/json',
			}
		})
			.then((res) => res.json())
			.then((res) => res.filter(({hidden}) => !hidden))
			.then(res => setData(res))
	}, [])

	return (
		<>
			{!data 
				? <p>Loading upcoming...</p>
				: <>
					{data.length ? 
						<ul>
							{data.map(({ country_code, country, city, start, end }) => (
								<li key={start}>
									<img
										loading="lazy"
										height="18"
										width="24"
										alt={`Flag of ${country}`} 
										src={`/img/countries/${country_code}.svg`} 
									/>
									{city ? `${city}, ` : ''}{country}: {start}{end}
								</li>
							))}
						</ul>
						: <p>Nothing right now, I guess the suitcase can actually go away this time...</p>
					}
				</>
			}
			
		</>
	)
}

export default TravelFeed