import searchItems from "./search-array.js";
const searchEl = document.getElementById("search");
const html = String.raw;


function escapeRegExp(string) {
	return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
}

class ComboBox {
	constructor(el, list) {
		this.el = el;
		const listbox = this.listbox = el.querySelector('[role="listbox"]');
		this.input = el.querySelector("input");
		this.input.addEventListener("keyup", function () {
			const filter = new RegExp(`(.*)(${escapeRegExp(this.value)})(.*)`, "i");
			listbox.innerHTML = list
				.filter(
					([name, description, url]) =>
						filter.test(name) || filter.test(description)
				)
				.map(
					([name, description, url]) => {
						const match = filter.exec(name);
						if (match) {
							return html`<li>${match[1]}<b>${match[2]}</b>${match[3]}</li>`;
						}
						return html`<li>${name}</li>`;
					}
				)
				.join("");
		});
	}
}

const comboBox = new ComboBox(searchEl, searchItems);
