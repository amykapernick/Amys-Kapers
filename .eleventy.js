const svgContents = require("eleventy-plugin-svg-contents");

module.exports = function(eleventyConfig) {
	eleventyConfig.addPlugin(svgContents);

	eleventyConfig.addPassthroughCopy('img')
	eleventyConfig.addPassthroughCopy('fonts')
	eleventyConfig.addPassthroughCopy('js')

	eleventyConfig.setTemplateFormats(['html', 'md', 'js', 'njk', 'png', 'jpg', 'css'])

	eleventyConfig.setBrowserSyncConfig({
		notify: true,
		watch: true,
	})

	const markdownIt = require('markdown-it')

	eleventyConfig.setLibrary('md', markdownIt({
		html: true,
		breaks: true
	}))
}
