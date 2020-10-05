const fetch = require("node-fetch");

module.exports = async function () {
	const data = await fetch(
		"https://deno-rss.glitch.me/manifest.json"
	).then((r) => r.json());

	return data;
};
