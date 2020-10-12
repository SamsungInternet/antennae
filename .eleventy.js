module.exports = function(eleventyConfig){
    eleventyConfig.addPassthroughCopy("images");
    eleventyConfig.addPassthroughCopy("styles");
    return {
        passthroughFileCopy: true,
        dir: {
            input: "src",
            output: "_site",
            includes: "includes"
        }
    }
}