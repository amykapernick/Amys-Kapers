import { useEffect, useState } from "react";

const icons = {
	speaking: {
		img: "mic",
		alt: "speaking",
	},
	organising: {
		img: "notes",
		alt: "organising",
	},
	attending: {
		img: "badge",
		alt: "",
	},
	workshop: {
		img: "presentation",
		alt: "running a workshop",
	},
};

const EventFeed = (props) => {
	const { api } = props
	const [data, setData] = useState(false)


	useEffect(() => {
		fetch(`${api}/events`, {
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
							{data.map(({ type, name, start, end, url}) => {
								const content = <>
									{type?.map((t) => (
										<img 
											loading="lazy"
											height="18"
											width="24"
											key={t}
											alt={icons[t].alt}
											src={`img/icons/${icons[t].img}.svg`}
										/>
									))}
									{name}: {start}{end}
								</>
								return (
									<li key={name}>
										{url ?
											<a
												href={url} 
												target="_blank"
											>
												{content}
											</a>
										: 
											<>{content}</>
										}
										
									</li>
								)
							})}
						</ul>
						: <p>Be right back, taking a much needed break</p>
					}
				</>
			}
			
		</>
	)
}

export default EventFeed