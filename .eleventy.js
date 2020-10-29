const striptags = require("striptags");
const sharp = require("sharp");
const fs = require("fs");
const fetch = require("node-fetch");

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
	
	return excerpt;
}

async function appIcon(value) {
	const data = value.data || Array.isArray(value) ? value[1] : value;
	const iconurl = new URL(
		data.icons.sort(function (a, b) {
			const aN = Number(a.sizes.split("x")[0]);
			const bN = Number(b.sizes.split("x")[0]);
			return bN - aN;
		})[0].src,
		data.baseurl
	).href;

	if (!iconurl) {
		throw Error('Could not find icon in manifest')
	}

	const filename = iconurl.replace(/[^a-z0-9\-]/gi, "_") + '.png';
	const pathname = '/images/icon-cache/' + filename;
	const localPath = __dirname + '/docs' + pathname;

	if (fs.existsSync(localPath)) {
		return pathname;
	}

	const imageBuffer = await fetch(iconurl)
		.then(response => response.buffer());

	await sharp(imageBuffer)
	.resize(400,400,{
		fit: sharp.fit.inside,
		withoutEnlargement: true
	})
	.toFile(localPath);
	
	return pathname;
}

module.exports = function (eleventyConfig) {
	eleventyConfig.addPassthroughCopy("images");
	eleventyConfig.addPassthroughCopy("scripts");
	eleventyConfig.addPassthroughCopy("styles");
	eleventyConfig.setTemplateFormats("html,11ty.js,md,njk");

	eleventyConfig.addNunjucksAsyncFilter("appicon", function (value, callback) {
		appIcon(value)
		.then(path => {
			callback(null, path);
		});
	});
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
