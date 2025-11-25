export function createButton(
	text: string,
	id: string,
	typeBtn: "submit" | "button" | "reset" = "submit",
	className: string = "formButton"
): HTMLElement {
	const button = document.createElement("button");
	button.id = id;
	button.className = className;
	button.innerText = text;
	button.type = typeBtn;

	return button;
}
