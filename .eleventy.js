const striptags = require("striptags");

function extractExcerpt(article) {
	if (!article.hasOwnProperty("templateContent")) {
		console.warn(
			'Failed to extract excerpt: Document has no property "templateContent".'
		);
		return null;
	}

	let excerpt = null;
	const content = article.templateContent;

	excerpt = striptags(content)
		.replace(/^\\s+|\\s+$|\\s+(?=\\s)/g, "")
		.replace(/\n/g, " ")
		.trim();
	
	console.log(excerpt);
	
	return excerpt;
}

function appIcon(value) {
	const data = value.data || Array.isArray(value) ? value[1] : value;
	return new URL(
		data.icons.sort(function (a, b) {
			const aN = Number(a.sizes.split("x")[0]);
			const bN = Number(b.sizes.split("x")[0]);
			return bN - aN;
		})[0].src,
		data.baseurl
	).href;
	return value;
}

module.exports = function (eleventyConfig) {
	eleventyConfig.addPassthroughCopy("images");
	eleventyConfig.addPassthroughCopy("styles");
	eleventyConfig.setTemplateFormats("html,11ty.js,md,njk,json");

	eleventyConfig.addFilter("appicon", appIcon);
	eleventyConfig.addFilter("excerpt", extractExcerpt);

	return {
		pathPrefix: "/antennae/",
		passthroughFileCopy: true,
		dir: {
			input: "src",
			output: "docs",
			includes: "_includes",
		},
	};
};
