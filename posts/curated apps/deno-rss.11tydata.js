const fetch = require("node-fetch");

module.exports = function () {
	return fetch(
		"https://deno-rss.glitch.me/manifest.json"
	).then((r) => r.json());
};
