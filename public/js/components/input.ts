export function createInput(
	type: string,
	placeholder: string,
	id: string,
	required: boolean = true
): HTMLElement {
	const input = document.createElement("input");
	input.type = type;
	input.placeholder = placeholder;
	input.className = "formInput";
	input.id = id;
	input.required = required;

	return input;
}
