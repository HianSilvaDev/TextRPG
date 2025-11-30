export function createButton(text, id, typeBtn, className = "formButton") {
	const button = document.createElement("button");
	button.id = id;
	button.className = className;
	button.innerText = text;
	button.type = typeBtn;

	return button;
}
