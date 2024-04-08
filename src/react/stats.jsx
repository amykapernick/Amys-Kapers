import { useEffect, useState } from "react";

const colours = {
	'Not Attending': '#AD1728',
	'Attending': '#275942',
	'Pending': '#364c93',
	'Invited': '#364c93',
	'Invitation': '#BB5C04',
	'Declined': '#AD1728',
	'RSVPed': '#275942',
}

const TravelFeed = (props) => {
	const { api } = props
	const [data, setData] = useState(false)

	useEffect(() => {
		fetch(`${api}/stats`, {
			headers: {
				'Content-Type': 'application/json',
			}
		})
			.then((res) => res.json())
			.then(res => setData(res))
	}, [])

	return (
		<>
			{!data 
				? <p>Loading stats...</p>
				: <dl>
					{Object.entries(data?.statusCounts).map(([status, count]) => (
						<span key={status} style={{'--colour': colours[status]}}>
							<dt>{status}</dt>
							<dd>{count}</dd>
						</span>
					))}
					{Object.entries(data?.attendeeCounts).map(([status, counts]) => (
						<span key={status} className="double" style={{'--colour': colours[status]}}>
							<dt>{status}</dt>
							<dd>
								<dl>
									{Object.entries(counts).map(([attendee, count]) => (
										<span key={attendee}>
											<dt>{attendee}</dt>
											<dd>{count}</dd>
										</span>
									))}	
								</dl>	
							</dd>
						</span>
					))}
				</dl>
			}
			
		</>
	)
}

export default TravelFeed