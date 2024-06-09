import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import rehypeFigure from '../src/utils/rehypeFigure';
import { markdownRemarkExtract } from '../src/utils/markdownExcerpt';
import react from "@astrojs/react";

export default defineConfig({
	site: 'https://amyskapers.dev',
	vite: {
		css: {
			postcss: `./config`
		},
		resolve: {
			alias: [
				{
					find: '@mixins',
					replacement: `./src/styles/mixins/index.css`
				}
			]
		},
	},
	// markdown: {
	// 	syntaxHighlight: 'prism',
	// 	rehypePlugins: [
	// 		'rehype-external-links',
	// 		[rehypeFigure, { allImages: true, useTitle: true }],
	// 		'rehype-picture'
	// 	],
	// 	remarkPlugins: [
	// 		['remark-oembed', { syncWidget: true, asyncImg: true }],
	// 		'remark-hint',
	// 		'remark-squeeze-paragraphs',
	// 		markdownRemarkExtract
	// 	],
	// 	extendDefaultPlugins: true,
	// },
	integrations: [sitemap(), react()]
});  