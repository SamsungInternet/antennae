const fetch = require('node-fetch');

module.exports = async function data() {
	const data = await fetch("https://deno-rss.glitch.me/manifest.json")
		.then((r) =>
			r.json()
		);

	data.baseurl = "https://deno-rss.glitch.me/";

	return data;
};
