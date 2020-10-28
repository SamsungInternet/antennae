import searchItems from "./search-array.js";
const searchEl = document.getElementById("search");
const searchForm = document.querySelector('.sec-search');

const html = String.raw;

function findParentMatching(el, selector, halt = document.body) {
	if (el === null) return null;
	if (el === halt) return null;
	if (el.matches(selector)) return el;
	if (!el.parentNode) return null;
	return findParentMatching(el.parentNode, selector, halt);
}

function escapeRegExp(string) {
	return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
}

class ComboBox {
	constructor(el, list) {
		this.el = el;
		const listbox = this.listbox = el.querySelector('[role="listbox"]');
		this.input = el.querySelector("input");
		this.input.setAttribute('aria-activedescendent', "");
		const self = this;
		this.input.addEventListener("keydown", function (e) {
			const selected = self.getSelected();
			switch (e.code) {
				case "ArrowUp":
					self.selectPrevious();
					e.preventDefault();
					return false;

				case "ArrowDown":
					self.selectNext();
					e.preventDefault();
					return false;

				case "Escape": {
					self.setValue('');
					e.preventDefault();
					return false;
				}

				case "Enter":
				case "Return":
					if (selected) {
						self.setValue(selected.dataset.value);
						e.preventDefault();
						e.stopPropagation();
						return false;
					}
			}
		});

		this.input.addEventListener("keyup", function (e) {
			this.setAttribute('aria-activedescendent', "");
			switch (e.code) {
				case "ArrowUp":
				case "ArrowDown":
				case "ArrowLeft":
				case "ArrowRight":
				case "Enter":
				case "Escape":
				case "Return":
					return false;
			}

			if (!this.value) {
				listbox.innerHTML = '';
				return;
			}

			const filter = new RegExp(`(.*)(${escapeRegExp(this.value)})(.*)`, "i");
			listbox.innerHTML = list
				.filter(
					([name, description]) =>
						filter.test(name) || filter.test(description)
				)
				.map(
					([name], i) => {
						const match = filter.exec(name);
						if (match) {
							return html`<li id="result-item-${i}" data-value="${name}" role="option">${match[1]}<b>${match[2]}</b>${match[3]}</li>`;
						}
						return html`<li data-match="in-description" id="result-item-${i}" data-value="${name}" role="option">${name}</li>`;
					}
				)
				.sort(str => {
					const match = '<li data-match="in-description"';
					if (str.slice(0, match.length) === match) return 1;
					return 0;
				})
				.join("");

			self.select(self.listbox.children[0]);
		});

		this.listbox.addEventListener('pointerdown', e => {
			const li = findParentMatching(e.target, 'li', e.currentTarget);
			if (!li) return;
			this.select(li);
			this.setValue(li.dataset.value);
		});

		this.input.addEventListener('blur', () => {
			const el = this.getSelected();
			const value = (el && el.dataset.value) || false;
			this.setValue(value);
		});
	}

	setValue(string) {
		if (string !== false) this.input.value = string;
		this.listbox.innerHTML = "";
		this.input.setAttribute('aria-activedescendent', "");
	}

	getSelected() {
		return this.listbox.querySelector('[aria-selected="true"]');
	}

	select(elToSelect) {
		this.input.setAttribute('aria-activedescendent', "");
		for (const el of this.listbox.children) {
			el.setAttribute('aria-selected', false);
			if (el === elToSelect) {
				this.input.setAttribute('aria-activedescendent', el.id);
				el.setAttribute('aria-selected', true);
			}
		}
	}

	selectNext() {
		const currentlySelected = this.getSelected();
		if (!currentlySelected) return;
		const nextEl = currentlySelected.nextElementSibling || currentlySelected.parentNode.children[0];
		this.select(nextEl);
		return nextEl;
	}

	selectPrevious() {
		const currentlySelected = this.getSelected();
		if (!currentlySelected) return;
		const prevEl = currentlySelected.nextElementSibling || this.listbox.children[0];
		this.select(prevEl);
		return prevEl;
	}
}

new ComboBox(searchEl, searchItems);

searchForm.addEventListener('submit', function (e) {
	const value = new FormData(this).get('search');
	for (const [name, , url] of searchItems) {
		if (name === value) location.href = url;
		e.preventDefault();
	}
})
