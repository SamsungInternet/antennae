module.exports = function (eleventyConfig) {
   eleventyConfig.addFilter("appicon", function (value) {
        const data = Array.isArray(value) ? value[1] : value;
        return new URL(data.icons.sort(function (a,b) {
            const aN = Number(a.sizes.split('x')[0]);
            const bN = Number(b.sizes.split('x')[0]);
            return bN - aN;
        })[0].src, data.baseurl).href;
        return value;
    });
};