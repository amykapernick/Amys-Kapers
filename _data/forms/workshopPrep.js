export const os = [
	{
		value: 'mac',
		label: 'MacOS'
	},
	{
		value: 'windows',
		label: 'Windows'
	},
	{
		value: 'linux',
		label: 'Linux'
	}
]

export const browser = [
	{
		value: 'firefox',
		label: 'Firefox'
	},
	{
		value: 'chrome',
		label: 'Chrome'
	},
	{
		value: 'edge',
		label: 'Edge'
	},
	{
		value: 'safari',
		label: 'Safari'
	},
	{
		value: 'ie',
		label: 'IE'
	}
]

export const ide = [
	{
		value: 'code',
		label: 'VS Code'
	},
	{
		value: 'vs',
		label: 'Visual Studio'
	},
	{
		value: 'sublime',
		label: 'Sublime'
	},
	{
		value: 'jetbrains',
		label: 'JetBrains Product'
	}
]

export const node_cli = {
	max: 5,
	min: 0,
	opts: [
		{
			value: 0,
			label: 'Never used it before'
		},
		{
			value: 1,
			label: 'I think I used it once'
		},
		{
			value: 2,
			label: 'Can follow a tutorial'
		},
		{
			value: 3,
			label: 'Fine as long as it works'
		},
		{
			value: 4,
			label: 'Use it regularly'
		},
		{
			value: 5,
			label: 'I can exit vim without Google'
		}
	]
}

export const css_skills = {
	max: 5,
	min: 0,
	opts: [
		{
			value: 0,
			label: 'Never used it before'
		},
		{
			value: 1,
			label: 'Tweaks, sizing, colours'
		},
		{
			value: 2,
			label: 'Bootstrap, Tailwind, etc'
		},
		{
			value: 3,
			label: 'Relatively confident'
		},
		{
			value: 4,
			label: 'Use it regularly'
		},
		{
			value: 5,
			label: 'Build pixel-perfect page'
		}
	]
}

export const js_skills = {
	max: 5,
	min: 0,
	opts: [
		{
			value: 0,
			label: 'Never used it before'
		},
		{
			value: 1,
			label: 'Used it once or twice'
		},
		{
			value: 2,
			label: 'Can follow a tutorial'
		},
		{
			value: 3,
			label: 'Fine as long as it works'
		},
		{
			value: 4,
			label: 'Use it regularly'
		},
		{
			value: 5,
			label: 'I use JS for everything'
		}
	]
}

export const node_version = {
	max: 20,
	min: 10,
	opts: [
		{
			value: 10,
			label: '10.x.x'
		},
		{
			value: 12,
			label: '12.x.x'
		},
		{
			value: 14,
			label: '14.x.x'
		},
		{
			value: 16,
			label: '16.x.x'
		},
		{
			value: 18,
			label: '18.x.x'
		},
		{
			value: 20,
			label: '20.x.x'
		}
	]
}