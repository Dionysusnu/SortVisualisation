class ElementSelect<T> {
	constructor(private element: HTMLSelectElement, private obj: Record<string, T>) {
		for (const name of Object.keys(obj)) {
			const x = document.createElement("OPTION");
			x.setAttribute("value", name);
			const t = document.createTextNode(name);
			x.appendChild(t);
			this.element.appendChild(x);
		}
	}

	getChoice() {
		return this.obj[this.element.options[this.element.selectedIndex].value];
	}
}
