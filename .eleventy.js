module.exports = function (eleventyConfig) {

	eleventyConfig.addPassthroughCopy("images");
    eleventyConfig.addPassthroughCopy("styles");
	eleventyConfig.setTemplateFormats("html,11ty.js,md,njk");

	eleventyConfig.addFilter("appicon", function (value) {
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
    });
    
	return {
		pathPrefix: '/antennae/',
		passthroughFileCopy: true,
        dir: {
			input: "src",
			output: "docs",
			includes: "_includes"
        }
    }
};
