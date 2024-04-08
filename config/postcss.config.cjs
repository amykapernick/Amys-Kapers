const stylelint = require('stylelint')
const nesting = require('postcss-nesting')
const staticVariables = require('postcss-advanced-variables')
const rgbahex = require('postcss-hexrgba')

const colours = require('../src/styles/config/colours')
const variables = require('../src/styles/config/variables')

module.exports = {
	plugins: [
		staticVariables({
			disable: "@import",
			variables: {
				...colours,
				...variables
			},
		}),
		rgbahex,
		nesting({
			noIsPseudoSelector: true
		}),
		// stylelint({
		// 	configFile: `./config/.stylelint.config.cjs`,
		// 	quiet: true
		// })
	],
};