export function createForm(id: string): HTMLElement {
	const form = document.createElement("form");
	form.className = "formControl";
	form.id = id;
	return form;
}
